import { clsx, type ClassValue } from "clsx"
import { useRouter } from "next/navigation";
import { useState } from "react";
import { twMerge } from "tailwind-merge"
import { HistoryItem } from "./types";

export const getLanguageColor = (language: string) => {
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
  export  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  
 export   const formatTimeAgo = (dateString: string) => {
     const date = new Date(dateString);
     const now = new Date();
     const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
     
     if (diffInSeconds < 60) return 'Just now';
     if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
     if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
     if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
     return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
   };
 
  export  const detectLanguage = (fileName: string): string => {
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
 


export   const getErrorTypeColor = (errorType: string) => {
    switch (errorType) {
      case "logical_error":
        return "bg-purple-500/20 text-purple-500 border-purple-500/30";
      case "syntax_error":
        return "bg-red-500/20 text-red-500 border-red-500/30";
      case "runtime_error":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30";
      case "best_practice":
        return "bg-blue-500/20 text-blue-500 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-500 border-gray-500/30";
    }
  };

export  const getCategoryColor = (category: string) => {
    switch (category) {
      case "logic":
        return "bg-purple-500/20 text-purple-500";
      case "syntax":
        return "bg-red-500/20 text-red-500";
      case "performance":
        return "bg-orange-500/20 text-orange-500";
      case "security":
        return "bg-green-500/20 text-green-500";
      case "structure":
        return "bg-blue-500/20 text-blue-500";
      case "maintainability":
        return "bg-indigo-500/20 text-indigo-500";
      default:
        return "bg-gray-500/20 text-gray-500";
    }
  };
export const  getSeverityColor = (severity: string) => {
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
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
