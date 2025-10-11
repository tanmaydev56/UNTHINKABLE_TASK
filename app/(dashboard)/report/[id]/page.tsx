// app/(dashboard)/report/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Download, ChevronDown, ChevronRight, Code2, Boxes, Sparkles, Bug, FileCode, Zap, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Document {
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
    };
    suggestions: Array<{
      id: string;
      category: "modularity" | "readability" | "bugs" | "performance" | "security";
      severity: "high" | "medium" | "low";
      title: string;
      description: string;
      lineNumber: number;
      codeSnippet: string;
      suggestion: string;
    }>;
  };
  analysisCompleted?: boolean;
}

interface ReviewReportPageProps {
  onNavigate: (page: string) => void;
}

interface Suggestion {
  id: string;
  category: "modularity" | "readability" | "bugs" | "performance" | "security";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  lineNumber: number;
  code: string;
  suggestion: string;
}

export default function ReviewReportPage({ onNavigate }: ReviewReportPageProps) {
  const toggleSuggestion = (id: string) => {
    setOpenSuggestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const [openSuggestions, setOpenSuggestions] = useState<string[]>(["1"]);
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  useEffect(() => {
    if (params.id) {
      fetchDocument(params.id as string);
    }
  }, [params.id]);

 const fetchDocument = async (id: string) => {
  try {
    setLoading(true);
    const response = await fetch(`/api/documents/${id}`);
    if (response.ok) {
      const data = await response.json();
      console.log('Document data from API:', data); // Add this for debugging
      setDocument(data);
    } else {
      toast.error('Failed to fetch document');
      router.push('/dashboard');
    }
  } catch (error) {
    toast.error('Error fetching document');
    router.push('/dashboard');
  } finally {
    setLoading(false);
  }
};

  const downloadReport = () => {
    if (!document) return;
    
    const reportData = {
      fileName: document.fileName,
      language: document.language,
      analysisDate: new Date().toISOString(),
      summary: document.geminiReport?.summary,
      suggestions: suggestions,
      codeContent: document.content
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${document.fileName}-analysis-report.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading document...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl text-foreground mb-4">Document not found</h1>
            <Button onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!document.analysisCompleted) {
    return (
      <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <h1 className="text-2xl text-foreground mb-4">Analyzing Code...</h1>
            <p className="text-muted-foreground mb-6">
              Gemini AI is analyzing your code. This may take a few moments.
            </p>
            <Button onClick={() => fetchDocument(params.id as string)}>
              Refresh Status
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Replace the mock data with real Gemini analysis
  const suggestions: Suggestion[] = document.geminiReport?.suggestions?.map((suggestion: any, index: number) => ({
    id: suggestion.id || `suggestion-${index}`,
    category: suggestion.category,
    severity: suggestion.severity,
    title: suggestion.title,
    description: suggestion.description,
    lineNumber: suggestion.lineNumber,
    code: suggestion.codeSnippet,
    suggestion: suggestion.suggestion,
  })) || [];

  const getSuggestionIcon = (category: string) => {
    switch (category) {
      case "modularity":
        return <Boxes className="w-5 h-5" />;
      case "readability":
        return <Sparkles className="w-5 h-5" />;
      case "bugs":
        return <Bug className="w-5 h-5" />;
      case "performance":
        return <Zap className="w-5 h-5" />;
      case "security":
        return <Shield className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "medium":
        return "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30";
      case "low":
        return "bg-accent/20 text-accent border-accent/30";
      default:
        return "bg-muted";
    }
  };

  const groupedSuggestions = {
    modularity: suggestions.filter((s) => s.category === "modularity"),
    readability: suggestions.filter((s) => s.category === "readability"),
    bugs: suggestions.filter((s) => s.category === "bugs"),
    performance: suggestions.filter((s) => s.category === "performance"),
    security: suggestions.filter((s) => s.category === "security"),
  };

  return (
    <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            
            <h1 className="text-3xl text-foreground mb-2">AI Code Review Report</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>{document.fileName}</span>
              </div>
              <span>•</span>
              <span>{document.language}</span>
              <span>•</span>
              <span>{document.issuesFound} issues found</span>
            </div>
          </div>
          <Button className="glow" onClick={downloadReport}>
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-foreground mb-1">
              {document.issuesFound}
            </div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
          </Card>
          <Card className="glass p-6 border-destructive/30">
            <div className="text-2xl text-destructive mb-1">
              {suggestions.filter(s => s.severity === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </Card>
          <Card className="glass p-6 border-[#F59E0B]/30">
            <div className="text-2xl text-[#F59E0B] mb-1">
              {suggestions.filter(s => s.severity === "medium").length}
            </div>
            <div className="text-sm text-muted-foreground">Medium Priority</div>
          </Card>
          <Card className="glass p-6 border-accent/30">
            <div className="text-2xl text-accent mb-1">
              {suggestions.filter(s => s.severity === "low").length}
            </div>
            <div className="text-sm text-muted-foreground">Low Priority</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Code Display */}
          <div className="lg:col-span-2">
            <Card className="glass p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Source Code</h3>
                <Badge variant="outline" className="text-xs">
                  {document.language}
                </Badge>
              </div>
              <div className="bg-secondary/30 rounded-lg p-6 overflow-x-auto">
                <pre className="font-mono text-sm">
                  {document.content.split("\n").map((line, index) => {
                    const lineNumber = index + 1;
                    const hasIssue = suggestions.some(s => s.lineNumber === lineNumber);
                    return (
                      <div
                        key={index}
                        className={`flex gap-4 ${
                          hasIssue ? "bg-destructive/10 border-l-2 border-destructive pl-3" : ""
                        }`}
                      >
                        <span className="text-muted-foreground select-none w-8 text-right">
                          {lineNumber}
                        </span>
                        <span className="text-foreground/80">{line}</span>
                      </div>
                    );
                  })}
                </pre>
              </div>
            </Card>
          </div>

          {/* AI Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card className="glass p-6 border-border/50 sticky">
              <h3 className="text-foreground mb-4">AI Suggestions</h3>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-6 mb-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="modularity" className="text-xs">🧩</TabsTrigger>
                  <TabsTrigger value="readability" className="text-xs">✨</TabsTrigger>
                  <TabsTrigger value="bugs" className="text-xs">🐛</TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs">⚡</TabsTrigger>
                  <TabsTrigger value="security" className="text-xs">🔒</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {suggestions.map((suggestion) => (
                    <Collapsible
                      key={suggestion.id}
                      open={openSuggestions.includes(suggestion.id)}
                      onOpenChange={() => toggleSuggestion(suggestion.id)}
                    >
                      <Card className="border-border/30 bg-secondary/20">
                        <CollapsibleTrigger className="w-full p-4 text-left hover:bg-secondary/30 transition-colors rounded-lg">
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {openSuggestions.includes(suggestion.id) ? (
                                <ChevronDown className="w-4 h-4 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <div className={`p-1 rounded ${getSeverityColor(suggestion.severity)}`}>
                                  {getSuggestionIcon(suggestion.category)}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getSeverityColor(suggestion.severity)}`}
                                >
                                  {suggestion.severity}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground mb-1">{suggestion.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Line {suggestion.lineNumber}
                              </p>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
                            <div className="bg-secondary/50 rounded p-3">
                              <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
                                {suggestion.code}
                              </pre>
                            </div>
                            <div className="flex items-start gap-2 p-3 bg-primary/10 border border-primary/30 rounded">
                              <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-xs text-foreground">{suggestion.suggestion}</p>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  ))}
                </TabsContent>

                {/* Other TabsContent sections remain the same */}
                <TabsContent value="modularity" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {groupedSuggestions.modularity.map((suggestion) => (
                    <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                      <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">Line {suggestion.lineNumber}</p>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="readability" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {groupedSuggestions.readability.map((suggestion) => (
                    <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                      <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">Line {suggestion.lineNumber}</p>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="bugs" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {groupedSuggestions.bugs.map((suggestion) => (
                    <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                      <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">Line {suggestion.lineNumber}</p>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="performance" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {groupedSuggestions.performance.map((suggestion) => (
                    <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                      <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">Line {suggestion.lineNumber}</p>
                    </Card>
                  ))}
                </TabsContent>

                <TabsContent value="security" className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                  {groupedSuggestions.security.map((suggestion) => (
                    <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                      <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground">Line {suggestion.lineNumber}</p>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}