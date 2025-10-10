"use client";
import { useState } from "react";
import { Search, Filter, Eye, Trash2, Calendar, Code2, ChevronDown } from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

interface Review {
  id: string;
  fileName: string;
  language: string;
  date: string;
  issuesFound: number;
  severity: "high" | "medium" | "low";
  status: "completed" | "in-progress" | "failed";
}

export default function DashboardPage({ onNavigate }: DashboardPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState<string | null>(null);

  const reviews: Review[] = [
    {
      id: "1",
      fileName: "api-handler.js",
      language: "JavaScript",
      date: "Oct 9, 2025",
      issuesFound: 4,
      severity: "high",
      status: "completed",
    },
    {
      id: "2",
      fileName: "auth.py",
      language: "Python",
      date: "Oct 8, 2025",
      issuesFound: 2,
      severity: "medium",
      status: "completed",
    },
    {
      id: "3",
      fileName: "UserService.java",
      language: "Java",
      date: "Oct 7, 2025",
      issuesFound: 6,
      severity: "high",
      status: "completed",
    },
    {
      id: "4",
      fileName: "database.sql",
      language: "SQL",
      date: "Oct 6, 2025",
      issuesFound: 1,
      severity: "low",
      status: "completed",
    },
    {
      id: "5",
      fileName: "components.tsx",
      language: "TypeScript",
      date: "Oct 5, 2025",
      issuesFound: 3,
      severity: "medium",
      status: "completed",
    },
    {
      id: "6",
      fileName: "styles.css",
      language: "CSS",
      date: "Oct 4, 2025",
      issuesFound: 0,
      severity: "low",
      status: "completed",
    },
  ];

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

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-[#F7DF1E]/20 text-[#F7DF1E] border-[#F7DF1E]/30",
      Python: "bg-[#3776AB]/20 text-[#3776AB] border-[#3776AB]/30",
      Java: "bg-[#007396]/20 text-[#007396] border-[#007396]/30",
      TypeScript: "bg-[#3178C6]/20 text-[#3178C6] border-[#3178C6]/30",
      SQL: "bg-primary/20 text-primary border-primary/30",
      CSS: "bg-[#264DE4]/20 text-[#264DE4] border-[#264DE4]/30",
    };
    return colors[language] || "bg-muted";
  };

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch = review.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesFilter =
      filterBy === "all" || review.language.toLowerCase() === filterBy.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id: string) => {
    setSelectedReview(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    console.log("Deleting review:", selectedReview);
    setDeleteDialogOpen(false);
    setSelectedReview(null);
  };

  return (
    <div className="min-h-screen animated-gradient pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-foreground mb-2">Review Dashboard</h1>
          <p className="text-muted-foreground">
            View and manage all your code reviews
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-foreground mb-1">{reviews.length}</div>
            <div className="text-sm text-muted-foreground">Total Reviews</div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-primary mb-1">
              {reviews.filter((r) => r.status === "completed").length}
            </div>
            <div className="text-sm text-muted-foreground">Completed</div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-destructive mb-1">
              {reviews.filter((r) => r.severity === "high").length}
            </div>
            <div className="text-sm text-muted-foreground">High Priority</div>
          </Card>
          <Card className="glass p-6 border-border/50">
            <div className="text-2xl text-accent mb-1">
              {reviews.reduce((sum, r) => sum + r.issuesFound, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Issues</div>
          </Card>
        </div>

        {/* Search and Filter */}
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
                <Button variant="outline" className="glass border-border/50">
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

        {/* Reviews List */}
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card
              key={review.id}
              className="glass p-6 border-border/50 hover:border-primary/50 transition-all"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                {/* Icon */}
                <div className="p-3 rounded-lg bg-primary/10 w-fit">
                  <Code2 className="w-6 h-6 text-primary" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <h3 className="text-foreground mb-2">{review.fileName}</h3>
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge
                          variant="outline"
                          className={`text-xs ${getLanguageColor(review.language)}`}
                        >
                          {review.language}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-xs ${getSeverityColor(review.severity)}`}
                        >
                          {review.severity}
                        </Badge>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{review.date}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-muted-foreground">
                    <div>
                      <span className="text-foreground">{review.issuesFound}</span> issues
                      found
                    </div>
                    <div>
                      Status: <span className="text-accent">{review.status}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="glass border-border/50"
                    onClick={() => onNavigate("review")}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Report
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-border/50 hover:border-destructive/50 hover:bg-destructive/10"
                    onClick={() => handleDelete(review.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReviews.length === 0 && (
          <Card className="glass p-12 text-center border-border/50">
            <div className="inline-flex p-4 rounded-full bg-muted/20 mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-foreground mb-2">No reviews found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
