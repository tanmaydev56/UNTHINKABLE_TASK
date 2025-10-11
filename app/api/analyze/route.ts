import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Gemini with correct configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  try {
    const { documentId, content, language, fileName } = await request.json();

    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      );
    }

    // Check if API key is available
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // Enhanced Gemini analysis prompt
    const prompt = `
    You are an expert code reviewer analyzing ${language} code. Provide a comprehensive code review with specific, actionable suggestions.

    CODE TO REVIEW (File: ${fileName}):
    \`\`\`${language}
    ${content}
    \`\`\`

    Analyze this code thoroughly and provide feedback in this EXACT JSON format:

    {
      "summary": {
        "totalIssues": <number>,
        "overallSeverity": "high|medium|low",
        "mainCategories": ["category1", "category2", ...],
        "overallScore": <number-between-0-100>
      },
      "suggestions": [
        {
          "id": "unique-id-1",
          "category": "readability|bugs|performance|security|modularity",
          "severity": "high|medium|low",
          "title": "Specific issue title",
          "description": "Detailed explanation of the issue",
          "lineNumber": <exact-line-number>,
          "codeSnippet": "The specific code line(s) with the issue",
          "suggestion": "Actionable improvement suggestion"
        }
      ]
    }

    CRITICAL ANALYSIS AREAS:

    1. CODE QUALITY & READABILITY:
       - Meaningful variable/function names
       - Code formatting and consistency
       - Comment quality and documentation
       - Code duplication
       - Function length and complexity

    2. BUGS & ERROR HANDLING:
       - Potential runtime errors
       - Null/undefined references
       - Type safety issues
       - Memory leaks
       - Race conditions
       - Proper error handling

    3. PERFORMANCE:
       - Inefficient algorithms
       - Unnecessary computations
       - Memory usage optimization
       - Database/API call optimization
       - Loop optimizations

    4. SECURITY:
       - Input validation
       - Authentication/authorization
       - Data exposure risks
       - SQL injection possibilities
       - XSS vulnerabilities
       - Secure coding practices

    5. ARCHITECTURE & MODULARITY:
       - Single responsibility principle
       - Code organization
       - Dependency management
       - Code reusability
       - Separation of concerns

    IMPORTANT INSTRUCTIONS:
    - Be specific and provide exact line numbers
    - Include the actual code snippet that has the issue
    - Give practical, actionable suggestions
    - Focus on the most critical issues first
    - Consider ${language} best practices
    - Rate severity based on impact: high=critical bugs/security, medium=code quality, low=minor improvements
    - Overall score should reflect code quality (100=excellent, 0=very poor)

    Return ONLY the JSON, no additional text or explanations.
    `;

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.2, // Lower temperature for more consistent JSON
          maxOutputTokens: 2048,
        }
      });

      console.log('Sending enhanced request to Gemini API...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      console.log('Received response from Gemini:', analysisText.substring(0, 200));

      // Enhanced JSON extraction with better error handling
      let analysis;
      try {
        // Clean the response and extract JSON
        const cleanedText = analysisText
          .replace(/```json\s*/g, '')
          .replace(/```\s*/g, '')
          .trim();
        
        const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
          
          // Validate the analysis structure
          analysis = validateAndEnhanceAnalysis(analysis, content, language);
        } else {
          console.warn('No JSON found in response, using fallback');
          analysis = createEnhancedFallbackAnalysis(content, language, fileName);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        analysis = createEnhancedFallbackAnalysis(content, language, fileName);
      }

      // Update document with enhanced analysis
      const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geminiReport: analysis,
          analysisCompleted: true,
          issuesFound: analysis.summary.totalIssues,
          severity: analysis.summary.overallSeverity,
          status: 'completed'
        }),
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update document with analysis');
      }

      return NextResponse.json(analysis);
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Enhanced fallback analysis
      const fallbackAnalysis = createEnhancedFallbackAnalysis(content, language, fileName);
      
      const updateResponse = await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/documents/${documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          geminiReport: fallbackAnalysis,
          analysisCompleted: true,
          issuesFound: fallbackAnalysis.summary.totalIssues,
          severity: fallbackAnalysis.summary.overallSeverity,
          status: 'completed'
        }),
      });

      return NextResponse.json(fallbackAnalysis);
    }
  } catch (error) {
    console.error('Error in Gemini analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code' },
      { status: 500 }
    );
  }
}

