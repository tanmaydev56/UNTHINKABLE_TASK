import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    const { fileName, language, content } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Content is required' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: 'Gemini API key is not configured' },
        { status: 500 }
      );
    }

    const isAIMLCode = detectAIMLCode(content, language);
    const prompt = createDetailedPrompt(content, language, fileName, isAIMLCode);

  const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash-latest', // ← fixed name
  generationConfig: {
    temperature: 0.7,
    maxOutputTokens: 4000,
  },
});

    console.log('Sending detailed analysis request to gemini-2.5-flash');
    const result = await model.generateContent(prompt);
    const analysisText = result.response.text();
    console.log('Received detailed Gemini response');

    let explanation;
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed detailed JSON response');
      } else {
        console.log('No JSON found in response, using fallback');
        explanation = createDetailedFallbackExplanation(content, language, fileName, isAIMLCode);
      }
    } catch (parseError) {
      console.error('Error parsing Gemini response:', parseError);
      explanation = createDetailedFallbackExplanation(content, language, fileName, isAIMLCode);
    }

    return NextResponse.json(explanation);
  } catch (error: any) {
    console.error('Error in understand route:', error);
    return NextResponse.json(
      { error: 'Failed to analyze code: ' + error.message },
      { status: 500 }
    );
  }
}

/* ---------- helper functions unchanged ---------- */
function detectAIMLCode(content: string, language: string): boolean {
  const aiMlKeywords = [
    'import tensorflow', 'import torch', 'import sklearn', 'import keras',
    'from sklearn', 'from tensorflow', 'from torch', 'import xgboost',
    'import lightgbm', 'import catboost', 'import transformers', 'import datasets',
    'model.fit', 'model.predict', 'neural network', 'deep learning',
    'machine learning', 'random forest', 'gradient boosting', 'convolutional',
    'recurrent', 'transformer', 'embedding', 'epoch', 'batch_size',
    'loss function', 'optimizer', 'activation', 'layer', 'feature',
    'training', 'validation', 'test split', 'accuracy', 'precision',
    'recall', 'f1', 'auc', 'roc', 'shap', 'lime', 'feature importance'
  ];

  const contentLower = content.toLowerCase();
  return aiMlKeywords.some(keyword => contentLower.includes(keyword.toLowerCase()));
}

function createDetailedPrompt(content: string, language: string, fileName: string, isAIMLCode: boolean): string {
  /* … same prompt builder you already have … */
  if (isAIMLCode) {
    return `
    Analyze the following ${language} AI/ML code from file "${fileName}" and provide an EXTREMELY DETAILED, COMPREHENSIVE breakdown in easy-to-understand language.

    CODE:
    ${content}

    Provide analysis in this EXACT JSON format:

    {
      "highLevelOverview": "2-3 paragraph high-level summary of what this program does",
      "detailedBreakdown": [
        {
          "section": "Section name (e.g., 'Imports & Setup', 'Data Loading')",
          "lineNumbers": "Lines 1-10",
          "whatItDoes": "Detailed explanation of what this section accomplishes",
          "whyItMatters": "Why this section is important in the overall pipeline",
          "conceptsUsed": ["concept1", "concept2"],
          "codeSnippet": "Relevant code lines for context"
        }
      ],
      "keyConcepts": [
        {
          "name": "Concept Name",
          "simpleDefinition": "Easy-to-understand definition using analogies",
          "technicalDefinition": "More precise technical definition",
          "whyImportant": "Why this concept matters in AI/ML",
          "realWorldAnalogy": "Simple analogy to explain the concept",
          "examplesInCode": ["example1", "example2"]
        }
      ],
      "pipelineStages": ["stage1", "stage2", "stage3"],
      "potentialIssues": [
        {
          "issue": "Potential problem or improvement area",
          "impact": "How this affects the code",
          "suggestion": "How to fix or improve it"
        }
      ],
      "keyTakeaways": [
        "Important learning point 1",
        "Important learning point 2"
      ],
      "difficulty": "beginner/intermediate/advanced",
      "estimatedLearningTime": "15-30 minutes",
      "glossary": [
        {
          "term": "Technical term",
          "simpleDefinition": "Easy definition"
        }
      ]
    }

    ANALYSIS GUIDELINES:
    1. Be EXTREMELY DETAILED - explain line-by-line, concept-by-concept
    2. Use SIMPLE LANGUAGE and ANALOGIES - explain like you're teaching a beginner
    3. For AI/ML code, focus on: data pipeline, model architecture, training process, evaluation, explainability
    4. Break down complex concepts into digestible parts
    5. Highlight both WHAT the code does and WHY it does it that way
    6. Include potential issues and improvements
    7. Create a glossary of technical terms

    Make this the ULTIMATE learning resource for understanding this code.
    `;
  } else {
    return `
    Analyze the following ${language} code from file "${fileName}" and provide an EXTREMELY DETAILED, COMPREHENSIVE breakdown in easy-to-understand language.

    CODE:
    ${content}

    Provide analysis in this EXACT JSON format:

    {
      "highLevelOverview": "2-3 paragraph high-level summary of what this program does",
      "detailedBreakdown": [
        {
          "section": "Section name (e.g., 'Imports & Setup', 'Function Definitions')",
          "lineNumbers": "Lines 1-10",
          "whatItDoes": "Detailed explanation of what this section accomplishes",
          "whyItMatters": "Why this section is important in the overall program",
          "conceptsUsed": ["concept1", "concept2"],
          "codeSnippet": "Relevant code lines for context"
        }
      ],
      "keyConcepts": [
        {
          "name": "Concept Name",
          "simpleDefinition": "Easy-to-understand definition using analogies",
          "technicalDefinition": "More precise technical definition",
          "whyImportant": "Why this concept matters in programming",
          "realWorldAnalogy": "Simple analogy to explain the concept",
          "examplesInCode": ["example1", "example2"]
        }
      ],
      "programFlow": ["step1", "step2", "step3"],
      "potentialIssues": [
        {
          "issue": "Potential problem or improvement area",
          "impact": "How this affects the code",
          "suggestion": "How to fix or improve it"
        }
      ],
      "keyTakeaways": [
        "Important learning point 1",
        "Important learning point 2"
      ],
      "difficulty": "beginner/intermediate/advanced",
      "estimatedLearningTime": "10-20 minutes",
      "glossary": [
        {
          "term": "Technical term",
          "simpleDefinition": "Easy definition"
        }
      ]
    }

    ANALYSIS GUIDELINES:
    1. Be EXTREMELY DETAILED - explain line-by-line, concept-by-concept
    2. Use SIMPLE LANGUAGE and ANALOGIES - explain like you're teaching a beginner
    3. Focus on: program structure, functions, data flow, algorithms
    4. Break down complex concepts into digestible parts
    5. Highlight both WHAT the code does and WHY it does it that way
    6. Include potential issues and improvements
    7. Create a glossary of technical terms

    Make this the ULTIMATE learning resource for understanding this code.
    `;
  }
}

