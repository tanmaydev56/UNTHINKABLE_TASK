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

          {/* API Key Management */}
          <Card className="glass  p-6 border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <Key className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-foreground">API Key Management</h3>
                <p className="text-sm text-muted-foreground">
                  Configure your API access credentials
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="api-key" className="text-foreground mb-2">
                  API Key
                </Label>
                <div className="flex gap-2 mt-2">
                  <div className="relative flex-1">
                    <Input
                      id="api-key"
                      type={showApiKey ? "text" : "password"}
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="glass pr-10"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showApiKey ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    className="glass dark:bg-gray-900/40 dark:border-gray-500/20 border-border/50"
                    onClick={handleCopyApiKey}
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-accent" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Keep your API key secure. Do not share it publicly.
                </p>
              </div>

              <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
                <p className="text-sm text-foreground mb-2">Usage Information</p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Requests this month:</span>
                    <p className="text-foreground">247 / 1,000</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Plan:</span>
                    <p className="text-foreground">Pro Plan</p>
                  </div>
                </div>
              </div>

              <Button className="w-full glass border-border/50" variant="outline">
                Generate New API Key
              </Button>
            </div>
          </Card>

          {/* Profile Settings */}
          <Card className="glass p-6 border-border/50">
            <div className="flex items-center gap-3 mb-6">
              <User className="w-5 h-5 text-primary" />
              <div>
                <h3 className="text-foreground">Profile Settings</h3>
                <p className="text-sm text-muted-foreground">
                  Update your personal information
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-foreground mb-2">
                  Full Name
                </Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    defaultValue="Alex Developer"
                    className="glass mt-2"
                  />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground mb-2">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  defaultValue="alex@example.com"
                  className="glass  mt-2"
                />
              </div>

              <div>
                <Label htmlFor="username" className="text-foreground mb-2">
                  Username
                </Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="username"
                  defaultValue="alexdev"
                  className="glass mt-2"
                />
              </div>

              <Separator className="my-4" />

              <Button className="glow">Save Changes</Button>
            </div>
          </Card>

          {/* Danger Zone */}
          <Card className="glass p-6 border-destructive/30">
            <div className="flex items-center gap-3 mb-6">
              <LogOut className="w-5 h-5 text-destructive" />
              <div>
                <h3 className="text-foreground">Account Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Manage your account status
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full glass border-destructive/50 hover:bg-destructive/10 text-destructive"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Log Out
              </Button>
              
              <Button
                variant="outline"
                className="w-full glass border-destructive/50 hover:bg-destructive/10 text-destructive"
              >
                Delete Account
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
