// app/(dashboard)/report/[id]/page.tsx
"use client";
import { useEffect, useState } from "react";
import { Download, ChevronDown, ChevronRight, Code2, Boxes, Sparkles, Bug, FileCode, Zap, Shield, AlertTriangle, CheckCircle, Clock, FileWarning } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { DashboardDocument, ReviewReportPageProps } from "@/lib/types";
import { getCategoryColor, getErrorTypeColor, getSeverityColor } from "@/lib/utils";


export default function ReviewReportPage({ onNavigate }: ReviewReportPageProps ) {
  const [openSuggestions, setOpenSuggestions] = useState<string[]>(["1"]);
  const [document, setDocument] = useState<DashboardDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const router = useRouter();

  const toggleSuggestion = (id: string) => {
    setOpenSuggestions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    if (params.id) {
      fetchDocument(params.id as string);
    }
  }, [params.id]);

     const getSuggestionIcon = (category: string) => {
    switch (category) {
      case "logic":
        return <Code2 className="w-5 h-5" />;
      case "syntax":
        return <FileCode className="w-5 h-5" />;
      case "performance":
        return <Zap className="w-5 h-5" />;
      case "security":
        return <Shield className="w-5 h-5" />;
      case "structure":
        return <Boxes className="w-5 h-5" />;
      case "maintainability":
        return <Sparkles className="w-5 h-5" />;
      case "bugs":
        return <Bug className="w-5 h-5" />;
      default:
        return <Code2 className="w-5 h-5" />;
    }
  };

  const fetchDocument = async (id: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/documents/${id}`);
      if (response.ok) {
        const data = await response.json();
        console.log('Document data from API:', data);
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

  const suggestions = document.geminiReport?.suggestions || [];
  const summary = document.geminiReport?.summary;
  const codeQuality = document.geminiReport?.codeQuality;
  const executionAnalysis = document.geminiReport?.executionAnalysis;

 

  const groupedSuggestions = {
    logic: suggestions.filter((s) => s.category === "logic"),
    syntax: suggestions.filter((s) => s.category === "syntax"),
    performance: suggestions.filter((s) => s.category === "performance"),
    security: suggestions.filter((s) => s.category === "security"),
    structure: suggestions.filter((s) => s.category === "structure"),
    maintainability: suggestions.filter((s) => s.category === "maintainability"),
    bugs: suggestions.filter((s) => s.category === "bugs"),
  };

  const QualityScoreCard = ({ title, score, max = 10 }: { title: string; score: number; max?: number }) => (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">{title}</span>
        <span className="text-foreground font-medium">{score}/{max}</span>
      </div>
      <Progress value={(score / max) * 100} className="h-2" />
    </div>
  );

  return (
    <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl text-foreground mb-2">AI Code Analysis Report</h1>
            <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>{document.fileName}</span>
              </div>
              <span>•</span>
              <span>{document.language}</span>
              <span>•</span>
              <span>{summary?.totalIssues || 0} issues found</span>
              <span>•</span>
              <div className="flex items-center gap-1">
                <span>Overall Score:</span>
                <Badge variant="outline" className={
                  (summary?.overallScore || 0) >= 80 ? "bg-green-500/20 text-green-500 border-green-500/30" :
                  (summary?.overallScore || 0) >= 60 ? "bg-yellow-500/20 text-yellow-500 border-yellow-500/30" :
                  "bg-red-500/20 text-red-500 border-red-500/30"
                }>
                  {summary?.overallScore || 0}/100
                </Badge>
              </div>
            </div>
          </div>
         
        </div>

        
        {summary?.hasCriticalErrors && (
          <Card className="glass border-destructive/30 bg-destructive/10 p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive" />
              <div>
                <h4 className="text-destructive font-medium">Critical Errors Detected</h4>
                <p className="text-sm text-muted-foreground">
                  This code contains critical issues that may cause runtime failures or unexpected behavior.
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-foreground mb-1">
              {summary?.totalIssues || 0}
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
          <Card className="glass p-6 border-border/50">
            <div className="flex items-center gap-2 mb-1">
              {executionAnalysis?.willRun ? (
                <CheckCircle className="w-6 h-6 text-green-500" />
              ) : (
                <FileWarning className="w-6 h-6 text-destructive" />
              )}
              <span className="text-2xl text-foreground">
                {executionAnalysis?.willRun ? "Runnable" : "May Fail"}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">Execution Status</div>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Code & Quality Metrics */}
          <div className="lg:col-span-2 space-y-6">
            {/* Code Display */}
            <Card className="glass p-6 border-border/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-foreground">Source Code Analysis</h3>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {document.language}
                  </Badge>
                  {executionAnalysis?.hasInfiniteLoops && (
                    <Badge variant="outline" className="bg-red-500/20 text-red-500 border-red-500/30 text-xs">
                      Infinite Loop Risk
                    </Badge>
                  )}
                </div>
              </div>
              <div className="bg-secondary/30 rounded-lg p-4 overflow-x-auto max-h-[500px] overflow-y-auto">
                <pre className="font-mono text-sm">
                  {document.content.split("\n").map((line, index) => {
                    const lineNumber = index + 1;
                    const lineSuggestions = suggestions.filter(s => s.lineNumber === lineNumber);
                    const hasHighSeverity = lineSuggestions.some(s => s.severity === "high");
                    const hasMediumSeverity = lineSuggestions.some(s => s.severity === "medium");
                    
                    return (
                      <div
                        key={index}
                        className={`flex gap-4 group ${
                          hasHighSeverity 
                            ? "bg-destructive/10 border-l-2 border-destructive pl-3" 
                            : hasMediumSeverity
                            ? "bg-[#F59E0B]/10 border-l-2 border-[#F59E0B] pl-3"
                            : lineSuggestions.length > 0
                            ? "bg-accent/10 border-l-2 border-accent pl-3"
                            : ""
                        } hover:bg-secondary/50 transition-colors`}
                      >
                        <span className="text-muted-foreground select-none w-8 text-right flex-shrink-0">
                          {lineNumber}
                        </span>
                        <span className="text-foreground/80 flex-1">{line}</span>
                        {lineSuggestions.length > 0 && (
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                            {lineSuggestions.map((suggestion, idx) => (
                              <div
                                key={idx}
                                className={`w-2 h-2 rounded-full ${
                                  suggestion.severity === "high" ? "bg-destructive" :
                                  suggestion.severity === "medium" ? "bg-[#F59E0B]" :
                                  "bg-accent"
                                }`}
                                title={suggestion.title}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </pre>
              </div>
            </Card>

            {/* Code Quality Metrics */}
            {codeQuality && (
              <Card className="glass p-6 border-border/50">
                <h3 className="text-foreground mb-4">Code Quality Metrics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <QualityScoreCard title="Readability" score={codeQuality.readability} />
                    <QualityScoreCard title="Maintainability" score={codeQuality.maintainability} />
                  </div>
                  <div className="space-y-4">
                    <QualityScoreCard title="Efficiency" score={codeQuality.efficiency} />
                    <QualityScoreCard title="Security" score={codeQuality.security} />
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - AI Suggestions Panel */}
          <div className="lg:col-span-1">
            <Card className="glass p-6 border-border/50 sticky top-24">
              <h3 className="text-foreground mb-4">Deep Analysis Results</h3>
              
              {/* Execution Summary */}
              {executionAnalysis && (
                <div className="mb-6 p-4 bg-secondary/30 rounded-lg">
                  <h4 className="text-sm font-medium mb-3">Execution Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Will Compile:</span>
                      <Badge variant="outline" className={
                        executionAnalysis.willCompile 
                          ? "bg-green-500/20 text-green-500 border-green-500/30" 
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }>
                        {executionAnalysis.willCompile ? "Yes" : "No"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Will Run:</span>
                      <Badge variant="outline" className={
                        executionAnalysis.willRun 
                          ? "bg-green-500/20 text-green-500 border-green-500/30" 
                          : "bg-destructive/20 text-destructive border-destructive/30"
                      }>
                        {executionAnalysis.willRun ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {executionAnalysis.potentialOutput && (
                      <div>
                        <span className="text-muted-foreground">Expected:</span>
                        <p className="text-xs mt-1 text-foreground/80">{executionAnalysis.potentialOutput}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Tabs defaultValue="all" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-4">
                  <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
                  <TabsTrigger value="logic" className="text-xs">Logic</TabsTrigger>
                  <TabsTrigger value="syntax" className="text-xs">Syntax</TabsTrigger>
                  <TabsTrigger value="performance" className="text-xs">Perf</TabsTrigger>
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
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <div className={`p-1 rounded ${getSeverityColor(suggestion.severity)}`}>
                                  {getSuggestionIcon(suggestion.category)}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getSeverityColor(suggestion.severity)}`}
                                >
                                  {suggestion.severity}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={`text-xs ${getCategoryColor(suggestion.category)}`}
                                >
                                  {suggestion.category}
                                </Badge>
                              </div>
                              <p className="text-sm text-foreground mb-1 truncate">{suggestion.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Line {suggestion.lineNumber} • {suggestion.errorType}
                              </p>
                            </div>
                          </div>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="px-4 pb-4 space-y-3">
                            <p className="text-sm text-muted-foreground">
                              {suggestion.description}
                            </p>
                            {suggestion.potentialImpact && (
                              <div className="flex items-start gap-2 p-3 bg-amber-500/10 border border-amber-500/30 rounded">
                                <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                                <div>
                                  <p className="text-xs font-medium text-amber-500">Potential Impact</p>
                                  <p className="text-xs text-amber-600">{suggestion.potentialImpact}</p>
                                </div>
                              </div>
                            )}
                            <div className="bg-secondary/50 rounded p-3">
                              <pre className="font-mono text-xs text-foreground/80 overflow-x-auto">
                                {suggestion.codeSnippet}
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

                {/* Category-specific tabs */}
                {Object.entries(groupedSuggestions).map(([category, categorySuggestions]) => (
                  <TabsContent key={category} value={category} className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                    {categorySuggestions.map((suggestion) => (
                      <Card key={suggestion.id} className="p-4 border-border/30 bg-secondary/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className={`text-xs ${getSeverityColor(suggestion.severity)}`}>
                            {suggestion.severity}
                          </Badge>
                          <Badge variant="outline" className={`text-xs ${getErrorTypeColor(suggestion.errorType)}`}>
                            {suggestion.errorType}
                          </Badge>
                        </div>
                        <p className="text-sm text-foreground mb-2">{suggestion.title}</p>
                        <p className="text-xs text-muted-foreground mb-2">Line {suggestion.lineNumber}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2">{suggestion.description}</p>
                      </Card>
                    ))}
                  </TabsContent>
                ))}
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}