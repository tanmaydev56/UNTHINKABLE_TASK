"use client";

import { Code2, Menu, X, BookOpen } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { NavbarProps } from "@/lib/types";



export default function Navbar({ onNavigate }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { id: "upload", label: "Upload" },
    { id: "dashboard", label: "Dashboard" },
    { id: "settings", label: "Settings" },
  ];

  const handleNavClick = (page: string) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-[#0f172a]/50 backdrop-blur-lg border border-[#1e293b]/30 rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <button
            onClick={() => handleNavClick("/")}
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
          <div className="hidden md:flex items-center gap-2">
            {/* Regular Navigation Items */}
            <div className="flex items-center gap-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 rounded-lg transition-all text-muted-foreground hover:text-foreground hover:bg-secondary/50`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Separator */}
            <div className="h-6 w-px bg-border mx-2"></div>

            {/* Code Understand Feature Button - Styled Differently */}
            {/* <Button
              onClick={() => handleNavClick("code-understand")}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <BookOpen className="w-4 h-4" />
              Understand Code
            </Button> */}
          </div>

          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-[#1e293b]/30 mt-2 pb-4">
            <div className="flex flex-col space-y-2 pt-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className="px-4 py-3 rounded-lg text-left text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all"
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Code Understand Button - Also Styled Differently */}
              {/* <Button
                onClick={() => handleNavClick("code-understand")}
                className="flex items-center gap-2 justify-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
              >
                <BookOpen className="w-4 h-4" />
                Understand Code
              </Button> */}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}