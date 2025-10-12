import { Progress } from "@/components/ui/progress";

export const QualityScoreCard = ({ title, score, max = 10 }: { 
  title: string; 
  score: number; 
  max?: number 
}) => (
  <div className="space-y-2">
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{title}</span>
      <span className="text-foreground font-medium">{score}/{max}</span>
    </div>
    <Progress value={(score / max) * 100} className="h-2" />
  </div>
);

export const getOverallScoreColor = (score: number): string => {
  if (score >= 80) return "bg-green-500/20 text-green-500 border-green-500/30";
  if (score >= 60) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30";
  return "bg-red-500/20 text-red-500 border-red-500/30";
};