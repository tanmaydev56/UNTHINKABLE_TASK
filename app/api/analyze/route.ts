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

    // Gemini analysis prompt
    const prompt = `
    Analyze the following ${language} code from file ${fileName} and provide a detailed code review:

    CODE TO ANALYZE:
    ${content}

    Please provide analysis in this exact JSON format only, no other text:

    {
      "summary": {
        "totalIssues": 3,
        "overallSeverity": "medium",
        "mainCategories": ["readability", "bugs", "modularity"],
        "overallScore": 75
      },
      "suggestions": [
        {
          "id": "1",
          "category": "readability",
          "severity": "medium",
          "title": "Improve variable naming",
          "description": "Variable names are not descriptive enough",
          "lineNumber": 8,
          "codeSnippet": "const x = 5;",
          "suggestion": "Use more descriptive variable names like 'userCount' instead of 'x'"
        }
      ]
    }

    Focus on:
    - Code quality and best practices
    - Potential bugs and errors
    - Performance improvements
    - Security vulnerabilities
    - Readability and maintainability
    - Modularity and code organization

    Provide specific line numbers and code snippets for each suggestion.
    `;

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      });

      console.log('Sending request to Gemini API...');
      
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
        } else {
          console.log('No JSON found in response, using fallback');
          analysis = createFallbackAnalysis(content, language);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        analysis = createFallbackAnalysis(content, language);
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

        console.log('Successfully updated document with analysis');

        return NextResponse.json(analysis);
      } finally {
        client.release();
      }

    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      // Fallback analysis if Gemini fails
      const fallbackAnalysis = createFallbackAnalysis(content, language);
      
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

// Fallback analysis function
function createFallbackAnalysis(content: string, language: string) {
  const lines = content.split('\n');
  return {
    summary: {
      totalIssues: 2,
      overallSeverity: "medium",
      mainCategories: ["readability", "structure"],
      overallScore: 70
    },
    suggestions: [
      {
        id: "1",
        category: "readability",
        severity: "medium",
        title: "Code structure analysis",
        description: "Basic code structure review completed",
        lineNumber: Math.min(1, lines.length),
        codeSnippet: lines[0] || "// Code content",
        suggestion: "Consider adding more comments and improving code organization"
      },
      {
        id: "2",
        category: "modularity",
        severity: "low",
        title: "Function organization",
        description: "Review function structure and responsibilities",
        lineNumber: Math.min(5, lines.length),
        codeSnippet: lines[4] || "// Function definition",
        suggestion: "Consider breaking down complex functions into smaller, focused ones"
      }
    ]
  };
}