"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { SectionConfigForm } from "@/components/admin/SectionConfigForm";
import {
  clearAllCaches,
  createSection,
  deleteSection,
  getPage,
  listSections,
  reorderSections,
  updatePage,
  updateSection,
} from "@/lib/api";
import {
  SECTION_TYPE_LABELS,
  SECTION_TYPES,
  defaultConfig,
  getToken,
} from "@/lib/admin";
import type { Page, Section, SectionType } from "@/lib/types";
import { CacheClearButton } from "@/components/admin/CacheClearButton";

const QUICK_ADD: SectionType[] = ["profile", "hero", "services", "faq", "contact"];

function typeLabel(type: SectionType) {
  return SECTION_TYPE_LABELS[type] ?? type;
}

function typeBadge(type: SectionType) {
  if (type === "profile") {
    return "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30";
  }
  if (type === "hero") return "bg-sky-500/15 text-sky-300 ring-sky-500/25";
  if (type === "contact") return "bg-amber-500/15 text-amber-200 ring-amber-500/25";
  return "bg-white/5 text-zinc-300 ring-white/10";
}

function AdminPageSectionsInner({ pageId }: { pageId: string }) {
  const searchParams = useSearchParams();
  const siteSlug = searchParams.get("site") ?? "";
  const siteIdParam = searchParams.get("siteId") ?? "";
  const router = useRouter();

  const [page, setPage] = useState<Page | null>(null);
  const [siteId, setSiteId] = useState(siteIdParam);
  const [showPageSetup, setShowPageSetup] = useState(true);
  const [pageDraft, setPageDraft] = useState({
    title: "",
    slug: "",
    meta_title: "",
    meta_description: "",
    is_published: true,
    is_home: false,
  });
  const [sections, setSections] = useState<Section[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftConfig, setDraftConfig] = useState<Record<string, unknown>>({});
  const [newType, setNewType] = useState<SectionType>("profile");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [previewKey, setPreviewKey] = useState(0);
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    function onCleared() {
      setPreviewKey((k) => k + 1);
      setMsg("Cache cleared — preview refreshed.");
    }
    window.addEventListener("cms-cache-cleared", onCleared);
    return () => window.removeEventListener("cms-cache-cleared", onCleared);
  }, []);

  const load = useCallback(async () => {
    const token = getToken();
    if (!token) return;
    const [list, pageData] = await Promise.all([
      listSections(pageId, token),
      getPage(pageId, token),
    ]);
    setSections(list.sort((a, b) => a.sort_order - b.sort_order));
    setPage(pageData);
    setSiteId((prev) => prev || pageData.site_id);
    setPageDraft({
      title: pageData.title,
      slug: pageData.slug,
      meta_title: pageData.meta_title ?? "",
      meta_description: pageData.meta_description ?? "",
      is_published: pageData.is_published,
      is_home: pageData.is_home,
    });
  }, [pageId]);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    load().catch(() => setErr("Failed to load sections."));
  }, [load, router]);

  async function savePageSetup() {
    const token = getToken();
    if (!token) return;
    setMsg("");
    setErr("");
    try {
      await updatePage(token, pageId, {
        title: pageDraft.title,
        slug: pageDraft.slug,
        meta_title: pageDraft.meta_title || null,
        meta_description: pageDraft.meta_description || null,
        is_published: pageDraft.is_published,
        is_home: pageDraft.is_home,
      });
      await clearAllCaches(token);
      await load();
      setMsg("Page setup saved.");
      setPreviewKey((k) => k + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Failed to save page.");
    }
  }

  async function withToken(fn: (token: string) => Promise<unknown>) {
    const token = getToken();
    if (!token) return;
    setMsg("");
    setErr("");
    try {
      await fn(token);
      await load();
      try {
        await clearAllCaches(token);
      } catch {
        /* non-fatal */
      }
      setMsg("Saved — cache cleared. Refresh live site / preview.");
      setPreviewKey((k) => k + 1);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Action failed.");
    }
  }

  function startEdit(section: Section) {
    setEditingId(section.id);
    setDraftConfig({ ...section.config });
  }

  async function saveEdit() {
    if (!editingId) return;
    await withToken((token) =>
      updateSection(token, editingId, { config: draftConfig })
    );
  }

  async function toggleVisible(section: Section) {
    await withToken((token) =>
      updateSection(token, section.id, { is_visible: !section.is_visible })
    );
  }

  async function move(section: Section, dir: -1 | 1) {
    const sorted = [...sections].sort((a, b) => a.sort_order - b.sort_order);
    const idx = sorted.findIndex((s) => s.id === section.id);
    if (!sorted[idx + dir]) return;
    const items = sorted.map((s, i) => ({ id: s.id, sort_order: i }));
    const a = items[idx];
    const b = items[idx + dir];
    items[idx] = { ...b, sort_order: a.sort_order };
    items[idx + dir] = { ...a, sort_order: b.sort_order };
    await withToken((token) => reorderSections(token, items));
  }

  async function addSection(type: SectionType = newType) {
    const maxOrder = sections.reduce((m, s) => Math.max(m, s.sort_order), -1);
    await withToken(async (token) => {
      const created = await createSection(token, {
        page_id: pageId,
        type,
        config: defaultConfig(type),
        sort_order: maxOrder + 1,
      });
      setEditingId(created.id);
      setDraftConfig({ ...created.config });
      return created;
    });
  }

  async function removeSection(id: string) {
    if (!confirm("Delete this section permanently?")) return;
    await withToken((token) => deleteSection(token, id));
    if (editingId === id) setEditingId(null);
  }

  const editing = sections.find((s) => s.id === editingId);
  const hasProfile = sections.some((s) => s.type === "profile");
  const previewUrl = siteSlug ? `/site/${siteSlug}/home?v=${previewKey}` : null;

  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-100">
      <header className="sticky top-0 z-20 border-b border-white/[0.06] bg-[#080b10]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-3 px-4 py-3.5 md:px-6">
          <div className="flex flex-wrap items-center gap-3 md:gap-4">
            <Link
              href="/admin/sites"
              className="rounded-md px-2 py-1 text-sm text-zinc-500 transition hover:bg-white/5 hover:text-zinc-200"
            >
              ← Sites
            </Link>
            <div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-lg">
                {page?.title ?? "Page"} · sections & photos
              </h1>
              <p className="text-xs text-zinc-500">
                Upload JPG/PNG for every image · reorder · save · preview
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/admin/seo"
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:border-teal-500/30 hover:text-teal-200"
            >
              SEO & marketing
            </Link>
            <CacheClearButton />
            <button
              type="button"
              onClick={() => setShowPreview((v) => !v)}
              className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300"
            >
              {showPreview ? "Hide preview" : "Show preview"}
            </button>
            {previewUrl ? (
              <a
                href={previewUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-teal-500/30 px-3 py-1.5 text-xs text-teal-300"
              >
                Open live ↗
              </a>
            ) : null}
          </div>
        </div>
      </header>

      <div
        className={`mx-auto grid max-w-[1600px] gap-0 ${
          showPreview ? "xl:grid-cols-[1fr_1fr_1.1fr]" : "lg:grid-cols-2"
        }`}
      >
        <div className="border-r border-white/[0.06] p-4 md:p-5">
          <div className="mb-4 rounded-xl border border-white/10 bg-black/25 p-3">
            <button
              type="button"
              onClick={() => setShowPageSetup((v) => !v)}
              className="flex w-full items-center justify-between text-left"
            >
              <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Page setup
              </span>
              <span className="text-[11px] text-zinc-500">
                {showPageSetup ? "Hide" : "Show"}
              </span>
            </button>
            {showPageSetup ? (
              <div className="mt-3 space-y-2">
                <label className="block text-xs text-zinc-400">
                  Title
                  <input
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm"
                    value={pageDraft.title}
                    onChange={(e) =>
                      setPageDraft({ ...pageDraft, title: e.target.value })
                    }
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  Slug
                  <input
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm"
                    value={pageDraft.slug}
                    onChange={(e) =>
                      setPageDraft({ ...pageDraft, slug: e.target.value })
                    }
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  Meta title
                  <input
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm"
                    value={pageDraft.meta_title}
                    onChange={(e) =>
                      setPageDraft({ ...pageDraft, meta_title: e.target.value })
                    }
                  />
                </label>
                <label className="block text-xs text-zinc-400">
                  Meta description
                  <textarea
                    className="mt-1 w-full rounded-md border border-white/10 bg-black/40 px-2.5 py-1.5 text-sm"
                    rows={2}
                    value={pageDraft.meta_description}
                    onChange={(e) =>
                      setPageDraft({
                        ...pageDraft,
                        meta_description: e.target.value,
                      })
                    }
                  />
                </label>
                <div className="flex flex-wrap gap-3 pt-1 text-xs text-zinc-400">
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={pageDraft.is_published}
                      onChange={(e) =>
                        setPageDraft({
                          ...pageDraft,
                          is_published: e.target.checked,
                        })
                      }
                    />
                    Published
                  </label>
                  <label className="flex items-center gap-1.5">
                    <input
                      type="checkbox"
                      checked={pageDraft.is_home}
                      onChange={(e) =>
                        setPageDraft({
                          ...pageDraft,
                          is_home: e.target.checked,
                        })
                      }
                    />
                    Home
                  </label>
                </div>
                <button
                  type="button"
                  onClick={savePageSetup}
                  className="mt-1 w-full rounded-lg bg-white/90 py-2 text-xs font-semibold text-zinc-900"
                >
                  Save page setup
                </button>
              </div>
            ) : null}
          </div>

          <div className="mb-4 flex items-center justify-between gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Sections · {sections.length}
            </p>
            {!hasProfile ? (
              <button
                type="button"
                onClick={() => addSection("profile")}
                className="rounded-lg bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-emerald-400"
              >
                + Add Consultant Nutritionist & Dietitan section
              </button>
            ) : null}
          </div>

          {msg ? (
            <p className="mb-3 rounded-lg border border-teal-500/20 bg-teal-500/10 px-3 py-2 text-xs text-teal-300">
              {msg}
            </p>
          ) : null}
          {err ? (
            <p className="mb-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
              {err}
            </p>
          ) : null}

          {!hasProfile ? (
            <div className="mb-4 rounded-xl border border-dashed border-emerald-500/35 bg-emerald-500/5 p-4">
              <p className="text-sm font-medium text-emerald-200">Consultant Nutritionist & Dietitan / Profile missing</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">
                Add a Consultant Nutritionist & Dietitan section to show the profile (photo, credentials, book CTA)
                on the public site.
              </p>
              <button
                type="button"
                onClick={() => addSection("profile")}
                className="mt-3 rounded-lg bg-emerald-500 px-3 py-2 text-xs font-semibold text-zinc-950"
              >
                Add Consultant Nutritionist & Dietitan / Profile
              </button>
            </div>
          ) : null}

          <ul className="space-y-2">
            {sections.map((section) => (
              <li
                key={section.id}
                className={`rounded-xl border p-3.5 transition ${
                  editingId === section.id
                    ? "border-teal-500/45 bg-teal-500/8 shadow-[0_0_0_1px_rgba(45,212,191,0.12)]"
                    : "border-white/[0.07] bg-[#12181f] hover:border-white/15"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ${typeBadge(
                          section.type
                        )}`}
                      >
                        {typeLabel(section.type)}
                      </span>
                      <span className="text-[10px] text-zinc-600">#{section.sort_order + 1}</span>
                      {!section.is_visible ? (
                        <span className="text-[10px] font-medium text-amber-400">Hidden</span>
                      ) : null}
                    </div>
                    {section.type === "profile" ? (
                      <p className="mt-1.5 truncate text-xs text-zinc-500">
                        {String(section.config?.name ?? "Consultant Nutritionist & Dietitan profile")} ·{" "}
                        {String(section.config?.role ?? "dr")}
                      </p>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {[
                      { label: "↑", fn: () => move(section, -1) },
                      { label: "↓", fn: () => move(section, 1) },
                      {
                        label: section.is_visible ? "Hide" : "Show",
                        fn: () => toggleVisible(section),
                      },
                      { label: "Edit", fn: () => startEdit(section) },
                      { label: "Del", fn: () => removeSection(section.id) },
                    ].map((btn) => (
                      <button
                        key={btn.label}
                        type="button"
                        onClick={btn.fn}
                        className={`rounded-md border px-2 py-1 text-[11px] transition ${
                          btn.label === "Edit"
                            ? "border-teal-500/35 text-teal-200 hover:bg-teal-500/10"
                            : btn.label === "Del"
                              ? "border-white/10 text-zinc-500 hover:border-red-500/40 hover:text-red-300"
                              : "border-white/10 text-zinc-300 hover:border-white/25"
                        }`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-3 rounded-xl border border-dashed border-white/15 bg-black/20 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Quick add
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_ADD.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => addSection(t)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium ring-1 transition hover:brightness-110 ${typeBadge(
                    t
                  )}`}
                >
                  + {typeLabel(t)}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-end gap-2 border-t border-white/5 pt-3">
              <label className="text-xs text-zinc-400">
                Or choose type
                <select
                  className="mt-1 block min-w-[180px] rounded-lg border border-white/10 bg-black/40 px-2.5 py-2 text-sm"
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as SectionType)}
                >
                  {SECTION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {typeLabel(t)}
                    </option>
                  ))}
                </select>
              </label>
              <button
                type="button"
                onClick={() => addSection()}
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-zinc-900 hover:bg-zinc-100"
              >
                Add section
              </button>
            </div>
          </div>
        </div>

        <div className="border-r border-white/[0.06] p-4 md:p-5">
          {editing ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                    Editing
                  </p>
                  <h2 className="text-sm font-semibold text-zinc-100">
                    {typeLabel(editing.type)}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setEditingId(null)}
                  className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                >
                  Close
                </button>
              </div>
              <SectionConfigForm
                type={editing.type}
                config={draftConfig}
                onChange={setDraftConfig}
                siteId={siteId || undefined}
              />
              <button
                type="button"
                onClick={saveEdit}
                className="mt-5 w-full rounded-lg bg-teal-500 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-teal-400"
              >
                Save section
              </button>
            </>
          ) : (
            <div className="flex h-48 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 px-6 text-center">
              <p className="text-sm text-zinc-400">Select a section to edit</p>
              <p className="mt-1 max-w-xs text-xs text-zinc-600">
                Tip: use <span className="text-zinc-400">Consultant Nutritionist & Dietitan / Profile</span> for the
                practitioner bio, then Hero, Plans, and Contact.
              </p>
            </div>
          )}
        </div>

        {showPreview && previewUrl ? (
          <div className="hidden min-h-[80vh] bg-[#0a0e14] p-3 xl:block">
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
              Live preview
            </p>
            <iframe
              key={previewKey}
              title="Live preview"
              src={previewUrl}
              className="h-[calc(100vh-7rem)] w-full rounded-xl border border-white/10 bg-white"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function AdminPageSections({ pageId }: { pageId: string }) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0b0f14] text-sm text-zinc-500">
          Loading section builder…
        </div>
      }
    >
      <AdminPageSectionsInner pageId={pageId} />
    </Suspense>
  );
}
