"use client";
import { useEffect, useState } from "react";
import { Upload, File, X, Clock, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { Badge } from "@/components/ui/badge";

interface UploadPageProps {
  onNavigate: (page: string) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
  progress: number;
  status: "uploading" | "completed" | "error";
  content?: string;
  language: string;
  documentId?: string;
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
  const [uploadHistory, setUploadHistory] = useState<HistoryItem[]>([]);
  const router = useRouter();

  const fetchUploadHistory = async () => {
    try {
      const response = await fetch('/api/documents');
      if (response.ok) {
        const documents = await response.json();
        const history: HistoryItem[] = documents.map((doc: any) => ({
          id: doc.id,
          fileName: doc.fileName || doc.file_name,
          date: formatTimeAgo(doc.createdAt || doc.created_at),
          language: doc.language,
          status: "completed"
        }));
        setUploadHistory(history);
      }
    } catch (error) {
      console.error('Error fetching upload history:', error);
    }
  };

  useEffect(() => {
    fetchUploadHistory();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const detectLanguage = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    const languageMap: { [key: string]: string } = {
      'js': 'JavaScript',
      'jsx': 'JavaScript',
      'ts': 'TypeScript',
      'tsx': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'go': 'Go',
      'rb': 'Ruby',
      'php': 'PHP',
      'sql': 'SQL',
      'css': 'CSS',
      'html': 'HTML',
      'xml': 'XML',
      'json': 'JSON',
      'yaml': 'YAML',
      'yml': 'YAML'
    };
    return languageMap[extension || ''] || 'Unknown';
  };

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
      status: "uploading" as const,
      language: detectLanguage(file.name),
    }));

    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Process each file
    for (const file of newFiles) {
      await processFileUpload(file, files.find(f => f.name === file.name)!);
    }
  };

  const processFileUpload = async (file: UploadedFile, originalFile: File) => {
    try {
      // Read file content
      const content = await readFileContent(originalFile);
      
      // Update progress to 50% (file read)
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, progress: 50, content } : f
      ));

      // Upload to database
      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileName: file.name,
          language: file.language,
          content: content,
          issuesFound: 0,
          severity: "low",
          status: "in-progress"
        }),
      });

      if (response.ok) {
        const savedDocument = await response.json();
        
        // Update progress to 75% (database saved) and store documentId
        setUploadedFiles(prev => prev.map(f => 
          f.id === file.id ? { ...f, progress: 75, documentId: savedDocument.id } : f
        ));

        // Trigger Gemini analysis
        const analysisResponse = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: savedDocument.id,
            content: content,
            language: file.language,
            fileName: file.name
          }),
        });

        if (analysisResponse.ok) {
          // Update progress to 100% and mark as completed
          setUploadedFiles(prev => prev.map(f => 
            f.id === file.id ? { ...f, progress: 100, status: "completed" } : f
          ));
          
          // Refresh upload history
          fetchUploadHistory();
          toast.success(`File "${file.name}" analyzed successfully!`);
        } else {
          throw new Error('Analysis failed');
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id ? { ...f, status: "error" } : f
      ));
      toast.error(`Failed to process "${file.name}"`);
    }
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  const removeFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const analyzeCode = () => {
    // Navigate to the first completed file's report
    const completedFile = uploadedFiles.find(f => f.status === "completed");
    if (completedFile && completedFile.documentId) {
      router.push(`/report/${completedFile.documentId}`);
    } else {
      // If no documentId is available, go to dashboard
      router.push('/dashboard');
    }
  };

  const resetUploads = () => {
    setUploadedFiles([]);
  };

  const BackFun = () => {
    router.push('/');
  };

  const handleHistoryItemClick = async (item: HistoryItem) => {
    // Navigate directly to the report page
    router.push(`/report/${item.id}`);
  };

  return (
    <div className="min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Upload Area */}
          <div className="lg:col-span-2 space-y-6">
            <Button
              variant="outline"
              className="flex"
              onClick={BackFun}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            
            <div className="text-center lg:text-left">
              <h1 className="text-3xl text-foreground mb-2">Upload Code Files</h1>
              <p className="text-muted-foreground text-lg">
                Upload your source code files for AI-powered analysis
              </p>
            </div>

            {/* Drop Zone */}
            <Card
              className={`glass p-8 border-2 border-dashed transition-all cursor-pointer ${
                isDragging
                  ? "border-primary bg-primary/10 glow"
                  : "border-border/50 hover:border-primary/50 hover:bg-primary/5"
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
                <h3 className="text-xl text-foreground mb-3 font-medium">
                  Drop files here or click to browse
                </h3>
                <p className="text-muted-foreground mb-6">
                  Supports .js, .py, .java, .cpp, .ts, .go, and more
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    variant="outline" 
                    className="glass border-border/50"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById("file-input")?.click();
                    }}
                  >
                    Browse Files
                  </Button>
                  {uploadedFiles.length > 0 && (
                    <Button 
                      variant="outline" 
                      className="glass border-destructive/50 text-destructive hover:bg-destructive/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        resetUploads();
                      }}
                    >
                      Reset
                    </Button>
                  )}
                </div>
                <input
                  id="file-input"
                  type="file"
                  multiple
                  className="hidden"
                  onChange={handleFileInput}
                  accept=".js,.jsx,.ts,.tsx,.py,.java,.cpp,.c,.go,.rb,.php,.sql,.css,.html,.xml,.json,.yaml,.yml"
                />
              </div>
            </Card>

            {/* Upload Progress */}
            {uploadedFiles.length > 0 && (
              <Card className="glass p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl text-foreground font-medium">Upload Progress</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {uploadedFiles.filter(f => f.status === "completed").length} of {uploadedFiles.length} complete
                    </span>
                    <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-4 p-4 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/30 transition-all"
                    >
                      <div className={`p-2 rounded-lg ${
                        file.status === "completed" ? "bg-accent/20" : 
                        file.status === "error" ? "bg-destructive/20" : "bg-primary/20"
                      }`}>
                        <File className={`w-5 h-5 ${
                          file.status === "completed" ? "text-accent" : 
                          file.status === "error" ? "text-destructive" : "text-primary"
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {file.language}
                            </Badge>
                            <span className="text-xs text-muted-foreground whitespace-nowrap">
                              {file.size}
                            </span>
                          </div>
                        </div>
                        
                        {file.status === "uploading" && (
                          <div className="space-y-2">
                            <Progress value={file.progress} className="h-2" />
                            <p className="text-xs text-muted-foreground">
                              {file.progress < 50 ? 'Reading file...' : 'Uploading to database...'} {file.progress}%
                            </p>
                          </div>
                        )}
                        
                        {file.status === "completed" && (
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Uploaded successfully</span>
                          </div>
                        )}
                        
                        {file.status === "error" && (
                          <div className="flex items-center gap-2 text-sm text-destructive">
                            <AlertCircle className="w-4 h-4" />
                            <span>Upload failed - please try again</span>
                          </div>
                        )}
                      </div>
                      
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFile(file.id);
                        }}
                        className="p-2 rounded-lg hover:bg-destructive/20 transition-colors group"
                      >
                        <X className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    className="flex-1 glow"
                    onClick={analyzeCode}
                    disabled={uploadedFiles.length === 0 || uploadedFiles.every((f) => f.status !== "completed")}
                    size="lg"
                  >
                    {uploadedFiles.some(f => f.status === "uploading") ? (
                      <>Uploading Files...</>
                    ) : uploadedFiles.some(f => f.status === "completed") ? (
                      <>View Analysis ({uploadedFiles.filter(f => f.status === "completed").length} files)</>
                    ) : (
                      <>Analyze Code</>
                    )}
                  </Button>
                </div>
              </Card>
            )}
          </div>

          {/* Upload History Sidebar */}
          <div className="lg:col-span-1">
            <Card className="glass p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl text-foreground font-medium">Upload History</h3>
                  <p className="text-sm text-muted-foreground">Recent file uploads</p>
                </div>
              </div>
              
              <ScrollArea className="h-[500px]">
                <div className="space-y-3">
                  {uploadHistory.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleHistoryItemClick(item)}
                      className="w-full p-4 rounded-lg bg-secondary/20 border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-primary/10 group-hover:bg-primary/20 transition-colors flex-shrink-0">
                          <File className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground truncate mb-1">
                            {item.fileName}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
                            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
                              {item.language}
                            </span>
                            <span>{item.date}</span>
                          </div>
                        </div>
                        {item.status === "completed" && (
                          <CheckCircle2 className="w-4 h-4 text-accent flex-shrink-0 mt-1" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
                
                {uploadHistory.length === 0 && (
                  <div className="text-center py-8">
                    <File className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-muted-foreground">No upload history yet</p>
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}