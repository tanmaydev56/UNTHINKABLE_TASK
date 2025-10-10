"use client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, FileCode, Github, Mail, Shield, Sparkles, Zap } from "lucide-react";
import Image from "next/image";
import { easeIn, motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { useRouter } from "next/navigation";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      duration:0.6,
      ease: "easeOut",
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};



const scaleVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

const floatVariants = {
  floating: {
    y: [-10, 10],
    transition: {
      y: {
        repeat: Infinity,
        repeatType: "reverse",
        duration: 3,
        ease: "easeInOut"
      }
    }
  }
};


const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const textReveal = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut"
    }
  }
};

export default function Home() {
  const featuresRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-100px" });
  const router = useRouter();
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true });
  const funClick = () =>{
  router.push('/upload');
}
 const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Analysis",
    description: "Advanced AI algorithms analyze your code for best", // 56
  },
  {
    icon: Shield,
    title: "Security Focused",
    description: "Detect vulnerabilities and security issues quickly", // 56
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get comprehensive code reviews in seconds, not hours", // 56
  },
];

  return (
    <div className="min-h-screen animated-gradient">
      {/* Hero Section */}
      <div className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            {/* Badge */}
            <motion.div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 glow"
              variants={itemVariants}
             
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground">Powered by Advanced AI</span>
            </motion.div>

            {/* Title */}
            <motion.h1 
              className="text-5xl md:text-7xl text-foreground mb-6 tracking-tight"
              variants={textReveal}
            >
              AI Code Review
              <br />
              <motion.span 
                className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                initial={{ backgroundPosition: "200% center" }}
                animate={{ backgroundPosition: "-200% center" }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% auto"
                }}
              >
                Assistant
              </motion.span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p 
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
              variants={itemVariants}
            >
              Upload. Analyze. Improve your code instantly.
              <br />
              Get intelligent suggestions to write better, cleaner code.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-wrap gap-4 justify-center"
              variants={itemVariants}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="glow group px-8 py-6 bg-primary hover:bg-primary/90"
                  onClick={funClick}
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="px-8 py-6 glass hover:bg-secondary/20"
                >
                  View Documentation
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Code Preview Mockup */}
          <motion.div 
            className="mt-20 relative"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div 
              className="glass dark:bg-gray-900/40 dark:border-gray-500/20 rounded-2xl p-8 max-w-4xl mx-auto glow"
              whileHover={{ 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
              variants={floatVariants}
              animate="floating"
            >
              <div className="flex items-center gap-2 mb-4">
                <motion.div 
                  className="w-3 h-3 rounded-full bg-destructive"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
                <motion.div 
                  className="w-3 h-3 rounded-full bg-[#F59E0B]"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
                <motion.div 
                  className="w-3 h-3 rounded-full bg-accent"
                  whileHover={{ scale: 1.2 }}
                ></motion.div>
              </div>
              <div className="space-y-3 font-mono text-sm">
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <span className="text-muted-foreground select-none">1</span>
                  <span className="text-foreground/80">
                    <span className="text-[#C792EA]">function</span>{" "}
                    <span className="text-accent">processData</span>
                    <span className="text-foreground/60">(</span>
                    <span className="text-[#F78C6C]">data</span>
                    <span className="text-foreground/60">) {"{"}</span>
                  </span>
                </motion.div>
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  <span className="text-muted-foreground select-none">2</span>
                  <span className="text-foreground/80 pl-8">
                    <span className="text-[#C792EA]">return</span> data.<span className="text-accent">filter</span>
                    <span className="text-foreground/60">(</span>
                    <span className="text-[#F78C6C]">item</span> <span className="text-[#89DDFF]">{"=>"}</span> item
                    <span className="text-foreground/60">);</span>
                  </span>
                </motion.div>
                <motion.div 
                  className="flex gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <span className="text-muted-foreground select-none">3</span>
                  <span className="text-foreground/60">{"}"}</span>
                </motion.div>
                <motion.div 
                  className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-start gap-3">
                    <motion.div
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 5
                      }}
                    >
                      <Sparkles className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    </motion.div>
                    <div>
                      <p className="text-sm text-primary mb-1">AI Suggestion</p>
                      <p className="text-sm text-foreground/70">
                        Consider adding input validation and a more descriptive function name.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Floating Elements */}
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            ></motion.div>
            <motion.div 
              className="absolute -bottom-10 -right-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl"
              animate={{
                scale: [1.2, 1, 1.2],
                opacity: [0.5, 0.3, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 2
              }}
            ></motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div ref={featuresRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={staggerContainer}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={scaleVariants}
                whileHover={{ 
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="glass p-8 hover:glow transition-all duration-300 cursor-pointer">
                  <motion.div 
                    className="p-3 rounded-lg bg-primary/10 w-fit mb-4"
                    whileHover={{ 
                      scale: 1.1,
                      rotate: 5
                    }}
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-foreground mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div ref={statsRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="glass dark:bg-gray-900/40 dark:border-gray-500/20 rounded-2xl p-12 glow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={statsInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
          >
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={statsInView ? "visible" : "hidden"}
            >
              {[
                { value: "10k+", label: "Code Reviews" },
                { value: "50+", label: "Languages Supported" },
                { value: "99.9%", label: "Accuracy Rate" }
              ].map((stat, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <motion.div 
                    className="text-4xl text-primary mb-2"
                    initial={{ scale: 0 }}
                    animate={statsInView ? { scale: 1 } : { scale: 0 }}
                    transition={{ 
                      delay: index * 0.2 + 0.3,
                      type: "spring",
                      stiffness: 100
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center gap-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-primary" />
              <span className="text-foreground">Code Review Assistant</span>
            </div>
            <div className="flex gap-8">
              {["About", "Docs", "Contact"].map((item, index) => (
                <motion.button 
                  key={item}
                  className="text-muted-foreground hover:text-primary transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {item}
                </motion.button>
              ))}
            </div>
            <div className="flex gap-4">
              {[Github, Mail].map((Icon, index) => (
                <motion.button 
                  key={index}
                  className="p-2 rounded-lg glass hover:bg-secondary/20 transition-colors"
                  whileHover={{ 
                    scale: 1.1,
                    rotate: 5
                  }}
                  whileTap={{ scale: 0.9 }}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.3 }}
                  viewport={{ once: true }}
                >
                  <Icon className="w-5 h-5 text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </motion.div>
          <motion.div 
            className="text-center mt-8 text-sm text-muted-foreground"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
          >
            © 2025 Code Review Assistant. All rights reserved.
          </motion.div>
        </div>
      </footer>
    </div>
  );
}