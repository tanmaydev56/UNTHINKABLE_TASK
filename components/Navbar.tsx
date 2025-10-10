"use client";

import { Code2, Menu } from "lucide-react";
import { Button } from "./ui/button";

interface NavbarProps {

  onNavigate: (page: string) => void;
}

export default function Navbar({  onNavigate }: NavbarProps) {
  const navItems = [
    { id: "upload", label: "Upload" },
    {id: "dashboard", label: "Dashboard" },
    { id: "settings", label: "Settings" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50  border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => onNavigate("home")}
            className="flex items-center gap-2 group"
          >
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Code2 className="w-6 h-6 text-primary" />
            </div>
            <span className="text-foreground hidden sm:block">
              Code Review Assistant
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                
                     "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Mobile menu button */}
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
