"use client";
import { useState, useRef } from "react";
import { Upload, File, X, BookOpen, Lightbulb, Code, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import toast, { Toaster } from "react-hot-toast";
import { CodeExplanation, UploadedFile } from "@/lib/types";
import { detectLanguage, readFileContent } from "@/lib/files-utils";
// Update these interfaces in your component

export default function CodeUnderstandPage() {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [selectedFile, setSelectedFile] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = async (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      progress: 0,
      status: "uploading",
      language: detectLanguage(file.name),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    for (const file of newFiles) {
      await processFileUnderstanding(file, files.find(f => f.name === file.name)!);
    }
  };

  const processFileUnderstanding = async (file: UploadedFile, originalFile: File) => {
    try {
   
      const content = await readFileContent(originalFile);
      
      
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress: 50, content } : f
      ));

      console.log('Sending code for understanding...');
      
      // Send to understanding API
      const response = await fetch('/api/understand', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          language: file.language,
          content: content,
        }),
      });

      console.log('Understanding API response status:', response.status);
      
      if (response.ok) {
        const explanation = await response.json();
        console.log('Explanation received:', explanation);
        
        
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 100, status: "completed", explanation } : f
        ));

        // Auto-select the first completed file
        if (!selectedFile) {
          setSelectedFile({ ...file, progress: 100, status: "completed", explanation, content });
        }
        
        toast.success(`"${file.name}" explained successfully!`);
      } else {
        const errorText = await response.text();
        console.error('Understanding failed:', errorText);
        throw new Error(`Understanding failed: ${errorText}`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: "error" } : f
      ));
      toast.error(`Failed to understand "${file.name}"`);
    }
  };

  

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
    if (selectedFile?.id === id) {
      setSelectedFile(null);
    }
  };

  const resetUploads = () => {
    setUploadedFiles([]);
    setSelectedFile(null);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm px-6 py-3 rounded-full border border-blue-200 dark:border-blue-800 mb-4">
            <Sparkles className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Code Understanding
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Upload your code files and let AI explain them in simple terms. 
            Learn programming concepts, code structure, and best practices.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Upload Area */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Card */}
            <Card className="glass p-6 dark:bg-gray-800/50 dark:border-gray-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Upload Code</h3>
              </div>

              <Card
                className={`p-6 border-2 border-dashed transition-all cursor-pointer dark:bg-gray-800/30 ${
                  isDragging
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400"
                    : "border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10"
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 dark:text-gray-500 mx-auto mb-3" />
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500">
                    Supports all programming languages
                  </p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.sql,.css,.html,.xml,.json"
                />
              </Card>

              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Uploaded Files</h4>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={resetUploads}
                      className="dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {uploadedFiles.map((file) => (
                      <div
                        key={file.id}
                        className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer dark:border-gray-700 ${
                          selectedFile?.id === file.id 
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400" 
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50"
                        }`}
                        onClick={() => setSelectedFile(file)}
                      >
                        <File className={`w-4 h-4 ${
                          file.status === "completed" ? "text-green-500 dark:text-green-400" : 
                          file.status === "error" ? "text-red-500 dark:text-red-400" : "text-blue-500 dark:text-blue-400"
                        }`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                              {file.language}
                            </Badge>
                            {file.status === "uploading" && (
                              <Progress value={file.progress} className="h-1 w-16 dark:bg-gray-700" />
                            )}
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile(file.id);
                          }}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <X className="w-3 h-3 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Explanation */}
          <div className="lg:col-span-2">
            {selectedFile?.explanation ? (
              <CodeExplanationView 
                file={selectedFile} 
                explanation={selectedFile.explanation} 
              />
            ) : (
              <Card className="glass p-8 text-center dark:bg-gray-800/50 dark:border-gray-700">
                <Lightbulb className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  No Code Selected
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Upload a code file to see its explanation and learn programming concepts.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Code Explanation Component - Display as single detailed view
const CodeExplanationView = ({ file, explanation }: { file: UploadedFile, explanation: CodeExplanation }) => {
  return (
    <Card className="glass p-6 dark:bg-gray-800/50 dark:border-gray-700">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
          <Code className="w-5 h-5 text-green-600 dark:text-green-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{file.name}</h2>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="secondary" className="dark:bg-gray-700 dark:text-gray-300">
              {file.language}
            </Badge>
            <Badge variant={
              explanation.difficulty === "beginner" ? "default" :
              explanation.difficulty === "intermediate" ? "secondary" : "destructive"
            } className="dark:bg-gray-700 dark:text-gray-300">
              {explanation.difficulty}
            </Badge>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {explanation.estimatedLearningTime}
            </span>
          </div>
        </div>
      </div>

      {/* High Level Overview */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          📋 High-Level Overview
        </h3>
        <div className="prose prose-lg max-w-none dark:prose-invert">
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
            {explanation.highLevelOverview}
          </p>
        </div>
      </section>

      {/* Pipeline/Program Flow */}
      {(explanation.pipelineStages || explanation.programFlow) && (
        <section className="mb-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
            🔄 {explanation.pipelineStages ? 'Pipeline Stages' : 'Program Flow'}
          </h3>
          <div className="flex flex-col gap-3">
            {(explanation.pipelineStages || explanation.programFlow)?.map((stage, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{stage}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Detailed Line-by-Line Breakdown */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          🔍 Detailed Line-by-Line Breakdown
        </h3>
        <div className="space-y-6">
          {explanation.detailedBreakdown.map((section, index) => (
            <Card key={index} className="p-4 dark:bg-gray-800/30 dark:border-gray-700">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0">
                  <Badge variant="outline" className="text-xs dark:border-gray-600 dark:text-gray-300">
                    {section.lineNumbers}
                  </Badge>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">{section.section}</h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">What it does:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{section.whatItDoes}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Why it matters:</p>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{section.whyItMatters}</p>
                    </div>
                    {section.codeSnippet && section.codeSnippet.trim() && (
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Code snippet:</p>
                        <pre className="text-xs bg-gray-100 dark:bg-gray-900 p-3 rounded-md overflow-x-auto border border-gray-200 dark:border-gray-700">
                          <code className="text-gray-700 dark:text-gray-300">{section.codeSnippet}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {section.conceptsUsed.map((concept, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs dark:bg-gray-700 dark:text-gray-300">
                    {concept}
                  </Badge>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Programming Concepts */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          🧠 Key Programming Concepts
        </h3>
        <div className="space-y-6">
          {explanation.keyConcepts.map((concept, index) => (
            <Card key={index} className="p-4 dark:bg-gray-800/30 dark:border-gray-700">
              <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 mb-3">{concept.name}</h4>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Simple Definition:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{concept.simpleDefinition}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Real-World Analogy:</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic">{concept.realWorldAnalogy}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Why Important:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{concept.whyImportant}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">Examples in Code:</p>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    {concept.examplesInCode.map((example, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{example}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Potential Improvements & Issues */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          ⚡ Potential Improvements & Issues
        </h3>
        <div className="space-y-4">
          {explanation.potentialIssues.map((issue, index) => (
            <Card key={index} className="p-4 border-l-4 border-orange-500 dark:bg-gray-800/30 dark:border-gray-700">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3">{issue.issue}</h4>
              <div className="space-y-2">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Impact:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{issue.impact}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Suggestion:</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{issue.suggestion}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Takeaways */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          💡 Key Takeaways
        </h3>
        <div className="space-y-3">
          {explanation.keyTakeaways.map((takeaway, index) => (
            <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
              <p className="text-gray-700 dark:text-gray-300">{takeaway}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Technical Terms Glossary */}
      <section className="mb-8">
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
          📚 Technical Terms Glossary
        </h3>
        <div className="grid gap-3">
          {explanation.glossary.map((item, index) => (
            <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/30 border border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 w-40">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.term}</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-700 dark:text-gray-300">{item.simpleDefinition}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Difficulty & Time */}
      <section className="flex items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Difficulty Level</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400 capitalize">{explanation.difficulty}</p>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Estimated Learning Time</p>
          <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{explanation.estimatedLearningTime}</p>
        </div>
      </section>
    </Card>
  );
};