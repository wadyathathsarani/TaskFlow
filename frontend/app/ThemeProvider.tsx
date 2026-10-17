"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

type ThemeContextType = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [resolvedTheme, setResolvedTheme] =
    useState<"light" | "dark">("light");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("taskflow-theme");

    if (
      saved === "light" ||
      saved === "dark" ||
      saved === "system"
    ) {
      setThemeState(saved);
    }

    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    const media = window.matchMedia(
      "(prefers-color-scheme: dark)"
    );

    const applyTheme = () => {
      const next: "light" | "dark" =
        theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : theme;

      setResolvedTheme(next);

      document.documentElement.classList.toggle(
        "dark",
        next === "dark"
      );

      document.documentElement.dataset.theme = next;
      document.documentElement.style.colorScheme = next;
    };

    applyTheme();

    if (theme === "system") {
      media.addEventListener("change", applyTheme);
    }

    return () => {
      media.removeEventListener("change", applyTheme);
    };
  }, [theme, ready]);

  const setTheme = (next: Theme) => {
    localStorage.setItem("taskflow-theme", next);
    setThemeState(next);
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, resolvedTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}