import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { toast } from "sonner";
import { ArrowRight, Loader2 } from "lucide-react";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const passwordSchema = z.string().min(6, "At least 6 characters").max(72);
const nameSchema = z.string().trim().min(1, "Name required").max(100);

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) navigate("/dashboard", { replace: true });
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const emailParsed = emailSchema.safeParse(email);
      const passwordParsed = passwordSchema.safeParse(password);
      if (!emailParsed.success) throw new Error(emailParsed.error.issues[0].message);
      if (!passwordParsed.success) throw new Error(passwordParsed.error.issues[0].message);

      if (mode === "signup") {
        const nameParsed = nameSchema.safeParse(fullName);
        if (!nameParsed.success) throw new Error(nameParsed.error.issues[0].message);

        const { error } = await supabase.auth.signUp({
          email: emailParsed.data,
          password: passwordParsed.data,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: nameParsed.data },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to DevFolio.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: emailParsed.data,
          password: passwordParsed.data,
        });
        if (error) throw error;
        toast.success("Signed in.");
      }
    } catch (err: any) {
      toast.error(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center p-6 md:p-10 bg-stripes">
        <div className="w-full max-w-md bg-card border-4 border-foreground shadow-brutal-lg p-8">
          <div className="border-b-4 border-foreground pb-4 mb-6 flex items-center justify-between">
            <h1 className="font-display text-3xl font-extrabold uppercase">
              {mode === "signin" ? "Sign In" : "Initialize"}
            </h1>
            <span className="size-3 bg-strike animate-pulse" />
          </div>

          <div className="flex border-4 border-foreground mb-6">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                mode === "signin" ? "bg-foreground text-background" : "bg-card"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 text-xs font-bold uppercase transition-colors ${
                mode === "signup" ? "bg-foreground text-background" : "bg-card"
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-bold uppercase block mb-2">Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  maxLength={100}
                  className="w-full border-4 border-foreground bg-background px-4 py-3 font-mono focus:outline-none focus:bg-accent/20"
                  placeholder="Ada Lovelace"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-bold uppercase block mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                maxLength={255}
                className="w-full border-4 border-foreground bg-background px-4 py-3 font-mono focus:outline-none focus:bg-accent/20"
                placeholder="ada@devfolio.app"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase block mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                maxLength={72}
                className="w-full border-4 border-foreground bg-background px-4 py-3 font-mono focus:outline-none focus:bg-accent/20"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-brutal-accent justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <>
                  {mode === "signin" ? "Sign In" : "Create Account"} <ArrowRight className="size-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-xs font-bold uppercase text-muted-foreground text-center">
            <Link to="/" className="hover:text-strike">← Back to home</Link>
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
