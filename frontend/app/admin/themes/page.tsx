"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { clearAllCaches, listSites, listThemes, updateSite, updateTheme } from "@/lib/api";
import { getToken } from "@/lib/admin";
import type { Site, Theme } from "@/lib/types";

const COLOR_KEYS: { key: keyof NonNullable<Theme["colors"]>; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "secondary", label: "Secondary" },
  { key: "accent", label: "Accent" },
  { key: "background", label: "Background" },
  { key: "surface", label: "Surface" },
  { key: "text", label: "Text" },
  { key: "textMuted", label: "Muted text" },
  { key: "border", label: "Border" },
  { key: "heroFrom", label: "Hero from" },
  { key: "heroTo", label: "Hero to" },
];

export default function AdminThemesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [site, setSite] = useState<Site | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftColors, setDraftColors] = useState<Record<string, string>>({});
  const [draftRadius, setDraftRadius] = useState("12px");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function reload(token: string) {
    const [t, s] = await Promise.all([listThemes(token), listSites(token)]);
    setThemes(t);
    setSite(s[0] ?? null);
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    reload(token).catch(() => setErr("Failed to load themes."));
  }, [router]);

  function startEdit(theme: Theme) {
    setEditingId(theme.id);
    setDraftColors({ ...(theme.colors as Record<string, string>) });
    setDraftRadius(theme.border_radius || "12px");
    setMsg("");
  }

  async function apply(themeId: string) {
    if (!site) return;
    const token = getToken();
    if (!token) return;
    setMsg("");
    setErr("");
    try {
      const updated = await updateSite(token, site.id, { theme_id: themeId });
      setSite(updated);
      await clearAllCaches(token);
      setMsg(
        `Applied “${themes.find((t) => t.id === themeId)?.name}” — cache cleared. Refresh live site.`
      );
    } catch {
      setErr("Could not apply theme.");
    }
  }

  async function saveColors() {
    if (!editingId) return;
    const token = getToken();
    if (!token) return;
    setSaving(true);
    setErr("");
    try {
      await updateTheme(token, editingId, {
        colors: draftColors,
        border_radius: draftRadius,
      });
      await clearAllCaches(token);
      await reload(token);
      setMsg("Theme colors saved + cache cleared. Refresh the live site.");
    } catch {
      setErr("Could not save theme colors.");
    } finally {
      setSaving(false);
    }
  }

  const editing = themes.find((t) => t.id === editingId);

  return (
    <AdminShell
      title="Theme studio"
      subtitle="Apply presets, then fine-tune colors & radius — all saved to the database."
    >
      {msg ? <p className="mb-4 text-sm text-teal-300">{msg}</p> : null}
      {err ? <p className="mb-4 text-sm text-red-400">{err}</p> : null}

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="grid gap-5 md:grid-cols-2">
          {themes.map((theme) => {
            const active = site?.theme_id === theme.id;
            return (
              <article
                key={theme.id}
                className={`flex flex-col overflow-hidden rounded-xl border ${
                  active ? "border-teal-400/50 ring-1 ring-teal-400/30" : "border-white/8"
                } bg-[#12181f]`}
              >
                <div
                  className="relative h-28 overflow-hidden p-4"
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors?.heroFrom ?? theme.colors?.primary}, ${theme.colors?.heroTo ?? theme.colors?.secondary})`,
                  }}
                >
                  <p className="text-lg text-white" style={{ fontFamily: `"${theme.fonts?.heading}", Georgia, serif` }}>
                    {theme.name}
                  </p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/70">
                    {theme.preset} · {theme.mode}
                  </p>
                </div>
                <div className="flex flex-1 flex-col p-4">
                  <p className="text-xs text-zinc-400 line-clamp-2">{theme.description}</p>
                  <div className="mt-3 flex gap-1">
                    {[theme.colors?.primary, theme.colors?.accent, theme.colors?.secondary].map(
                      (c, i) => (
                        <span
                          key={i}
                          className="h-5 w-5 rounded-full border border-white/15"
                          style={{ background: c ?? "#222" }}
                        />
                      )
                    )}
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => apply(theme.id)}
                      disabled={active || !site}
                      className={`flex-1 rounded-md py-2 text-xs font-medium ${
                        active
                          ? "bg-teal-500/20 text-teal-200"
                          : "bg-white text-zinc-900 hover:bg-teal-100"
                      }`}
                    >
                      {active ? "Active" : "Apply"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(theme)}
                      className="rounded-md border border-white/15 px-3 py-2 text-xs hover:border-teal-400/40"
                    >
                      Edit colors
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="rounded-xl border border-white/8 bg-[#12181f] p-5 lg:sticky lg:top-6 lg:self-start">
          {editing ? (
            <>
              <h2 className="font-medium">Edit · {editing.name}</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Changes save to DB and affect the live site when this theme is active.
              </p>
              <div className="mt-4 space-y-3">
                {COLOR_KEYS.map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-zinc-400">{label}</span>
                    <span className="flex items-center gap-2">
                      <input
                        type="color"
                        value={normalizeHex(draftColors[key] ?? "#888888")}
                        onChange={(e) =>
                          setDraftColors((c) => ({ ...c, [key]: e.target.value }))
                        }
                        className="h-8 w-10 cursor-pointer rounded border-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={draftColors[key] ?? ""}
                        onChange={(e) =>
                          setDraftColors((c) => ({ ...c, [key]: e.target.value }))
                        }
                        className="w-28 rounded border border-white/10 bg-black/30 px-2 py-1 font-mono text-xs"
                      />
                    </span>
                  </label>
                ))}
                <label className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-zinc-400">Border radius</span>
                  <input
                    type="text"
                    value={draftRadius}
                    onChange={(e) => setDraftRadius(e.target.value)}
                    className="w-28 rounded border border-white/10 bg-black/30 px-2 py-1 text-xs"
                    placeholder="18px"
                  />
                </label>
              </div>
              <button
                type="button"
                disabled={saving}
                onClick={saveColors}
                className="mt-5 w-full rounded-md bg-teal-500 py-2.5 text-sm font-semibold text-zinc-950 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save colors + clear cache"}
              </button>
            </>
          ) : (
            <p className="text-sm text-zinc-500">
              Select <span className="text-zinc-300">Edit colors</span> on a theme to change
              primary, hero gradient, surfaces, and more.
            </p>
          )}
        </div>
      </div>
    </AdminShell>
  );
}

function normalizeHex(value: string): string {
  if (/^#[0-9A-Fa-f]{6}$/.test(value)) return value;
  if (/^#[0-9A-Fa-f]{3}$/.test(value)) {
    const r = value[1];
    const g = value[2];
    const b = value[3];
    return `#${r}${r}${g}${g}${b}${b}`;
  }
  return "#888888";
}
