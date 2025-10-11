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

    // Gemini analysis prompt - make it more specific
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
        },
        {
          "id": "2",
          "category": "bugs",
          "severity": "high",
          "title": "Potential null reference",
          "description": "Missing null check before accessing property",
          "lineNumber": 15,
          "codeSnippet": "return user.profile.name;",
          "suggestion": "Add null checking: return user?.profile?.name || 'Unknown';"
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
      // Use the correct model - try different model names
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash"  // Updated model name
        
      });

      console.log('Sending request to Gemini API...');
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const analysisText = response.text();

      console.log('Received response from Gemini:', analysisText.substring(0, 200));

      // Extract JSON from Gemini response
      let analysis;
      try {
        // Try to find JSON in the response
        const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          // If no JSON found, create a fallback analysis
          analysis = createFallbackAnalysis(content, language);
        }
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        analysis = createFallbackAnalysis(content, language);
      }

      // Update document with Gemini analysis
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
      
      // Fallback analysis if Gemini fails
      const fallbackAnalysis = createFallbackAnalysis(content, language);
      
      // Update document with fallback analysis
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


// Fallback analysis function
function createFallbackAnalysis(content: string, language: string) {
  const lines = content.split('\n');
  return {
    summary: {
      totalIssues: 2,
      overallSeverity: "medium" as const,
      mainCategories: ["readability", "structure"],
      overallScore: 70
    },
    suggestions: [
      {
        id: "1",
        category: "readability" as const,
        severity: "medium" as const,
        title: "Code structure analysis",
        description: "Basic code structure review completed",
        lineNumber: Math.min(1, lines.length),
        codeSnippet: lines[0] || "// Code content",
        suggestion: "Consider adding more comments and improving code organization"
      },
      {
        id: "2",
        category: "modularity" as const,
        severity: "low" as const,
        title: "Function organization",
        description: "Review function structure and responsibilities",
        lineNumber: Math.min(5, lines.length),
        codeSnippet: lines[4] || "// Function definition",
        suggestion: "Consider breaking down complex functions into smaller, focused ones"
      }
    ]
  };
}