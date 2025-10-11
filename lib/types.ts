export interface CodeExplanation {
  highLevelOverview: string;
  detailedBreakdown: DetailedBreakdown[];
  keyConcepts: KeyConcept[];
  pipelineStages?: string[];
  programFlow?: string[];
  potentialIssues: PotentialIssue[];
  keyTakeaways: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedLearningTime: string;
  glossary: GlossaryItem[];
}
export interface NavbarProps {
  onNavigate: (page: string) => void;
}
export interface Document {
  id: string;
  fileName: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  issuesFound: number;
  severity: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "failed";
}

export interface DashboardDocument {
  id: string;
  fileName: string;
  language: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  issuesFound: number;
  severity: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "failed";
  geminiReport?: {
    summary: {
      totalIssues: number;
      overallSeverity: "high" | "medium" | "low";
      mainCategories: string[];
      overallScore: number;
      hasCriticalErrors: boolean;
      hasRuntimeErrors: boolean;
      hasLogicalErrors: boolean;
    };
    suggestions: Array<{
      id: string;
      category: "logic" | "syntax" | "performance" | "security" | "structure" | "maintainability" | "best_practice" | "debug_code" | "design_issue";
      severity: "high" | "medium" | "low";
      title: string;
      description: string;
      lineNumber: number;
      codeSnippet: string;
      suggestion: string;
      errorType: string;
      potentialImpact: string;
    }>;
    codeQuality?: {
      readability: number;
      maintainability: number;
      efficiency: number;
      security: number;
    };
    executionAnalysis?: {
      willCompile: boolean;
      willRun: boolean;
      hasInfiniteLoops: boolean;
      hasMemoryIssues: boolean;
      potentialOutput: string;
    };
  };
  analysisCompleted?: boolean;
}



export interface UploadPageProps {
  onNavigate: (page: string) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  content?: string;
  language: string;
  documentId?: string;
}

export interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  language: string;
  status: "completed" | "pending";
}

export interface SettingsPageProps {
  onNavigate: (page: string) => void;
}
export interface ReviewReportPageProps {
  onNavigate: (page: string) => void;
}

export interface DetailedBreakdown {
  section: string;
  lineNumbers: string;
  whatItDoes: string;
  whyItMatters: string;
  conceptsUsed: string[];
  codeSnippet: string;
}

export interface KeyConcept {
  name: string;
  simpleDefinition: string;
  technicalDefinition: string;
  whyImportant: string;
  realWorldAnalogy: string;
  examplesInCode: string[];
}

export interface PotentialIssue {
  issue: string;
  impact: string;
  suggestion: string;
}

export interface GlossaryItem {
  term: string;
  simpleDefinition: string;
}
export interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  content?: string;
  language: string;
  explanation?: CodeExplanation;
}

export interface CodeExplanation {
  summary: string;
  concepts: Concept[];
  breakdown: CodeBreakdown[];
  keyTakeaways: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedLearningTime: string;
}

export interface Concept {
  name: string;
  description: string;
  importance: "high" | "medium" | "low";
  examples: string[];
}

export interface CodeBreakdown {
  section: string;
  lineNumbers: string;
  explanation: string;
  purpose: string;
}
