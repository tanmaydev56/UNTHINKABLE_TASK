"use client";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Moon, Sun, Key, User, LogOut, Eye, EyeOff, Copy, Check } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "next-themes";


interface SettingsPageProps {
  onNavigate: (page: string) => void;
}

export default function SettingsPage({ onNavigate }: SettingsPageProps) {
  
  
  const [apiKey, setApiKey] = useState("sk-1234567890abcdefghijklmnop");
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
const { theme, setTheme, systemTheme } = useTheme(); 
  const [mounted, setMounted] = useState(false);

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  
const toggleDarkMode = (checked: boolean) => {
  setTheme(checked ? 'dark' : 'light');
};
 useEffect(() => setMounted(true), []);
  const current = theme === 'system' ? systemTheme : theme;
  const isDark = current === 'dark';
    if (!mounted) return null; 

  return (
    <div className="min-h-screen  pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account preferences and API configuration
          </p>
        </div>

        <div className="space-y-6">
          {/* Appearance */}
          <Card className="glass  p-6 border-border/50">
            <div className="flex items-center gap-3 mb-6">
              {isDark ? (
                <Moon className="w-5 h-5 text-primary" />
              ) : (
                <Sun className="w-5 h-5 text-primary" />
              )}
              <div>
                <h3 className="text-foreground">Appearance</h3>
                <p className="text-sm text-muted-foreground">
                  Customize your interface theme
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30">
                <div>
                  <Label htmlFor="dark-mode" className="text-foreground">
                    Dark Mode
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Use dark theme for better visibility
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={isDark}            // use the mounted-safe boolean
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/20 border border-border/30 opacity-50">
                <div>
                  <Label className="text-foreground">Auto Theme</Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Match system preferences
                  </p>
                </div>
                <Switch disabled />
              </div>
            </div>
          </Card>

      

         

         
        </div>
      </div>
    </div>
  );
}
