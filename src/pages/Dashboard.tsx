import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { PortfolioView } from "@/components/PortfolioView";
import { toast } from "sonner";
import { Loader2, Plus, Trash2, Save, Upload, ExternalLink, GripVertical, Eye } from "lucide-react";
import type { Profile, Project } from "@/types/portfolio";

const profileSchema = z.object({
  username: z
    .string()
    .trim()
    .toLowerCase()
    .min(3, "At least 3 characters")
    .max(30, "Max 30 characters")
    .regex(/^[a-z0-9_-]+$/, "Lowercase letters, numbers, _ and - only"),
  full_name: z.string().trim().min(1).max(100),
  headline: z.string().trim().max(120).optional().or(z.literal("")),
  bio: z.string().trim().max(600).optional().or(z.literal("")),
  location: z.string().trim().max(100).optional().or(z.literal("")),
  github_url: z.string().trim().url().max(255).optional().or(z.literal("")),
  linkedin_url: z.string().trim().url().max(255).optional().or(z.literal("")),
  twitter_url: z.string().trim().url().max(255).optional().or(z.literal("")),
  website_url: z.string().trim().url().max(255).optional().or(z.literal("")),
});

const Field = ({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) => (
  <div>
    <label className="text-[11px] font-bold uppercase block mb-1.5 tracking-wider">
      {label} {hint && <span className="text-muted-foreground normal-case font-medium">— {hint}</span>}
    </label>
    {children}
  </div>
);

const inputCls =
  "w-full border-4 border-foreground bg-background px-3 py-2 font-mono text-sm focus:outline-none focus:bg-accent/20 transition-colors";

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [previewMode, setPreviewMode] = useState<"split" | "preview">("split");
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth", { replace: true });
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      setLoading(true);
      const [{ data: prof }, { data: projs }] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
        supabase.from("projects").select("*").eq("user_id", user.id).order("display_order"),
      ]);
      setProfile(prof);
      setProjects(projs || []);
      setLoading(false);
    })();
  }, [user]);

  const updateProfile = (patch: Partial<Profile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
  };

  const updateProject = (id: string, patch: Partial<Project>) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, ...patch } : p)));
  };

  const addProject = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("projects")
      .insert({
        user_id: user.id,
        title: "New Project",
        description: "",
        display_order: projects.length,
      })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setProjects((ps) => [...ps, data]);
  };

  const removeProject = async (id: string) => {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setProjects((ps) => ps.filter((p) => p.id !== id));
    toast.success("Project removed");
  };

  const handleResumeUpload = async (file: File) => {
    if (!user) return;
    if (file.type !== "application/pdf") return toast.error("PDF only");
    if (file.size > 5 * 1024 * 1024) return toast.error("Max 5 MB");

    const path = `${user.id}/resume.pdf`;
    const { error: upErr } = await supabase.storage
      .from("resumes")
      .upload(path, file, { upsert: true, contentType: "application/pdf" });
    if (upErr) return toast.error(upErr.message);
    const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(path);
    updateProfile({ resume_url: `${urlData.publicUrl}?t=${Date.now()}` });
    toast.success("Resume uploaded");
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user) return;
    if (!file.type.startsWith("image/")) return toast.error("Image only");
    if (file.size > 2 * 1024 * 1024) return toast.error("Max 2 MB");
    const ext = file.name.split(".").pop() || "png";
    const path = `${user.id}/avatar.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) return toast.error(upErr.message);
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    updateProfile({ avatar_url: `${urlData.publicUrl}?t=${Date.now()}` });
    toast.success("Avatar uploaded");
  };

  const handleSave = async () => {
    if (!profile || !user) return;
    setSaving(true);
    try {
      const parsed = profileSchema.safeParse({
        username: profile.username || "",
        full_name: profile.full_name || "",
        headline: profile.headline || "",
        bio: profile.bio || "",
        location: profile.location || "",
        github_url: profile.github_url || "",
        linkedin_url: profile.linkedin_url || "",
        twitter_url: profile.twitter_url || "",
        website_url: profile.website_url || "",
      });
      if (!parsed.success) {
        const first = parsed.error.issues[0];
        throw new Error(`${first.path[0]}: ${first.message}`);
      }

      const { error: pErr } = await supabase
        .from("profiles")
        .update({
          username: parsed.data.username,
          full_name: parsed.data.full_name,
          headline: parsed.data.headline || null,
          bio: parsed.data.bio || null,
          location: parsed.data.location || null,
          avatar_url: profile.avatar_url,
          resume_url: profile.resume_url,
          github_url: parsed.data.github_url || null,
          linkedin_url: parsed.data.linkedin_url || null,
          twitter_url: parsed.data.twitter_url || null,
          website_url: parsed.data.website_url || null,
        })
        .eq("id", user.id);
      if (pErr) {
        if (pErr.code === "23505") throw new Error("Username already taken");
        throw new Error(pErr.message);
      }

      // upsert all projects
      for (const p of projects) {
        const { error: prErr } = await supabase
          .from("projects")
          .update({
            title: (p.title || "").slice(0, 120),
            description: (p.description || "").slice(0, 600) || null,
            github_url: p.github_url || null,
            live_url: p.live_url || null,
            image_url: p.image_url || null,
            tech_stack: p.tech_stack || [],
            display_order: p.display_order,
          })
          .eq("id", p.id);
        if (prErr) throw new Error(prErr.message);
      }

      toast.success("Saved & published");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-background">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (!profile) return null;

  const previewData = { profile, projects };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <Navbar />

      {/* Action bar */}
      <div className="sticky top-[81px] z-40 bg-card border-b-4 border-foreground px-6 py-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="size-2 bg-strike animate-pulse" />
          <span className="text-xs font-bold uppercase tracking-widest">Editor</span>
          {profile.username && (
            <a
              href={`/u/${profile.username}`}
              target="_blank"
              rel="noreferrer"
              className="hidden md:flex items-center gap-1 text-xs font-bold uppercase border-2 border-foreground px-2 py-1 hover:bg-foreground hover:text-background"
            >
              <ExternalLink className="size-3" /> /u/{profile.username}
            </a>
          )}
        </div>
        <div className="flex items-center gap-2">
          <div className="hidden lg:flex border-4 border-foreground">
            <button
              onClick={() => setPreviewMode("split")}
              className={`px-3 py-2 text-xs font-bold uppercase ${
                previewMode === "split" ? "bg-foreground text-background" : ""
              }`}
            >
              Split
            </button>
            <button
              onClick={() => setPreviewMode("preview")}
              className={`px-3 py-2 text-xs font-bold uppercase ${
                previewMode === "preview" ? "bg-foreground text-background" : ""
              }`}
            >
              Preview
            </button>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="btn-brutal-accent text-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {saving ? "Saving" : "Save & Publish"}
          </button>
        </div>
      </div>

      <main className={`flex-1 grid gap-0 ${previewMode === "split" ? "lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* EDITOR */}
        {previewMode === "split" && (
          <section className="lg:border-r-4 border-foreground p-6 md:p-8 bg-card overflow-y-auto lg:max-h-[calc(100dvh-145px)] space-y-8">
            {/* Identity */}
            <div className="border-4 border-foreground p-5 bg-background">
              <h2 className="font-display text-2xl font-extrabold uppercase mb-4 flex items-center gap-2">
                <span className="bg-accent text-accent-foreground px-2">01</span> Identity
              </h2>
              <div className="space-y-4">
                <Field label="Username" hint="your URL: /u/__">
                  <input
                    className={inputCls}
                    value={profile.username || ""}
                    onChange={(e) => updateProfile({ username: e.target.value.toLowerCase() })}
                    maxLength={30}
                    placeholder="ada-lovelace"
                  />
                </Field>
                <Field label="Full Name">
                  <input
                    className={inputCls}
                    value={profile.full_name || ""}
                    onChange={(e) => updateProfile({ full_name: e.target.value })}
                    maxLength={100}
                  />
                </Field>
                <Field label="Headline" hint="role / title">
                  <input
                    className={inputCls}
                    value={profile.headline || ""}
                    onChange={(e) => updateProfile({ headline: e.target.value })}
                    maxLength={120}
                    placeholder="Senior Frontend Engineer"
                  />
                </Field>
                <Field label="Location">
                  <input
                    className={inputCls}
                    value={profile.location || ""}
                    onChange={(e) => updateProfile({ location: e.target.value })}
                    maxLength={100}
                    placeholder="Berlin, DE"
                  />
                </Field>
                <Field label="Bio">
                  <textarea
                    className={`${inputCls} min-h-24 resize-y`}
                    value={profile.bio || ""}
                    onChange={(e) => updateProfile({ bio: e.target.value })}
                    maxLength={600}
                    placeholder="One paragraph. What you do, what you care about."
                  />
                </Field>
                <Field label="Avatar">
                  <div className="flex items-center gap-3">
                    <input
                      ref={avatarInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => e.target.files?.[0] && handleAvatarUpload(e.target.files[0])}
                    />
                    <button
                      onClick={() => avatarInputRef.current?.click()}
                      className="border-4 border-foreground bg-card px-3 py-2 font-bold text-xs uppercase hover:bg-foreground hover:text-background flex items-center gap-2"
                    >
                      <Upload className="size-3" /> Upload Image
                    </button>
                    {profile.avatar_url && (
                      <img src={profile.avatar_url} alt="avatar" className="size-10 border-2 border-foreground object-cover" />
                    )}
                  </div>
                </Field>
              </div>
            </div>

            {/* Resume */}
            <div className="border-4 border-foreground p-5 bg-background">
              <h2 className="font-display text-2xl font-extrabold uppercase mb-4 flex items-center gap-2">
                <span className="bg-accent text-accent-foreground px-2">02</span> Resume
              </h2>
              <input
                ref={resumeInputRef}
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleResumeUpload(e.target.files[0])}
              />
              <div className="flex items-center gap-3 flex-wrap">
                <button
                  onClick={() => resumeInputRef.current?.click()}
                  className="btn-brutal bg-card text-foreground text-xs"
                >
                  <Upload className="size-4" /> {profile.resume_url ? "Replace PDF" : "Upload PDF"}
                </button>
                {profile.resume_url && (
                  <a
                    href={profile.resume_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold uppercase underline decoration-strike decoration-2"
                  >
                    View current
                  </a>
                )}
              </div>
            </div>

            {/* Socials */}
            <div className="border-4 border-foreground p-5 bg-background">
              <h2 className="font-display text-2xl font-extrabold uppercase mb-4 flex items-center gap-2">
                <span className="bg-accent text-accent-foreground px-2">03</span> Links
              </h2>
              <div className="space-y-4">
                <Field label="GitHub URL">
                  <input className={inputCls} value={profile.github_url || ""} onChange={(e) => updateProfile({ github_url: e.target.value })} placeholder="https://github.com/..." />
                </Field>
                <Field label="LinkedIn URL">
                  <input className={inputCls} value={profile.linkedin_url || ""} onChange={(e) => updateProfile({ linkedin_url: e.target.value })} placeholder="https://linkedin.com/in/..." />
                </Field>
                <Field label="Twitter / X URL">
                  <input className={inputCls} value={profile.twitter_url || ""} onChange={(e) => updateProfile({ twitter_url: e.target.value })} placeholder="https://x.com/..." />
                </Field>
                <Field label="Personal Website">
                  <input className={inputCls} value={profile.website_url || ""} onChange={(e) => updateProfile({ website_url: e.target.value })} placeholder="https://..." />
                </Field>
              </div>
            </div>

            {/* Projects */}
            <div className="border-4 border-foreground p-5 bg-background">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display text-2xl font-extrabold uppercase flex items-center gap-2">
                  <span className="bg-accent text-accent-foreground px-2">04</span> Projects
                </h2>
                <button onClick={addProject} className="border-4 border-foreground bg-card px-3 py-2 font-bold text-xs uppercase hover:bg-accent flex items-center gap-1">
                  <Plus className="size-3" /> Add
                </button>
              </div>
              <div className="space-y-4">
                {projects.length === 0 && (
                  <p className="text-sm font-bold text-muted-foreground uppercase text-center py-6 border-4 border-dashed border-foreground/40">
                    No projects yet
                  </p>
                )}
                {projects.map((p) => (
                  <div key={p.id} className="border-4 border-foreground p-4 bg-card space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <GripVertical className="size-4 text-muted-foreground mt-2" />
                      <input
                        className={`${inputCls} flex-1 font-bold`}
                        value={p.title || ""}
                        onChange={(e) => updateProject(p.id, { title: e.target.value })}
                        maxLength={120}
                        placeholder="Project name"
                      />
                      <button onClick={() => removeProject(p.id)} className="border-2 border-foreground p-2 hover:bg-strike hover:text-strike-foreground">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                    <textarea
                      className={`${inputCls} min-h-20 resize-y`}
                      value={p.description || ""}
                      onChange={(e) => updateProject(p.id, { description: e.target.value })}
                      maxLength={600}
                      placeholder="What it does. Why it matters."
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <input className={inputCls} placeholder="GitHub URL" value={p.github_url || ""} onChange={(e) => updateProject(p.id, { github_url: e.target.value })} />
                      <input className={inputCls} placeholder="Live URL" value={p.live_url || ""} onChange={(e) => updateProject(p.id, { live_url: e.target.value })} />
                    </div>
                    <input
                      className={inputCls}
                      placeholder="Image URL (optional)"
                      value={p.image_url || ""}
                      onChange={(e) => updateProject(p.id, { image_url: e.target.value })}
                    />
                    <input
                      className={inputCls}
                      placeholder="Tech stack — comma separated (Rust, Go, WASM)"
                      value={(p.tech_stack || []).join(", ")}
                      onChange={(e) =>
                        updateProject(p.id, {
                          tech_stack: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean)
                            .slice(0, 12),
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="text-xs font-bold uppercase text-muted-foreground text-center pt-4">
              Click <span className="text-foreground">Save & Publish</span> to commit changes
            </div>
          </section>
        )}

        {/* PREVIEW */}
        <section className={`p-4 md:p-8 bg-stripes overflow-y-auto ${previewMode === "split" ? "lg:max-h-[calc(100dvh-145px)]" : ""}`}>
          <div className="max-w-3xl mx-auto">
            <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3 flex items-center gap-2">
              <Eye className="size-3" /> Live Preview
            </div>
            <PortfolioView data={previewData} compact={previewMode === "split"} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
