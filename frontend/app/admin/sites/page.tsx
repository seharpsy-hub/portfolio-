"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  clearAllCaches,
  listPages,
  listSites,
  listThemes,
  updatePage,
  updateSite,
} from "@/lib/api";
import { getToken } from "@/lib/admin";
import type { Page, Site, Theme } from "@/lib/types";

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-500/50";

export default function AdminSitesPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [pagesBySite, setPagesBySite] = useState<Record<string, Page[]>>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [draftSite, setDraftSite] = useState<{
    name: string;
    slug: string;
    niche: string;
    status: string;
    logo_url: string;
    favicon_url: string;
    brand_name: string;
    tagline: string;
  } | null>(null);
  const [pageDrafts, setPageDrafts] = useState<Record<string, Page>>({});
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  async function load(token: string) {
    const [s, t] = await Promise.all([listSites(token), listThemes(token)]);
    setSites(s);
    setThemes(t);
    const map: Record<string, Page[]> = {};
    const drafts: Record<string, Page> = {};
    for (const site of s) {
      const pages = await listPages(site.id, token);
      map[site.id] = pages;
      for (const p of pages) drafts[p.id] = { ...p };
    }
    setPagesBySite(map);
    setPageDrafts(drafts);
    if (!expanded && s[0]) {
      setExpanded(s[0].id);
      openSiteDraft(s[0]);
    }
  }

  function openSiteDraft(site: Site) {
    setExpanded(site.id);
    const s = site.settings as Record<string, unknown>;
    setDraftSite({
      name: site.name,
      slug: site.slug,
      niche: site.niche ?? "",
      status: site.status,
      logo_url: String(s?.logo_url ?? ""),
      favicon_url: String(s?.favicon_url ?? ""),
      brand_name: String(s?.brand_name ?? site.name),
      tagline: String(s?.tagline ?? ""),
    });
  }

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    load(token).catch(() => setErr("Could not load sites. Is the API running?"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  async function applyTheme(siteId: string, themeId: string) {
    const token = getToken();
    if (!token) return;
    setSaving(siteId);
    setErr("");
    try {
      await updateSite(token, siteId, { theme_id: themeId });
      await clearAllCaches(token);
      await load(token);
      setMsg("Theme applied.");
    } catch {
      setErr("Failed to apply theme.");
    } finally {
      setSaving(null);
    }
  }

  async function saveSite(siteId: string) {
    const token = getToken();
    if (!token || !draftSite) return;
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    setSaving(siteId);
    setErr("");
    setMsg("");
    try {
      await updateSite(token, siteId, {
        name: draftSite.name,
        slug: draftSite.slug,
        niche: draftSite.niche || null,
        status: draftSite.status,
        settings: {
          ...site.settings,
          logo_url: draftSite.logo_url,
          favicon_url: draftSite.favicon_url,
          brand_name: draftSite.brand_name || draftSite.name,
          tagline: draftSite.tagline || "Diet & Nutrition",
        },
      });
      await clearAllCaches(token);
      await load(token);
      openSiteDraft({
        ...site,
        name: draftSite.name,
        slug: draftSite.slug,
        niche: draftSite.niche,
        status: draftSite.status,
        settings: {
          ...site.settings,
          logo_url: draftSite.logo_url,
          favicon_url: draftSite.favicon_url,
          brand_name: draftSite.brand_name || draftSite.name,
          tagline: draftSite.tagline || "Diet & Nutrition",
        },
      });
      setMsg("Site settings saved.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save site.");
    } finally {
      setSaving(null);
    }
  }

  async function savePage(pageId: string) {
    const token = getToken();
    const draft = pageDrafts[pageId];
    if (!token || !draft) return;
    setSaving(pageId);
    setErr("");
    setMsg("");
    try {
      const updated = await updatePage(token, pageId, {
        title: draft.title,
        slug: draft.slug,
        meta_title: draft.meta_title ?? null,
        meta_description: draft.meta_description ?? null,
        is_home: draft.is_home,
        is_published: draft.is_published,
      });
      setPageDrafts((prev) => ({ ...prev, [pageId]: updated }));
      await clearAllCaches(token);
      await load(token);
      setMsg(`Page “${updated.title}” saved.`);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save page.");
    } finally {
      setSaving(null);
    }
  }

  return (
    <AdminShell
      title="Sites & pages"
      subtitle="Full control: site identity, logo photo, page SEO, themes, then edit every section photo."
      actions={
        <Link
          href="/admin/seo"
          className="rounded-lg border border-white/10 px-3 py-1.5 text-sm text-zinc-300 hover:border-teal-500/30 hover:text-teal-200"
        >
          SEO & marketing
        </Link>
      }
    >
      {err ? <p className="mb-4 text-sm text-red-400">{err}</p> : null}
      {msg ? <p className="mb-4 text-sm text-teal-400">{msg}</p> : null}

      <ul className="space-y-6">
        {sites.map((site) => {
          const activeTheme = themes.find((t) => t.id === site.theme_id) ?? site.theme;
          const isOpen = expanded === site.id;
          return (
            <li
              key={site.id}
              className="overflow-hidden rounded-xl border border-white/8 bg-[#12181f]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/5 px-5 py-4 md:px-6">
                <button
                  type="button"
                  onClick={() => (isOpen ? setExpanded(null) : openSiteDraft(site))}
                  className="text-left"
                >
                  <h2 className="text-lg font-medium">{site.name}</h2>
                  <p className="mt-1 text-sm text-zinc-500">
                    /{site.slug} · {site.status}
                    {site.niche ? ` · ${site.niche}` : ""}
                    <span className="ml-2 text-teal-400/80">
                      {isOpen ? "Collapse ▲" : "Setup ▼"}
                    </span>
                  </p>
                </button>
                <Link
                  href={`/site/${site.slug}/home`}
                  target="_blank"
                  className="rounded-md border border-teal-500/30 px-3 py-1.5 text-sm text-teal-300 hover:bg-teal-500/10"
                >
                  Open live site
                </Link>
              </div>

              {isOpen && draftSite ? (
                <div className="grid gap-6 border-b border-white/5 px-5 py-5 md:px-6 lg:grid-cols-2">
                  <div className="space-y-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Site identity
                    </p>
                    <label className="block text-sm text-zinc-400">
                      Site name
                      <input
                        className={inputClass}
                        value={draftSite.name}
                        onChange={(e) =>
                          setDraftSite({ ...draftSite, name: e.target.value })
                        }
                      />
                    </label>
                    <label className="block text-sm text-zinc-400">
                      URL slug
                      <input
                        className={inputClass}
                        value={draftSite.slug}
                        onChange={(e) =>
                          setDraftSite({ ...draftSite, slug: e.target.value })
                        }
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <label className="block text-sm text-zinc-400">
                        Niche
                        <input
                          className={inputClass}
                          value={draftSite.niche}
                          onChange={(e) =>
                            setDraftSite({ ...draftSite, niche: e.target.value })
                          }
                          placeholder="nutritionist"
                        />
                      </label>
                      <label className="block text-sm text-zinc-400">
                        Status
                        <select
                          className={inputClass}
                          value={draftSite.status}
                          onChange={(e) =>
                            setDraftSite({ ...draftSite, status: e.target.value })
                          }
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </label>
                    </div>
                    <label className="block text-sm text-zinc-400">
                      Brand name (header)
                      <input
                        className={inputClass}
                        value={draftSite.brand_name}
                        onChange={(e) =>
                          setDraftSite({ ...draftSite, brand_name: e.target.value })
                        }
                        placeholder="SN Diet"
                      />
                    </label>
                    <label className="block text-sm text-zinc-400">
                      Tagline
                      <input
                        className={inputClass}
                        value={draftSite.tagline}
                        onChange={(e) =>
                          setDraftSite({ ...draftSite, tagline: e.target.value })
                        }
                        placeholder="Diet & Nutrition"
                      />
                    </label>
                    <ImageUploadField
                      label="Favicon (SN)"
                      value={draftSite.favicon_url}
                      onChange={(url) =>
                        setDraftSite({ ...draftSite, favicon_url: url })
                      }
                      siteId={site.id}
                      folder="brand"
                      hint="Browser tab icon · JPG/PNG/SVG"
                    />
                    <ImageUploadField
                      label="Site logo / brand photo"
                      value={draftSite.logo_url}
                      onChange={(url) =>
                        setDraftSite({ ...draftSite, logo_url: url })
                      }
                      siteId={site.id}
                      folder="brand"
                    />
                    <button
                      type="button"
                      disabled={saving === site.id}
                      onClick={() => saveSite(site.id)}
                      className="rounded-lg bg-teal-500 px-4 py-2 text-sm font-semibold text-zinc-950 hover:bg-teal-400 disabled:opacity-50"
                    >
                      {saving === site.id ? "Saving…" : "Save site settings"}
                    </button>
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Active theme
                    </p>
                    {activeTheme ? (
                      <div className="mt-3 rounded-lg border border-white/8 bg-black/20 p-4">
                        <p className="font-medium">{activeTheme.name}</p>
                        <p className="mt-1 text-xs capitalize text-zinc-500">
                          {activeTheme.preset} · {activeTheme.mode}
                        </p>
                        <div className="mt-3 flex gap-1.5">
                          {[
                            activeTheme.colors?.primary,
                            activeTheme.colors?.accent,
                            activeTheme.colors?.secondary,
                            activeTheme.colors?.surface,
                          ].map((c, i) => (
                            <span
                              key={i}
                              className="h-6 w-6 rounded-full border border-white/10"
                              style={{ background: c ?? "#333" }}
                            />
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <p className="mt-4 text-xs uppercase tracking-wider text-zinc-500">
                      Switch theme
                    </p>
                    <div className="mt-2 max-h-56 space-y-2 overflow-y-auto">
                      {themes.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          disabled={saving === site.id || t.id === site.theme_id}
                          onClick={() => applyTheme(site.id, t.id)}
                          className={`flex w-full items-center justify-between rounded-md border px-3 py-2 text-left text-sm transition ${
                            t.id === site.theme_id
                              ? "border-teal-500/40 bg-teal-500/10 text-teal-100"
                              : "border-white/8 hover:border-white/20"
                          }`}
                        >
                          <span>{t.name}</span>
                          <span className="text-xs capitalize text-zinc-500">
                            {t.preset}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}

              <div className="px-5 py-5 md:px-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Pages — setup & sections
                </p>
                <ul className="mt-3 space-y-4">
                  {(pagesBySite[site.id] ?? []).map((page) => {
                    const draft = pageDrafts[page.id] ?? page;
                    return (
                      <li
                        key={page.id}
                        className="rounded-xl border border-white/8 bg-black/20 p-4"
                      >
                        <div className="grid gap-3 md:grid-cols-2">
                          <label className="block text-sm text-zinc-400">
                            Page title
                            <input
                              className={inputClass}
                              value={draft.title}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: { ...draft, title: e.target.value },
                                }))
                              }
                            />
                          </label>
                          <label className="block text-sm text-zinc-400">
                            Page slug
                            <input
                              className={inputClass}
                              value={draft.slug}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: { ...draft, slug: e.target.value },
                                }))
                              }
                            />
                          </label>
                          <label className="block text-sm text-zinc-400 md:col-span-2">
                            Meta title
                            <input
                              className={inputClass}
                              value={draft.meta_title ?? ""}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: {
                                    ...draft,
                                    meta_title: e.target.value,
                                  },
                                }))
                              }
                            />
                          </label>
                          <label className="block text-sm text-zinc-400 md:col-span-2">
                            Meta description
                            <textarea
                              className={inputClass}
                              rows={2}
                              value={draft.meta_description ?? ""}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: {
                                    ...draft,
                                    meta_description: e.target.value,
                                  },
                                }))
                              }
                            />
                          </label>
                          <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <input
                              type="checkbox"
                              checked={!!draft.is_published}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: {
                                    ...draft,
                                    is_published: e.target.checked,
                                  },
                                }))
                              }
                            />
                            Published
                          </label>
                          <label className="flex items-center gap-2 text-sm text-zinc-400">
                            <input
                              type="checkbox"
                              checked={!!draft.is_home}
                              onChange={(e) =>
                                setPageDrafts((prev) => ({
                                  ...prev,
                                  [page.id]: {
                                    ...draft,
                                    is_home: e.target.checked,
                                  },
                                }))
                              }
                            />
                            Home page
                          </label>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                          <button
                            type="button"
                            disabled={saving === page.id}
                            onClick={() => savePage(page.id)}
                            className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-zinc-900 disabled:opacity-50"
                          >
                            {saving === page.id ? "Saving…" : "Save page setup"}
                          </button>
                          <Link
                            href={`/admin/pages/${page.id}?site=${site.slug}&siteId=${site.id}`}
                            className="rounded-lg border border-teal-500/35 px-3 py-2 text-xs font-medium text-teal-200 hover:bg-teal-500/10"
                          >
                            Edit sections & photos →
                          </Link>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </AdminShell>
  );
}
