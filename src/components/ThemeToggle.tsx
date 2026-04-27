import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="flex items-center border-4 border-foreground bg-background"
    >
      <span
        className={`px-3 py-2 flex items-center gap-1 text-xs font-bold uppercase transition-colors ${
          theme === "light" ? "bg-foreground text-background" : "text-foreground"
        }`}
      >
        <Sun className="size-3" /> LT
      </span>
      <span
        className={`px-3 py-2 flex items-center gap-1 text-xs font-bold uppercase transition-colors ${
          theme === "dark" ? "bg-foreground text-background" : "text-foreground"
        }`}
      >
        <Moon className="size-3" /> DK
      </span>
    </button>
  );
};
