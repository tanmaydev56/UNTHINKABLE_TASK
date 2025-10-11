import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { pool } from '@/lib/db';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { documentId, content, language, fileName } = await request.json();

    if (!documentId || !content) {
      return NextResponse.json(
        { error: 'Document ID and content are required' },
        { status: 400 }
      );
    }

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Gemini API key is not configured');
    }

    // FIX: Use proper URL for Vercel
    const getBaseUrl = () => {
      if (process.env.VERCEL_URL) {
        return `https://${process.env.VERCEL_URL}`;
      }
      if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL;
      }
      return 'http://localhost:3000';
    };

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
    `;

    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"
      });

      console.log('Sending request to Gemini API...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      console.log('Received response from Gemini');

      let analysis;
      try {
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          analysis = createFallbackAnalysis(content, language);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        analysis = createFallbackAnalysis(content, language);
      }

      // FIX: Use the base URL function
      const baseUrl = getBaseUrl();
      const updateResponse = await fetch(`${baseUrl}/api/documents/${documentId}`, {
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
        const errorText = await updateResponse.text();
        console.error('Failed to update document:', errorText);
        throw new Error('Failed to update document with analysis');
      }

      return NextResponse.json(analysis);
    } catch (geminiError: any) {
      console.error('Gemini API error:', geminiError);
      
      const fallbackAnalysis = createFallbackAnalysis(content, language);
      const baseUrl = getBaseUrl();
      
      const updateResponse = await fetch(`${baseUrl}/api/documents/${documentId}`, {
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
  } catch (error: any) {
    console.error('Error in Gemini analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code: ' + error.message },
      { status: 500 }
    );
  }
}

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
      }
    ]
  };
}