// Enhanced fallback analysis function
function createEnhancedFallbackAnalysis(content: string, language: string, fileName: string) {
  const lines = content.split('\n');
  const codeLength = lines.length;
  
  // Analyze basic code metrics
  const hasFunctions = content.includes('function ') || content.includes('def ') || content.includes('class ');
  const hasComments = content.includes('//') || content.includes('/*') || content.includes('#');
  const hasErrorHandling = content.includes('try') || content.includes('catch') || content.includes('except');
  
  // Determine severity based on code characteristics
  let overallSeverity: "high" | "medium" | "low" = "medium";
  let overallScore = 65;
  
  if (codeLength > 100 && !hasComments) {
    overallSeverity = "high";
    overallScore = 45;
  } else if (codeLength > 50 && !hasErrorHandling) {
    overallSeverity = "medium";
    overallScore = 60;
  }

  return {
    summary: {
      totalIssues: 3,
      overallSeverity,
      mainCategories: ["readability", "structure", "maintainability"],
      overallScore
    },
    suggestions: [
      {
        id: "1",
        category: "readability" as const,
        severity: "medium" as const,
        title: "Code Documentation Needed",
        description: `The ${language} code in ${fileName} lacks sufficient comments and documentation, making it difficult for other developers to understand the logic and purpose.`,
        lineNumber: Math.max(1, Math.floor(codeLength / 2)),
        codeSnippet: lines[Math.floor(codeLength / 2)] || "// Complex logic section",
        suggestion: "Add inline comments explaining complex logic, document function purposes, and consider adding a file header with overview documentation."
      },
      {
        id: "2",
        category: "modularity" as const,
        severity: hasFunctions ? "low" : "high",
        title: hasFunctions ? "Function Organization" : "Procedural Code Structure",
        description: hasFunctions 
          ? "Functions could be better organized with clearer responsibilities and separation of concerns."
          : "Code appears to be written procedurally without proper function/module separation.",
        lineNumber: Math.min(10, codeLength),
        codeSnippet: lines[Math.min(9, codeLength - 1)] || "// Main logic section",
        suggestion: hasFunctions
          ? "Refactor functions to follow single responsibility principle. Consider breaking large functions into smaller, focused ones."
          : "Extract reusable logic into functions. Organize code into logical modules or classes based on functionality."
      },
      {
        id: "3",
        category: "bugs" as const,
        severity: hasErrorHandling ? "low" : "medium",
        title: hasErrorHandling ? "Error Handling Review" : "Missing Error Handling",
        description: hasErrorHandling
          ? "Existing error handling should be reviewed for completeness and consistency."
          : "Code lacks proper error handling for potential runtime exceptions and edge cases.",
        lineNumber: Math.min(5, codeLength),
        codeSnippet: lines[Math.min(4, codeLength - 1)] || "// Potential error-prone section",
        suggestion: hasErrorHandling
          ? "Ensure all external calls and potential failure points have appropriate error handling. Consider consistent error logging."
          : "Implement try-catch blocks around external API calls, file operations, and user input processing. Add validation for function parameters."
      }
    ]
  };
}

// Validate and enhance the analysis structure
function validateAndEnhanceAnalysis(analysis: any, content: string, language: string) {
  const lines = content.split('\n');
  
  // Ensure summary structure
  if (!analysis.summary) {
    analysis.summary = {
      totalIssues: 0,
      overallSeverity: "medium",
      mainCategories: ["analysis"],
      overallScore: 50
    };
  }
  
  // Ensure suggestions array exists
  if (!analysis.suggestions || !Array.isArray(analysis.suggestions)) {
    analysis.suggestions = [];
  }
  
  // Validate and enhance each suggestion
  analysis.suggestions = analysis.suggestions.map((suggestion: any, index: number) => ({
    id: suggestion.id || `suggestion-${index + 1}`,
    category: suggestion.category || "readability",
    severity: suggestion.severity || "medium",
    title: suggestion.title || "Code Improvement Opportunity",
    description: suggestion.description || "An area for code improvement has been identified.",
    lineNumber: Math.min(Math.max(1, suggestion.lineNumber || 1), lines.length),
    codeSnippet: suggestion.codeSnippet || lines[Math.min(Math.max(0, (suggestion.lineNumber || 1) - 1), lines.length - 1)] || "// Code section",
    suggestion: suggestion.suggestion || "Consider reviewing and improving this code section."
  }));
  
  // Update total issues count
  analysis.summary.totalIssues = analysis.suggestions.length;
  
  return analysis;
}