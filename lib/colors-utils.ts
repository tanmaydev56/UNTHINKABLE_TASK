export const getLanguageColor = (language: string): string => {
  const colors: { [key: string]: string } = {
    javascript: "bg-yellow-500/20 text-yellow-500 border-yellow-500/30",
    typescript: "bg-blue-500/20 text-blue-500 border-blue-500/30", 
    python: "bg-green-500/20 text-green-500 border-green-500/30",
    java: "bg-red-500/20 text-red-500 border-red-500/30",
    default: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return colors[language.toLowerCase()] || colors.default;
};

export const getSeverityColor = (severity: string): string => {
  const colors: { [key: string]: string } = {
    high: "bg-destructive/20 text-destructive border-destructive/30",
    medium: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
    low: "bg-accent/20 text-accent border-accent/30",
    default: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return colors[severity.toLowerCase()] || colors.default;
};

export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    logic: "bg-purple-500/20 text-purple-500 border-purple-500/30",
    syntax: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    performance: "bg-orange-500/20 text-orange-500 border-orange-500/30",
    security: "bg-red-500/20 text-red-500 border-red-500/30",
    structure: "bg-green-500/20 text-green-500 border-green-500/30",
    maintainability: "bg-teal-500/20 text-teal-500 border-teal-500/30",
    bugs: "bg-rose-500/20 text-rose-500 border-rose-500/30",
    default: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return colors[category.toLowerCase()] || colors.default;
};

export const getErrorTypeColor = (errorType: string): string => {
  const colors: { [key: string]: string } = {
    error: "bg-destructive/20 text-destructive border-destructive/30",
    warning: "bg-[#F59E0B]/20 text-[#F59E0B] border-[#F59E0B]/30",
    info: "bg-blue-500/20 text-blue-500 border-blue-500/30",
    suggestion: "bg-accent/20 text-accent border-accent/30",
    default: "bg-gray-500/20 text-gray-500 border-gray-500/30"
  };
  return colors[errorType.toLowerCase()] || colors.default;
};