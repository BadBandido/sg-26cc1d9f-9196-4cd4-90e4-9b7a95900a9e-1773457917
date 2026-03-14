import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserSettings, FontSize, ThemeColor } from "@/types";

interface AuthContextType {
  user: User | null;
  settings: UserSettings;
  login: (email: string, password: string, country: string, countryCode: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  updateSettings: (settings: Partial<UserSettings>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    userId: "",
    theme: "navy-blue",
    fontSize: "normal",
  });

  useEffect(() => {
    const savedUser = localStorage.getItem("bible-quiz-user");
    const savedSettings = localStorage.getItem("bible-quiz-settings");
    
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  useEffect(() => {
    const themeClass = `theme-${settings.theme}`;
    document.documentElement.className = themeClass;
    
    document.body.className = `font-size-${settings.fontSize}`;
  }, [settings.theme, settings.fontSize]);

  const login = async (email: string, password: string, country: string, countryCode: string) => {
    const newUser: User = {
      id: Date.now().toString(),
      email,
      country,
      countryCode,
      createdAt: new Date().toISOString(),
      isAdmin: email === "admin@biblebowl.com",
    };

    setUser(newUser);
    setSettings(prev => ({ ...prev, userId: newUser.id }));
    
    localStorage.setItem("bible-quiz-user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bible-quiz-user");
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("bible-quiz-settings", JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        settings,
        login,
        logout,
        isAuthenticated: !!user,
        updateSettings,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}