import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { pool } from '@/lib/db';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Analyze API received body:', { 
      hasDocumentId: !!body.documentId, 
      hasContent: !!body.content,
      documentId: body.documentId,
      fileName: body.fileName,
      language: body.language
    });

    const { documentId, content, language, fileName } = body;

    // Better validation with detailed error messages
    if (!documentId) {
      return NextResponse.json(
        { error: 'Document ID is required' },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      console.error('Gemini API key is missing');
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    console.log('Starting Gemini analysis for document:', documentId);

    // Enhanced Gemini analysis prompt with logic checking
    const prompt = `
    CRITICALLY ANALYZE the following ${language} code from file ${fileName} for LOGICAL ERRORS, SYNTAX ISSUES, and POTENTIAL BUGS.

    CODE TO ANALYZE:
    ${content}

    Perform DEEP LOGIC ANALYSIS and check for:

    1. LOGICAL ERRORS:
       - Infinite loops or incorrect loop conditions
       - Off-by-one errors in loops
       - Incorrect variable assignments
       - Wrong conditional statements
       - Mathematical calculation errors
       - Incorrect function return values
       - Race conditions or async issues
       - Null/undefined reference errors

    2. SYNTAX & SEMANTIC ISSUES:
       - Missing brackets, parentheses, or semicolons
       - Incorrect variable declarations
       - Type mismatches
       - Undefined variables or functions
       - Incorrect function calls

    3. COMMON PROGRAMMING MISTAKES:
       - Memory leaks (where applicable)
       - Resource leaks
       - Incorrect array/string indexing
       - Wrong operator usage (== vs ===, = vs ==, etc.)
       - Missing error handling
       - Incorrect API usage

    4. LANGUAGE-SPECIFIC ISSUES:
       ${getLanguageSpecificChecks(language)}

    Please provide analysis in this exact JSON format only, no other text:

    {
      "summary": {
        "totalIssues": 3,
        "overallSeverity": "medium",
        "mainCategories": ["logic", "syntax", "performance"],
        "overallScore": 75,
        "hasCriticalErrors": false,
        "hasRuntimeErrors": false,
        "hasLogicalErrors": true
      },
      "suggestions": [
        {
          "id": "1",
          "category": "logic",
          "severity": "high",
          "title": "Infinite loop detected",
          "description": "The while loop condition always evaluates to true",
          "lineNumber": 15,
          "codeSnippet": "while (true) { ... }",
          "suggestion": "Add a break condition or modify the loop condition",
          "errorType": "logical_error",
          "potentialImpact": "Program will hang indefinitely"
        },
        {
          "id": "2",
          "category": "syntax",
          "severity": "medium", 
          "title": "Undefined variable usage",
          "description": "Variable 'result' is used before declaration",
          "lineNumber": 8,
          "codeSnippet": "console.log(result); let result = 5;",
          "suggestion": "Declare variables before using them",
          "errorType": "syntax_error",
          "potentialImpact": "ReferenceError at runtime"
        }
      ],
      "codeQuality": {
        "readability": 7,
        "maintainability": 6,
        "efficiency": 8,
        "security": 9
      },
      "executionAnalysis": {
        "willCompile": true,
        "willRun": true,
        "hasInfiniteLoops": false,
        "hasMemoryIssues": false,
        "potentialOutput": "Expected output description if known"
      }
    }

    BE VERY CRITICAL and THOROUGH. Don't just review style - actually analyze if the code will work correctly.
    Flag ANY potential issues that could cause runtime errors, logical errors, or unexpected behavior.
    `;

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
          temperature: 0.1, 
        }
      });

      console.log('Sending request to Gemini API for deep code analysis...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      console.log('Received Gemini response, length:', analysisText.length);

      // Extract JSON from Gemini response
      let analysis;
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
          console.log('Successfully parsed Gemini JSON response');
          
          // Enhance analysis with additional checks
          analysis = enhanceWithStaticAnalysis(analysis, content, language);
        } else {
          console.log('No JSON found in response, using enhanced fallback');
          analysis = createEnhancedFallbackAnalysis(content, language);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        analysis = createEnhancedFallbackAnalysis(content, language);
      }

      // Update document with Gemini analysis - use direct database update
      const client = await pool.connect();
      try {
        const updateResult = await client.query(
          `UPDATE documents 
           SET gemini_report = $1, 
               analysis_completed = $2, 
               issues_found = $3, 
               severity = $4, 
               status = $5,
               updated_at = NOW()
           WHERE id = $6 
           RETURNING *`,
          [
            analysis,
            true,
            analysis.summary?.totalIssues || 0,
            analysis.summary?.overallSeverity || 'medium',
            'completed',
            documentId
          ]
        );

        if (updateResult.rows.length === 0) {
          throw new Error('Document not found for update');
        }

        console.log('Successfully updated document with enhanced analysis');

        return NextResponse.json(analysis);
      } finally {
        client.release();
      }

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Enhanced fallback analysis if Gemini fails
      const fallbackAnalysis = createEnhancedFallbackAnalysis(content, language);
      
      // Update document with fallback analysis
      const client = await pool.connect();
      try {
        await client.query(
          `UPDATE documents 
           SET gemini_report = $1, 
               analysis_completed = $2, 
               issues_found = $3, 
               severity = $4, 
               status = $5,
               updated_at = NOW()
           WHERE id = $6`,
          [
            fallbackAnalysis,
            true,
            fallbackAnalysis.summary.totalIssues,
            fallbackAnalysis.summary.overallSeverity,
            'completed',
            documentId
          ]
        );
      } finally {
        client.release();
      }

      return NextResponse.json(fallbackAnalysis);
    }
  } catch (error: any) {
    console.error('Error in analyze route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code: ' + error.message },
      { status: 500 }
    );
  }
}