function createDetailedFallbackExplanation(content: string, language: string, fileName: string, isAIMLCode: boolean) {
  /* … your existing fallback implementation … */
  const lines = content.split('\n');
  const hasFunctions = content.includes('function') || content.includes('def ') || content.includes('class ');
  const hasImports = content.includes('import ') || content.includes('from ');
  const hasVariables = content.includes('let ') || content.includes('const ') || content.includes('var ') || content.includes('=');
  
  let difficulty = "beginner";
  if (content.includes('async') || content.includes('await') || content.includes('Promise')) {
    difficulty = "intermediate";
  }
  if (content.includes('class ') || content.includes('interface ') || content.includes('type ')) {
    difficulty = "advanced";
  }

  return {
    highLevelOverview: `This ${language} code file "${fileName}" contains ${lines.length} lines and implements ${isAIMLCode ? 'a machine learning pipeline' : 'a software program'}. The code demonstrates ${difficulty}-level programming concepts including ${hasFunctions ? 'function definitions, ' : ''}${hasVariables ? 'variable declarations, ' : ''}and ${hasImports ? 'library imports' : 'basic programming structures'}.`,
    
    detailedBreakdown: [
      {
        section: "File Structure & Imports",
        lineNumbers: "1-10",
        whatItDoes: "Sets up the necessary libraries and dependencies for the program to run",
        whyItMatters: "Imports provide pre-built functionality so you don't have to write everything from scratch",
        conceptsUsed: ["Module imports", "Dependency management"],
        codeSnippet: lines.slice(0, Math.min(5, lines.length)).join('\n')
      },
      {
        section: "Main Program Logic",
        lineNumbers: `11-${lines.length}`,
        whatItDoes: "Contains the core functionality and business logic of the application",
        whyItMatters: "This is where the actual work happens - data processing, calculations, or user interactions",
        conceptsUsed: ["Programming logic", "Algorithms", "Data processing"],
        codeSnippet: lines.slice(Math.min(5, lines.length), Math.min(15, lines.length)).join('\n')
      }
    ],
    
    keyConcepts: [
      {
        name: "Basic Programming Structure",
        simpleDefinition: "How code is organized into different parts that work together",
        technicalDefinition: "The architectural pattern and organization of code components",
        whyImportant: "Good structure makes code easier to understand, maintain, and modify",
        realWorldAnalogy: "Like organizing a kitchen - ingredients (variables) go in cabinets, recipes (functions) tell you what to do",
        examplesInCode: ["Function definitions", "Variable declarations", "Import statements"]
      }
    ],
    
    pipelineStages: isAIMLCode ? ["data_loading", "preprocessing", "model_training", "evaluation"] : ["initialization", "processing", "output"],
    
    potentialIssues: [
      {
        issue: "Basic analysis due to API limitations",
        impact: "Limited detailed insights into specific code patterns",
        suggestion: "Try with a smaller code snippet or check the API configuration"
      }
    ],
    
    keyTakeaways: [
      "Read code from top to bottom to understand execution flow",
      "Look for function definitions to understand available operations",
      "Variable names often indicate their purpose",
      "Comments and documentation provide valuable context"
    ],
    
    difficulty: difficulty,
    estimatedLearningTime: "15-25 minutes",
    
    glossary: [
      {
        term: "Function",
        simpleDefinition: "A reusable block of code that performs a specific task"
      },
      {
        term: "Variable",
        simpleDefinition: "A named container that stores data values"
      }
    ]
  };
}