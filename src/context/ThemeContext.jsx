import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );

  const [accent, setAccent] = useState(
    localStorage.getItem("accent") || "#6366f1"
  );

  const [font, setFont] = useState(
    localStorage.getItem("font") || "Inter"
  );

  const [gradient, setGradient] = useState(
    localStorage.getItem("gradient") || "default"
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.setProperty("--accent", accent);
    document.documentElement.style.setProperty("--font", font);
    document.body.setAttribute("data-gradient", gradient);
    localStorage.setItem("theme", theme);
    localStorage.setItem("accent", accent);
    localStorage.setItem("font", font);
    localStorage.setItem("gradient", gradient);
  }, [theme, accent, font, gradient]);

  return (
    <ThemeContext.Provider value={{
      theme, setTheme,
      accent, setAccent,
      font, setFont,
      gradient, setGradient
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
