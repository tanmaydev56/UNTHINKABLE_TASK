"use client";
import { useState } from "react";
import { Upload, File, X, Clock, CheckCircle2, AlertCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "completed" | "error";
}

interface HistoryItem {
  id: string;
  fileName: string;
  date: string;
  language: string;
  status: "completed" | "pending";
}

export default function UploadPage({ onNavigate }: UploadPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const uploadHistory: HistoryItem[] = [
    { id: "1", fileName: "api-handler.js", date: "2 hours ago", language: "JavaScript", status: "completed" },
    { id: "2", fileName: "auth.py", date: "5 hours ago", language: "Python", status: "completed" },
    { id: "3", fileName: "UserService.java", date: "Yesterday", language: "Java", status: "completed" },
    { id: "4", fileName: "database.sql", date: "2 days ago", language: "SQL", status: "completed" },
  ];

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

  const handleFiles = (files: File[]) => {
    const newFiles: UploadedFile[] = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: (file.size / 1024).toFixed(2) + " KB",
      progress: 0,
      status: "uploading" as const,
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach((file) => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadedFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? { ...f, progress, status: progress >= 100 ? "completed" : "uploading" }
              : f
          )
        );
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const analyzeCode = () => {
    onNavigate("review");
  };

  return (
    <div className=" pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h1 className="text-3xl text-foreground mb-2">Upload Code Files</h1>
              <p className="text-muted-foreground">
                Upload your source code files for AI-powered analysis
              </p>
            </div>

            {/* Drop Zone */}
            <Card
              className={`glass p-12 border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/5 glow"
                  : "border-border/50 hover:border-primary/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById("file-input")?.click()}
            >
              <div className="text-center">
                <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-foreground mb-2">Drop files here or click to browse</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Supports .js, .py, .java, .cpp, .ts, .go, and more
                </p>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.sql,.css,.html"
                />
              </div>
            </Card>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-foreground">Uploaded Files</h3>
                  <span className="text-sm text-muted-foreground">
                    {uploadedFiles.length} file(s)
                  </span>
                </div>
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border/30"
                    >
                      <div className="p-2 rounded-lg bg-primary/10">
                        <File className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm text-foreground truncate">{file.name}</p>
                          <span className="text-xs text-muted-foreground">{file.size}</span>
                        </div>
                        {file.status === "uploading" && (
                          <Progress value={file.progress} className="h-1" />
                        )}
                        {file.status === "completed" && (
                          <div className="flex items-center gap-2 text-xs text-accent">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Upload complete</span>
                          </div>
                        )}
                        {file.status === "error" && (
                          <div className="flex items-center gap-2 text-xs text-destructive">
                            <AlertCircle className="w-3 h-3" />
                            <span>Upload failed</span>
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => removeFile(file.id)}
                        className="p-1 rounded hover:bg-destructive/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-muted-foreground hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-6 glow"
                  onClick={analyzeCode}
                  disabled={uploadedFiles.some((f) => f.status !== "completed")}
                >
                  Analyze Code
                </Button>
              </Card>
            )}
          </div>

          {/* Upload History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="text-foreground">Upload History</h3>
              </div>
              <ScrollArea className="h-[600px] pr-4">
                <div className="space-y-3">
                  {uploadHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => onNavigate("review")}
                      className="w-full p-4 rounded-lg bg-secondary/30 border border-border/30 hover:border-primary/50 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <File className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-foreground truncate mb-1">
                            {item.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{item.language}</span>
                            <span>•</span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                        {item.status === "completed" && (
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