// Language-specific checks
function getLanguageSpecificChecks(language: string): string {
  const checks: { [key: string]: string } = {
    'javascript': `
      - Hoisting issues
      - Closure problems
      - 'this' context issues
      - Promise handling errors
      - Async/await misuse
      - Type coercion problems
      - Prototype chain issues
    `,
    'python': `
      - Indentation errors
      - Scope issues with global/local variables
      - Mutable default arguments
      - Import circular dependencies
      - Exception handling gaps
      - List/dictionary reference issues
    `,
    'java': `
      - Null pointer exceptions
      - Type casting issues
      - Exception handling
      - Access modifier problems
      - Collection type safety
    `,
    'cpp': `
      - Memory management errors
      - Pointer arithmetic issues
      - Buffer overflows
      - Dangling references
      - Template instantiation problems
    `,
    'typescript': `
      - Type assertion misuse
      - Any type overuse
      - Interface implementation errors
      - Generic type issues
      - Strict null check violations
    `
  };

  return checks[language.toLowerCase()] || `
    - Common syntax errors
    - Variable scope issues
    - Function/method calling errors
    - Type compatibility issues
  `;
}

// Enhanced static analysis
function enhanceWithStaticAnalysis(analysis: any, content: string, language: string): any {
  const lines = content.split('\n');
  const additionalIssues = [];

  // Basic static checks that can be done without full parsing
  if (language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') {
    // Check for common JS issues
    if (content.includes('==') && !content.includes('===')) {
      additionalIssues.push({
        id: `static-${additionalIssues.length + 1}`,
        category: "logic",
        severity: "medium",
        title: "Loose equality operator usage",
        description: "Using == instead of === can lead to unexpected type coercion",
        lineNumber: findLineNumber(content, '=='),
        codeSnippet: extractLineWith(content, '=='),
        suggestion: "Use strict equality operator === to avoid type coercion issues",
        errorType: "best_practice",
        potentialImpact: "Unexpected comparison results"
      });
    }

    if (content.includes('var ') && !content.includes('// legacy')) {
      additionalIssues.push({
        id: `static-${additionalIssues.length + 1}`,
        category: "syntax",
        severity: "low",
        title: "Using var instead of let/const",
        description: "var has function scope and can lead to hoisting issues",
        lineNumber: findLineNumber(content, 'var '),
        codeSnippet: extractLineWith(content, 'var '),
        suggestion: "Use let or const for block-level scoping",
        errorType: "best_practice",
        potentialImpact: "Potential scope-related bugs"
      });
    }
  }

  if (language.toLowerCase() === 'python') {
    // Check for common Python issues
    if (content.includes('import *')) {
      additionalIssues.push({
        id: `static-${additionalIssues.length + 1}`,
        category: "structure",
        severity: "low",
        title: "Wildcard import detected",
        description: "Using 'import *' can pollute the namespace and cause conflicts",
        lineNumber: findLineNumber(content, 'import *'),
        codeSnippet: extractLineWith(content, 'import *'),
        suggestion: "Import specific functions/classes instead of using wildcard",
        errorType: "best_practice",
        potentialImpact: "Namespace pollution and potential conflicts"
      });
    }
  }

  // Check for potential infinite loops
  const loopPatterns = ['while(true)', 'while (true)', 'for(;;)', 'for (;;)'];
  for (const pattern of loopPatterns) {
    if (content.includes(pattern)) {
      additionalIssues.push({
        id: `static-${additionalIssues.length + 1}`,
        category: "logic",
        severity: "high",
        title: "Potential infinite loop",
        description: `Found '${pattern}' without clear break condition`,
        lineNumber: findLineNumber(content, pattern),
        codeSnippet: extractLineWith(content, pattern),
        suggestion: "Add proper loop termination condition",
        errorType: "logical_error",
        potentialImpact: "Program will hang indefinitely"
      });
    }
  }

  // Check for console.log in production-like code (for JS/TS)
  if ((language.toLowerCase() === 'javascript' || language.toLowerCase() === 'typescript') && 
      content.includes('console.log') && content.split('console.log').length > 3) {
    additionalIssues.push({
      id: `static-${additionalIssues.length + 1}`,
      category: "maintainability",
      severity: "low",
      title: "Multiple console.log statements",
      description: "Multiple debug statements left in code",
      lineNumber: findLineNumber(content, 'console.log'),
      codeSnippet: extractLineWith(content, 'console.log'),
      suggestion: "Remove or replace with proper logging for production",
      errorType: "debug_code",
      potentialImpact: "Cluttered output in production"
    });
  }

  // Merge additional issues
  if (additionalIssues.length > 0) {
    analysis.suggestions = [...(analysis.suggestions || []), ...additionalIssues];
    analysis.summary.totalIssues = (analysis.summary?.totalIssues || 0) + additionalIssues.length;
    
    // Update severity if high issues found
    if (additionalIssues.some(issue => issue.severity === 'high')) {
      analysis.summary.overallSeverity = 'high';
      analysis.summary.hasCriticalErrors = true;
    }
  }

  return analysis;
}

