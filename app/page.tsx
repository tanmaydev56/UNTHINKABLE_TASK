import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileCode, Github, Mail, Shield, Sparkles, Zap } from "lucide-react";
import Image from "next/image";

export default function Home() {
  const features = [
    {
      icon: Sparkles,
      title: "AI-Powered Analysis",
      description: "Advanced AI algorithms analyze your code for best practices",
    },
    {
      icon: Shield,
      title: "Security Focused",
      description: "Detect potential vulnerabilities and security issues",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Get comprehensive reviews in seconds, not hours",
    },
  ];
  return (
     <div className="min-h-screen animated-gradient">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 glow">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">Powered by Advanced AI</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl text-foreground mb-6 tracking-tight">
              AI Code Review
              <br />
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Assistant
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
              Upload. Analyze. Improve your code instantly.
              <br />
              Get intelligent suggestions to write better, cleaner code.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                className="glow group px-8 py-6 bg-primary hover:bg-primary/90"
                // onClick={() => onNavigate("upload")}
              >
                Get Started
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 glass hover:bg-secondary/20"
              >
                View Documentation
              </Button>
            </div>
          </div>

          {/* Code Preview Mockup */}
          <div className="mt-20 relative">
            <div className="glass dark:bg-gray-900/40 dark:border-gray-500/20 rounded-2xl p-8 max-w-4xl mx-auto glow">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
                <div className="w-3 h-3 rounded-full bg-accent"></div>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <div className="flex gap-4">
                  <span className="text-muted-foreground select-none">1</span>
                  <span className="text-foreground/80">
                    <span className="text-[#C792EA]">function</span>{" "}
                    <span className="text-accent">processData</span>
                    <span className="text-foreground/60">(</span>
                    <span className="text-[#F78C6C]">data</span>
                    <span className="text-foreground/60">) {"{"}</span>
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground select-none">2</span>
                  <span className="text-foreground/80 pl-8">
                    <span className="text-[#C792EA]">return</span> data.<span className="text-accent">filter</span>
                    <span className="text-foreground/60">(</span>
                    <span className="text-[#F78C6C]">item</span> <span className="text-[#89DDFF]">{"=>"}</span> item
                    <span className="text-foreground/60">);</span>
                  </span>
                </div>
                <div className="flex gap-4">
                  <span className="text-muted-foreground select-none">3</span>
                  <span className="text-foreground/60">{"}"}</span>
                </div>
                <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-primary mb-1">AI Suggestion</p>
                      <p className="text-sm text-foreground/70">
                        Consider adding input validation and a more descriptive function name.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="glass p-8 hover:glow transition-all duration-300 cursor-pointer"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="glass dark:bg-gray-900/40 dark:border-gray-500/20 rounded-2xl p-12 glow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl text-primary mb-2">10k+</div>
                <div className="text-muted-foreground">Code Reviews</div>
              </div>
              <div>
                <div className="text-4xl text-accent mb-2">50+</div>
                <div className="text-muted-foreground">Languages Supported</div>
              </div>
              <div>
                <div className="text-4xl text-primary mb-2">99.9%</div>
                <div className="text-muted-foreground">Accuracy Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              <span className="text-foreground">Code Review Assistant</span>
            </div>
            <div className="flex gap-8">
              <button className="text-muted-foreground hover:text-primary transition-colors">
                About
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                Docs
              </button>
              <button className="text-muted-foreground hover:text-primary transition-colors">
                Contact
              </button>
            </div>
            <div className="flex gap-4">
              <button className="p-2 rounded-lg glass hover:bg-secondary/20 transition-colors">
                <Github className="w-5 h-5 text-muted-foreground" />
              </button>
              <button className="p-2 rounded-lg glass hover:bg-secondary/20 transition-colors">
                <Mail className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>
          </div>
          <div className="text-center mt-8 text-sm text-muted-foreground">
            © 2025 Code Review Assistant. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
