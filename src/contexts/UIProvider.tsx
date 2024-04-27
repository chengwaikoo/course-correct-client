import { useEffect, useMemo, useState, ReactNode } from "react";

import UIContext, { Theme } from "./UIContext";

interface UIProviderProps {
  children: ReactNode;
}

export default function UIProvider({ children }: UIProviderProps) {
  const [loading, setLoading] = useState(false);
  const [errored, setErrored] = useState(false);
  const [showBottomBar, setShowBottomBar] = useState(false);

  const themeKey = "vite-ui-theme";
  const [theme, setTheme] = useState(
    () => (localStorage.getItem(themeKey) as Theme) || "light",
  );

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");
    root.classList.add(theme);
  }, [theme]);

  const value = useMemo(() => {
    return {
      loading,
      setLoading,
      errored,
      setErrored,
      showBottomBar,
      setShowBottomBar,
      theme,
      setTheme: (theme: Theme) => {
        localStorage.setItem(themeKey, theme);
        setTheme(theme);
      },
    };
  }, [loading, errored, showBottomBar, theme]);

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
