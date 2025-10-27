import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface ThemeContextType {
  theme: "light" | "dark" | "auto";
  accentColor: string;
  setTheme: (theme: "light" | "dark" | "auto") => void;
  setAccentColor: (color: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Color definitions for each accent
const ACCENT_COLORS = {
  blue: {
    primary: "220 90% 56%",
    primaryForeground: "210 40% 98%",
    ring: "220 90% 56%",
  },
  pink: {
    primary: "330 81% 60%",
    primaryForeground: "210 40% 98%",
    ring: "330 81% 60%",
  },
  green: {
    primary: "142 76% 36%",
    primaryForeground: "210 40% 98%",
    ring: "142 76% 36%",
  },
  purple: {
    primary: "262 83% 58%",
    primaryForeground: "210 40% 98%",
    ring: "262 83% 58%",
  },
  orange: {
    primary: "25 95% 53%",
    primaryForeground: "210 40% 98%",
    ring: "25 95% 53%",
  },
};

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [theme, setThemeState] = useState<"light" | "dark" | "auto">("light");
  const [accentColor, setAccentColorState] = useState<string>("blue");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadUserTheme();
  }, [user]);

  const loadUserTheme = async () => {
    if (!user) {
      // Not logged in - use default theme
      applyTheme("light", "blue");
      return;
    }

    try {
      const { data } = await supabase
        .from("user_preferences")
        .select("theme, accent_color")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data) {
        const userTheme = data.theme || "light";
        const userAccent = data.accent_color || "blue";
        setThemeState(userTheme);
        setAccentColorState(userAccent);
        applyTheme(userTheme, userAccent);
      } else {
        applyTheme("light", "blue");
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      applyTheme("light", "blue");
    }
  };

  const applyTheme = (
    newTheme: "light" | "dark" | "auto",
    newAccent: string
  ) => {
    const root = document.documentElement;

    // Apply theme (light/dark)
    if (newTheme === "auto") {
      const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", isDark);
    } else {
      root.classList.toggle("dark", newTheme === "dark");
    }

    // Apply accent color
    const colors =
      ACCENT_COLORS[newAccent as keyof typeof ACCENT_COLORS] ||
      ACCENT_COLORS.blue;
    root.style.setProperty("--primary", colors.primary);
    root.style.setProperty("--primary-foreground", colors.primaryForeground);
    root.style.setProperty("--ring", colors.ring);
  };

  const setTheme = (newTheme: "light" | "dark" | "auto") => {
    setThemeState(newTheme);
    applyTheme(newTheme, accentColor);
  };

  const setAccentColor = (newColor: string) => {
    setAccentColorState(newColor);
    applyTheme(theme, newColor);
  };

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handler = () => applyTheme("auto", accentColor);
      mediaQuery.addEventListener("change", handler);
      return () => mediaQuery.removeEventListener("change", handler);
    }
  }, [theme, accentColor]);

  if (!mounted) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{ theme, accentColor, setTheme, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
