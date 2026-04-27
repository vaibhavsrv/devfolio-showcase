import { Github, Globe, Linkedin, Twitter, Mail, MapPin, FileText, ExternalLink } from "lucide-react";
import type { PortfolioData } from "@/types/portfolio";
import { motion } from "framer-motion";

interface Props {
  data: PortfolioData;
  onContact?: () => void;
  compact?: boolean;
}

export const PortfolioView = ({ data, onContact, compact = false }: Props) => {
  const { profile, projects } = data;
  const initials = (profile.full_name || "??")
    .split(" ")
    .map((s) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const padding = compact ? "p-5" : "p-8 md:p-12";
  const headingSize = compact ? "text-3xl" : "text-5xl md:text-7xl";

  return (
    <div className="bg-card text-card-foreground border-4 border-foreground">
      {/* mock window header */}
      <div className="border-b-4 border-foreground px-4 py-2 flex justify-between items-center bg-muted">
        <div className="flex gap-2">
          <div className="size-3 border-2 border-foreground bg-card" />
          <div className="size-3 border-2 border-foreground bg-card" />
          <div className="size-3 border-2 border-foreground bg-card" />
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest truncate max-w-[60%]">
          {profile.username ? `devfolio.app/u/${profile.username}` : "preview // unpublished"}
        </span>
      </div>

      <div className={padding}>
        {/* HEADER */}
        <header className="flex flex-col md:flex-row gap-6 md:items-end justify-between mb-10 pb-8 border-b-4 border-foreground">
          <div className="flex items-center gap-4">
            <div className={`${compact ? "size-14" : "size-20"} border-4 border-foreground bg-accent text-accent-foreground flex items-center justify-center font-display font-extrabold text-2xl shrink-0 overflow-hidden`}>
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt={profile.full_name || ""} className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div>
              <h1 className={`font-display ${headingSize} font-extrabold uppercase leading-[0.85] mb-2`}>
                {profile.full_name || "Your Name"}
              </h1>
              {profile.headline && (
                <p className="text-xs md:text-sm font-bold bg-foreground text-background inline-block px-2 py-1 uppercase">
                  {profile.headline}
                </p>
              )}
            </div>
          </div>

          {profile.location && (
            <div className="text-xs font-bold uppercase text-muted-foreground flex items-center gap-1">
              <MapPin className="size-3" /> {profile.location}
            </div>
          )}
        </header>

        {/* BIO */}
        {profile.bio && (
          <section className="mb-10">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-3">
              About <span className="h-px bg-foreground flex-1" />
            </h2>
            <p className={`${compact ? "text-sm" : "text-base md:text-lg"} font-medium leading-relaxed border-l-4 border-strike pl-4 max-w-3xl`}>
              {profile.bio}
            </p>
          </section>
        )}

        {/* LINKS / RESUME */}
        <section className="mb-10 flex flex-wrap gap-3">
          {profile.resume_url && (
            <a
              href={profile.resume_url}
              target="_blank"
              rel="noreferrer"
              className="bg-accent text-accent-foreground border-4 border-foreground px-4 py-2 font-bold text-xs uppercase shadow-brutal hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex items-center gap-2"
            >
              <FileText className="size-4" /> Download Resume
            </a>
          )}
          {profile.github_url && (
            <a
              href={profile.github_url}
              target="_blank"
              rel="noreferrer"
              className="border-4 border-foreground bg-card px-4 py-2 font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
            >
              <Github className="size-4" /> GitHub
            </a>
          )}
          {profile.linkedin_url && (
            <a
              href={profile.linkedin_url}
              target="_blank"
              rel="noreferrer"
              className="border-4 border-foreground bg-card px-4 py-2 font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
            >
              <Linkedin className="size-4" /> LinkedIn
            </a>
          )}
          {profile.twitter_url && (
            <a
              href={profile.twitter_url}
              target="_blank"
              rel="noreferrer"
              className="border-4 border-foreground bg-card px-4 py-2 font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
            >
              <Twitter className="size-4" /> Twitter
            </a>
          )}
          {profile.website_url && (
            <a
              href={profile.website_url}
              target="_blank"
              rel="noreferrer"
              className="border-4 border-foreground bg-card px-4 py-2 font-bold text-xs uppercase hover:bg-foreground hover:text-background transition-colors flex items-center gap-2"
            >
              <Globe className="size-4" /> Website
            </a>
          )}
        </section>

        {/* PROJECTS */}
        <section className="mb-10">
          <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-6 flex items-center gap-3">
            Selected Projects <span className="h-px bg-foreground flex-1" />
            <span className="tabular-nums">{String(projects.length).padStart(2, "0")}</span>
          </h2>

          {projects.length === 0 ? (
            <div className="border-4 border-dashed border-foreground/40 p-10 text-center text-sm font-bold uppercase text-muted-foreground">
              No projects yet — add your first one
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="border-4 border-foreground bg-background p-5 hover:shadow-brutal-accent transition-shadow"
                >
                  {p.image_url && (
                    <div className="border-2 border-foreground mb-4 overflow-hidden bg-muted">
                      <img src={p.image_url} alt={p.title} className="w-full aspect-[16/9] object-cover" />
                    </div>
                  )}
                  <h3 className="text-xl font-extrabold uppercase mb-2 leading-tight">{p.title}</h3>
                  {p.description && (
                    <p className="text-sm text-muted-foreground font-medium mb-4 leading-relaxed">{p.description}</p>
                  )}
                  {p.tech_stack && p.tech_stack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {p.tech_stack.map((t) => (
                        <span key={t} className="text-[10px] font-bold uppercase border-2 border-foreground px-1.5 py-0.5">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    {p.github_url && (
                      <a
                        href={p.github_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold uppercase border-2 border-foreground px-2 py-1 hover:bg-foreground hover:text-background flex items-center gap-1"
                      >
                        <Github className="size-3" /> Code
                      </a>
                    )}
                    {p.live_url && (
                      <a
                        href={p.live_url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-bold uppercase bg-foreground text-background px-2 py-1 hover:bg-accent hover:text-accent-foreground flex items-center gap-1"
                      >
                        <ExternalLink className="size-3" /> Live
                      </a>
                    )}
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* CONTACT */}
        {onContact && (
          <section className="border-t-4 border-foreground pt-8">
            <h2 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-3">
              Get In Touch <span className="h-px bg-foreground flex-1" />
            </h2>
            <button onClick={onContact} className="btn-brutal-accent">
              <Mail className="size-4" /> Contact Me
            </button>
          </section>
        )}
      </div>
    </div>
  );
};