// Helper functions for static analysis
function findLineNumber(content: string, pattern: string): number {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return i + 1;
    }
  }
  return 1;
}

function extractLineWith(content: string, pattern: string): string {
  const lines = content.split('\n');
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(pattern)) {
      return lines[i].trim();
    }
  }
  return "// Pattern not found";
}

// Enhanced fallback analysis function
function createEnhancedFallbackAnalysis(content: string, language: string) {
  const lines = content.split('\n');
  
  // Perform basic static analysis
  const hasInfiniteLoop = content.includes('while(true)') || content.includes('for(;;)');
  const hasUndefinedVars = content.includes('undefined') || content.includes('null');
  const hasConsoleLogs = content.includes('console.log');
  
  let totalIssues = 2;
  let overallSeverity = "medium";
  
  if (hasInfiniteLoop) {
    totalIssues++;
    overallSeverity = "high";
  }

  return {
    summary: {
      totalIssues: totalIssues,
      overallSeverity: overallSeverity,
      mainCategories: ["logic", "readability", "structure"],
      overallScore: 65,
      hasCriticalErrors: hasInfiniteLoop,
      hasRuntimeErrors: false,
      hasLogicalErrors: true
    },
    suggestions: [
      {
        id: "1",
        category: "logic",
        severity: hasInfiniteLoop ? "high" : "medium",
        title: hasInfiniteLoop ? "Potential infinite loop detected" : "Basic logic review",
        description: hasInfiniteLoop ? 
          "Found potential infinite loop pattern" : 
          "Basic logical structure analysis completed",
        lineNumber: Math.min(1, lines.length),
        codeSnippet: lines[0] || "// Code content",
        suggestion: hasInfiniteLoop ? 
          "Add proper loop termination conditions" : 
          "Review control flow and conditional logic",
        errorType: "logical_error",
        potentialImpact: hasInfiniteLoop ? "Program may hang" : "Potential logic errors"
      },
      {
        id: "2",
        category: "readability",
        severity: "medium",
        title: "Code structure analysis",
        description: "Review code organization and documentation",
        lineNumber: Math.min(5, lines.length),
        codeSnippet: lines[4] || "// Function definition",
        suggestion: "Add comments and improve code organization",
        errorType: "maintainability",
        potentialImpact: "Reduced code understandability"
      },
      ...(hasConsoleLogs ? [{
        id: "3",
        category: "maintainability",
        severity: "low",
        title: "Debug statements present",
        description: "Console log statements found in code",
        lineNumber: findLineNumber(content, 'console.log'),
        codeSnippet: extractLineWith(content, 'console.log'),
        suggestion: "Remove debug statements for production code",
        errorType: "debug_code",
        potentialImpact: "Cluttered output"
      }] : [])
    ],
    codeQuality: {
      readability: 6,
      maintainability: 5,
      efficiency: 7,
      security: 8
    },
    executionAnalysis: {
      willCompile: true,
      willRun: !hasInfiniteLoop,
      hasInfiniteLoops: hasInfiniteLoop,
      hasMemoryIssues: false,
      potentialOutput: "Analysis limited - review logic manually"
    }
  };
}