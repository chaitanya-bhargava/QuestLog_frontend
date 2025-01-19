"use client";

import { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";

const ThemeToggleButton = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
      document.body.classList.toggle("dark", savedTheme === "dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle("dark", newTheme === "dark");
    localStorage.setItem("theme", newTheme); // Save preference
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-4 right-4 p-2 bg-gray-800 text-white rounded-full shadow-lg transition hover:bg-gray-700"
    >
      {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
    </button>
  );
};

export default ThemeToggleButton;
