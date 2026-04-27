import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Marquee } from "@/components/Marquee";
import { ArrowRight, FileText, Github, Globe, Mail, Zap, Eye, Share2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const features = [
  { icon: FileText, title: "Resume Drop", body: "Upload a PDF. Visitors download it with one click." },
  { icon: Github, title: "Repo Sync", body: "Paste GitHub + live URLs. We render the cards." },
  { icon: Eye, title: "Live Preview", body: "Edits render instantly side-by-side. No save dance." },
  { icon: Share2, title: "Public URL", body: "Ship at devfolio.app/u/yourname. Recruiter-ready." },
  { icon: Mail, title: "Contact Form", body: "Receive messages straight to your inbox." },
  { icon: Zap, title: "Edit Anytime", body: "Iterate forever. Your portfolio is never done." },
];

const steps = [
  { n: "01", title: "Drop Your Stack", body: "Upload your resume, paste your repos, link your live demos." },
  { n: "02", title: "Watch It Compile", body: "The right-hand preview rebuilds your portfolio in real time as you type." },
  { n: "03", title: "Ship & Iterate", body: "Publish to a public URL. Edit whenever. The link never breaks." },
];

const Landing = () => {
  const { user } = useAuth();
  const ctaHref = user ? "/dashboard" : "/auth";

  return (
    <div className="min-h-dvh bg-background text-foreground flex flex-col">
      <Navbar />

      {/* HERO */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 border-b-4 border-foreground">
        {/* LEFT */}
        <section className="lg:col-span-7 lg:border-r-4 border-foreground p-8 md:p-16 flex flex-col justify-center bg-card relative overflow-hidden">
          <div className="absolute top-6 left-6 text-foreground/20 select-none">+</div>
          <div className="absolute bottom-6 right-6 text-foreground/20 select-none">+</div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-8 self-start"
          >
            <span className="size-2 bg-strike animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              v1.0 // Engine Online
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-[7.5rem] font-extrabold uppercase leading-[0.8] tracking-[-0.04em] mb-8"
          >
            Ship<br />
            Your<br />
            <span className="bg-accent text-accent-foreground px-3 inline-block">Rep.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="text-base md:text-xl font-bold leading-relaxed border-l-4 border-strike pl-6 mb-12 max-w-[42ch] text-foreground"
          >
            Drop a PDF. Paste a repo. DevFolio compiles a high-voltage portfolio that makes recruiters sweat.{" "}
            <span className="bg-accent text-accent-foreground px-1.5 inline-block">Zero templates. Zero BS.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to={ctaHref} className="btn-brutal-accent text-base md:text-lg">
              Deploy Identity <ArrowRight className="size-5" />
            </Link>
            <a href="#how-it-works" className="btn-brutal bg-card text-foreground text-base md:text-lg">
              Inspect Demos
            </a>
          </motion.div>

          <div className="mt-16 flex items-center gap-3 text-xs font-bold text-muted-foreground uppercase">
            <span className="block size-2 bg-strike" />
            System Status: Online & Aggressive
          </div>
        </section>

        {/* RIGHT — visual mock */}
        <section
          className="lg:col-span-5 relative overflow-hidden flex items-center justify-center p-8 md:p-12 bg-stripes border-t-4 lg:border-t-0 border-foreground"
        >
          <motion.div
            initial={{ opacity: 0, x: 40, rotate: 0 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="w-full max-w-md bg-card border-4 border-foreground shadow-brutal-lg relative z-10"
          >
            <div className="border-b-4 border-foreground px-3 py-2 flex justify-between items-center bg-muted">
              <div className="flex gap-2">
                <div className="size-3 border-2 border-foreground bg-card" />
                <div className="size-3 border-2 border-foreground bg-card" />
                <div className="size-3 border-2 border-foreground bg-card" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest">
                preview_<span className="animate-blink">_</span>
              </span>
            </div>

            <div className="p-6 flex flex-col gap-5">
              <div>
                <h3 className="font-display text-3xl md:text-4xl font-extrabold uppercase leading-none mb-2">
                  VAIBHAV SRIVASTAVA
                </h3>
                <p className="text-xs font-bold bg-foreground text-background inline-block px-2 py-1">
                  Software Engineer(Wanna be :) // Love making these things
                </p>
              </div>

              <div className="bg-muted border-4 border-foreground aspect-[16/9] flex items-center justify-center">
                <div className="font-mono text-[10px] text-muted-foreground">[ project_screenshot.png ]</div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs font-bold uppercase">
                <div className="border-2 border-foreground p-3">
                  <span className="block text-muted-foreground mb-1">Commits</span>
                  <span className="text-lg tabular-nums">2,841</span>
                </div>
                <div className="border-2 border-foreground p-3 bg-accent text-accent-foreground">
                  <span className="block opacity-60 mb-1">Status</span>
                  <span className="text-lg">Open</span>
                </div>
              </div>

              <div className="flex gap-2">
                <span className="text-[10px] font-bold uppercase border-2 border-foreground px-2 py-1">Rust</span>
                <span className="text-[10px] font-bold uppercase border-2 border-foreground px-2 py-1">Go</span>
                <span className="text-[10px] font-bold uppercase border-2 border-foreground px-2 py-1">WASM</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 1, scale: 1, rotate: 12 }}
            transition={{ duration: 0.5, delay: 0.7, type: "spring" }}
            className="absolute bottom-12 -right-2 z-20 bg-strike text-strike-foreground font-display text-xl md:text-2xl font-extrabold uppercase px-4 py-2 border-4 border-foreground shadow-brutal"
          >
            Live Preview
          </motion.div>

          <div className="absolute top-12 right-12 w-32 h-48 bg-accent border-4 border-foreground shadow-brutal -rotate-[15deg] z-0" />
        </section>
      </main>

      <Marquee />

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="border-b-4 border-foreground bg-background py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase mb-4">How It Compiles</h2>
          <p className="text-base md:text-lg font-bold text-muted-foreground max-w-2xl mb-16">
            Three steps from blank page to public portfolio. No drag-drop nonsense.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="bg-card border-4 border-foreground p-8 shadow-brutal hover:shadow-brutal-accent hover:-translate-y-1 transition-all"
              >
                <div className="font-display text-6xl font-extrabold text-accent mb-4 leading-none">{s.n}</div>
                <h3 className="text-2xl font-extrabold uppercase mb-3">{s.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{s.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className="border-b-4 border-foreground bg-card py-20 px-6 md:px-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between flex-wrap gap-4 mb-16">
            <h2 className="font-display text-5xl md:text-7xl font-extrabold uppercase">
              Built<br />For Devs.
            </h2>
            <p className="text-sm font-bold uppercase text-muted-foreground border-l-4 border-strike pl-4 max-w-sm">
              Every feature designed for the developer who reviews PRs at 1AM and still wants their portfolio sharp.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-4 border-foreground">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`p-8 border-foreground bg-background hover:bg-accent hover:text-accent-foreground transition-colors group
                  ${i % 3 !== 2 ? "lg:border-r-4" : ""}
                  ${i % 2 !== 1 ? "sm:border-r-4 lg:border-r-4" : "sm:border-r-0"}
                  ${i < features.length - (features.length % 3 || 3) ? "border-b-4" : ""}
                `}
              >
                <f.icon className="size-8 mb-4 group-hover:-rotate-12 transition-transform" strokeWidth={2.5} />
                <h3 className="text-xl font-extrabold uppercase mb-2">{f.title}</h3>
                <p className="text-sm font-medium text-muted-foreground group-hover:text-accent-foreground/80">
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="bg-foreground text-background py-24 px-6 md:px-10 border-b-4 border-foreground">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-display text-5xl md:text-8xl font-extrabold uppercase mb-8 leading-[0.85]">
            Your work<br />
            <span className="bg-accent text-accent-foreground px-3 inline-block">deserves</span><br />
            a stage.
          </h2>
          <p className="text-base md:text-lg font-bold mb-10 max-w-xl mx-auto opacity-80">
            Stop apologizing for that Notion page. Compile a real portfolio in 5 minutes.
          </p>
          <Link
            to={ctaHref}
            className="inline-flex items-center gap-3 bg-accent text-accent-foreground border-4 border-background px-10 py-5 font-bold text-lg uppercase shadow-[8px_8px_0_0_hsl(var(--background))] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            Start Compiling <ArrowRight className="size-5" />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-10 py-8 bg-background flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold uppercase text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="size-4 bg-accent border-2 border-foreground" />
          <span className="text-foreground">DevFolio</span>
          <span>© {new Date().getFullYear()}</span>
        </div>
        <div className="flex items-center gap-6">
          <a href="#" className="hover:text-strike transition-colors flex items-center gap-1">
            <Globe className="size-3" /> Built for shipping
          </a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
