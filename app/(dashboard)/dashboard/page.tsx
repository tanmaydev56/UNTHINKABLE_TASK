// app/(dashboard)/dashboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Trash2,
  Calendar,
  Code2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Document } from "@/lib/types";
import { formatDate, getLanguageColor, getSeverityColor } from "@/lib/utils";



export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/documents');
      if (response.ok) {
        const data = await response.json();
        setDocuments(data);
      } else {
        toast.error('Failed to fetch documents');
      }
    } catch (error) {
      toast.error('Error fetching documents');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };



  const handleReview = (id: string) => {
    router.push(`/report/${id}`);
  };

  

 
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterBy === "all" ||
      doc.language.toLowerCase() === filterBy.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = async (id: string) => {
    const documentToDelete = documents.find((d) => d.id === id);
    if (!documentToDelete) return;

    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setDocuments((prev) => prev.filter((d) => d.id !== id));
        toast(
          (t) => (
            <div className="flex items-center gap-2">
              Document "{documentToDelete.fileName}" deleted
              <button
                onClick={async () => {
                  try {
                    const restoreResponse = await fetch('/api/documents', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify(documentToDelete),
                    });
                    
                    if (restoreResponse.ok) {
                      const restoredDoc = await restoreResponse.json();
                      setDocuments((prev) => [...prev, restoredDoc].sort(
                        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                      ));
                    }
                  } catch (error) {
                    toast.error('Failed to restore document');
                  }
                  toast.dismiss(t.id);
                }}
                className="underline ml-2"
              >
                Undo
              </button>
            </div>
          ),
          { duration: 5000 }
        );
      } else {
        toast.error('Failed to delete document');
      }
    } catch (error) {
      toast.error('Error deleting document');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-foreground mb-2">
            Review Dashboard
          </h1>
          <p className="text-muted-foreground">
            View and manage all your code reviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-foreground mb-1">
              {documents.length}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Reviews
            </div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-primary mb-1">
              {documents.filter((r) => r.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-destructive mb-1">
              {documents.filter((r) => r.severity === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">
              High Priority
            </div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-accent mb-1">
              {documents.reduce((sum, r) => sum + r.issuesFound, 0)}
            </div>
            <div className="text-sm text-muted-foreground">
              Total Issues
            </div>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card className="glass p-6 mb-6 border-border/50">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by file name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 glass border-border/50"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="glass border-border/50"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  {filterBy === "all" ? "All Languages" : filterBy}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="glass">
                <DropdownMenuItem onClick={() => setFilterBy("all")}>
                  All Languages
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("javascript")}>
                  JavaScript
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("python")}>
                  Python
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("java")}>
                  Java
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterBy("typescript")}>
                  TypeScript
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </Card>

        {/* Documents List */}
        <div className="space-y-4">
          {filteredDocuments.map((document) => (
            <Card
              key={document.id}
              className="glass p-6 border-border/50 hover:border-primary/50 transition-all cursor-pointer"
              onClick={() => handleReview(document.id)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="p-3 rounded-lg bg-primary/10 w-fit">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-foreground mb-2">
                        {document.fileName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getLanguageColor(
                            document.language
                          )}`}
                        >
                          {document.language}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSeverityColor(
                            document.severity
                          )}`}
                        >
                          {document.severity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{formatDate(document.createdAt)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground">
                        {document.issuesFound}
                      </span>{" "}
                      issues found
                    </div>
                    <div>
                      Status:{" "}
                      <span className="text-accent">{document.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <Button
                    variant="outline"
                    className="glass border-border/50"
                    onClick={() => handleReview(document.id)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-border/50 hover:border-destructive/50 hover:bg-destructive/10"
                    onClick={() => handleDelete(document.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && !loading && (
          <Card className="glass p-12 text-center border-border/50">
            <div className="inline-flex p-4 rounded-full bg-muted/20 mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">
              {documents.length === 0 ? "No documents yet" : "No documents found"}
            </h3>
            <p className="text-muted-foreground">
              {documents.length === 0 
                ? "Upload your first code file to get started" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}