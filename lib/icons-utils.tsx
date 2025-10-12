import { 
  Code2, FileCode, Zap, Shield, Boxes, Sparkles, Bug,
  CheckCircle, Clock, AlertTriangle, FileWarning 
} from "lucide-react";

export const getSuggestionIcon = (category: string) => {
  switch (category) {
    case "logic": return <Code2 className="w-5 h-5" />;
    case "syntax": return <FileCode className="w-5 h-5" />;
    case "performance": return <Zap className="w-5 h-5" />;
    case "security": return <Shield className="w-5 h-5" />;
    case "structure": return <Boxes className="w-5 h-5" />;
    case "maintainability": return <Sparkles className="w-5 h-5" />;
    case "bugs": return <Bug className="w-5 h-5" />;
    default: return <Code2 className="w-5 h-5" />;
  }
};

export const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed": return <CheckCircle className="w-5 h-5 text-accent" />;
    case "in-progress": return <Clock className="w-5 h-5 text-primary" />;
    case "error": return <AlertTriangle className="w-5 h-5 text-destructive" />;
    default: return <FileWarning className="w-5 h-5 text-muted-foreground" />;
  }
};