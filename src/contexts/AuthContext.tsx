import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, UserSettings } from "@/types";

interface AuthContextType {
  user: User | null;
  settings: UserSettings;
  login: (email: string, password: string) => boolean;
  signup: (email: string, password: string, country: string, countryCode: string) => boolean;
  logout: () => void;
  updateSettings: (newSettings: Partial<UserSettings>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<UserSettings>({
    theme: "navy-blue",
    fontSize: "normal",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("bible-quiz-user");
    const storedSettings = localStorage.getItem("bible-quiz-settings");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedSettings) {
      const parsedSettings = JSON.parse(storedSettings);
      setSettings(parsedSettings);
      applyTheme(parsedSettings.theme);
      applyFontSize(parsedSettings.fontSize);
    }
  }, []);

  const applyTheme = (theme: string) => {
    document.documentElement.className = "";
    if (theme !== "navy-blue") {
      document.documentElement.classList.add(`theme-${theme}`);
    }
  };

  const applyFontSize = (fontSize: string) => {
    document.documentElement.classList.remove("font-size-small", "font-size-normal", "font-size-large");
    document.documentElement.classList.add(`font-size-${fontSize}`);
  };

  const login = (email: string, password: string): boolean => {
    const users = JSON.parse(localStorage.getItem("bible-quiz-users") || "[]");
    const foundUser = users.find((u: User) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("bible-quiz-user", JSON.stringify(foundUser));
      return true;
    }
    return false;
  };

  const signup = (email: string, password: string, country: string, countryCode: string): boolean => {
    const users = JSON.parse(localStorage.getItem("bible-quiz-users") || "[]");
    
    if (users.some((u: User) => u.email === email)) {
      return false;
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      password,
      country,
      countryCode,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem("bible-quiz-users", JSON.stringify(users));
    setUser(newUser);
    localStorage.setItem("bible-quiz-user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("bible-quiz-user");
  };

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    localStorage.setItem("bible-quiz-settings", JSON.stringify(updated));
    
    if (newSettings.theme) {
      applyTheme(newSettings.theme);
    }
    if (newSettings.fontSize) {
      applyFontSize(newSettings.fontSize);
    }
  };

  return (
    <AuthContext.Provider value={{ user, settings, login, signup, logout, updateSettings }}>
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