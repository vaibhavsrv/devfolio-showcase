import { Link, useNavigate } from "react-router-dom";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";
import { LogOut } from "lucide-react";

export const Navbar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10 py-5 border-b-4 border-foreground bg-background">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="size-7 bg-accent border-2 border-foreground transition-transform group-hover:rotate-12" />
        <span className="font-display text-2xl md:text-3xl font-extrabold uppercase tracking-tighter leading-none">
          DevFolio
        </span>
      </Link>

      <div className="flex items-center gap-3 md:gap-6">
        <ThemeToggle />
        {user ? (
          <>
            <Link
              to="/dashboard"
              className="hidden md:inline-block text-sm font-bold uppercase hover:text-strike transition-colors"
            >
              Dashboard
            </Link>
            <button
              onClick={handleSignOut}
              className="bg-foreground text-background px-4 md:px-6 py-3 border-4 border-foreground shadow-brutal-accent hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all flex items-center gap-2 font-bold text-xs md:text-sm uppercase"
            >
              <LogOut className="size-4" />
              <span className="hidden md:inline">Sign Out</span>
            </button>
          </>
        ) : (
          <>
            <Link
              to="/auth"
              className="hidden md:inline-block text-sm font-bold uppercase hover:text-strike transition-colors"
            >
              Sign In
            </Link>
            <Link
              to="/auth"
              className="bg-foreground text-background px-4 md:px-6 py-3 border-4 border-foreground shadow-brutal-accent hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all font-bold text-xs md:text-sm uppercase"
            >
              Initialize →
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};
