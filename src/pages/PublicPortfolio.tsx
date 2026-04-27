import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { PortfolioView } from "@/components/PortfolioView";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Loader2, X, Send, Mail } from "lucide-react";
import { toast } from "sonner";
import type { PortfolioData } from "@/types/portfolio";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  message: z.string().trim().min(5).max(1000),
});

const PublicPortfolio = () => {
  const { username } = useParams();
  const [data, setData] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    if (!username) return;
    (async () => {
      setLoading(true);
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", username.toLowerCase())
        .maybeSingle();
      if (!profile) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      const { data: projects } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", profile.id)
        .order("display_order");
      setData({ profile, projects: projects || [] });
      setLoading(false);
    })();
  }, [username]);

  const handleContact = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = contactSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSending(true);
    // Open mail client with prefilled body. (For real delivery, swap to EmailJS / Edge Function.)
    const subject = encodeURIComponent(`DevFolio: message from ${parsed.data.name}`);
    const body = encodeURIComponent(`${parsed.data.message}\n\n— ${parsed.data.name} (${parsed.data.email})`);
    // mailto fallback only — keeps the demo zero-config
    setTimeout(() => {
      setSending(false);
      toast.success("Message ready — opening your email client");
      window.location.href = `mailto:?subject=${subject}&body=${body}`;
      setContactOpen(false);
      setForm({ name: "", email: "", message: "" });
    }, 400);
  };

  if (loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="min-h-dvh flex flex-col items-center justify-center bg-background p-6 text-center">
        <h1 className="font-display text-6xl md:text-8xl font-extrabold uppercase mb-4">404</h1>
        <p className="text-sm font-bold uppercase text-muted-foreground mb-8">No portfolio at /u/{username}</p>
        <Link to="/" className="btn-brutal-accent">
          Build your own
        </Link>
      </div>
    );
  }

  const title = `${data.profile.full_name || username} — DevFolio`;
  const description = data.profile.headline || data.profile.bio?.slice(0, 160) || `${data.profile.full_name}'s developer portfolio.`;

  return (
    <div className="min-h-dvh bg-background">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description.slice(0, 160)} />
        <link rel="canonical" href={`/u/${username}`} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description.slice(0, 160)} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: data.profile.full_name,
            description: data.profile.bio,
            jobTitle: data.profile.headline,
            url: typeof window !== "undefined" ? window.location.href : undefined,
            image: data.profile.avatar_url || undefined,
            sameAs: [data.profile.github_url, data.profile.linkedin_url, data.profile.twitter_url, data.profile.website_url].filter(Boolean),
          })}
        </script>
      </Helmet>

      <header className="px-6 md:px-10 py-5 border-b-4 border-foreground bg-background flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-3">
          <div className="size-6 bg-accent border-2 border-foreground" />
          <span className="font-display text-xl font-extrabold uppercase">DevFolio</span>
        </Link>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link to="/auth" className="hidden md:inline-block text-xs font-bold uppercase border-2 border-foreground px-3 py-2 hover:bg-foreground hover:text-background">
            Build yours
          </Link>
        </div>
      </header>

      <main className="p-4 md:p-10 max-w-4xl mx-auto">
        <PortfolioView data={data} onContact={() => setContactOpen(true)} />
        <p className="mt-8 text-center text-xs font-bold uppercase text-muted-foreground">
          Built with{" "}
          <Link to="/" className="text-foreground underline decoration-strike">
            DevFolio
          </Link>
        </p>
      </main>

      <AnimatePresence>
        {contactOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setContactOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-card border-4 border-foreground shadow-brutal-lg p-6"
            >
              <div className="flex items-center justify-between mb-6 pb-3 border-b-4 border-foreground">
                <h2 className="font-display text-2xl font-extrabold uppercase flex items-center gap-2">
                  <Mail className="size-5" /> Contact
                </h2>
                <button onClick={() => setContactOpen(false)} className="border-2 border-foreground p-1 hover:bg-strike hover:text-strike-foreground">
                  <X className="size-4" />
                </button>
              </div>
              <form onSubmit={handleContact} className="space-y-4">
                <input
                  required
                  maxLength={100}
                  className="w-full border-4 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-accent/20"
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                  required
                  type="email"
                  maxLength={255}
                  className="w-full border-4 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-accent/20"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <textarea
                  required
                  minLength={5}
                  maxLength={1000}
                  className="w-full border-4 border-foreground bg-background px-3 py-2 font-mono text-sm min-h-32 resize-y focus:outline-none focus:bg-accent/20"
                  placeholder="Your message..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
                <button type="submit" disabled={sending} className="w-full btn-brutal-accent justify-center disabled:opacity-50">
                  {sending ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  Send Message
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PublicPortfolio;
