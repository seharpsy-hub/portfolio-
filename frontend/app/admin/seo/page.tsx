"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { clearAllCaches, listSites, updateSite } from "@/lib/api";
import { getToken } from "@/lib/admin";
import type { Site } from "@/lib/types";

type SeoForm = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  canonicalUrl: string;
  keywords: string;
  robots: string;
};

type MarketingForm = {
  googleAnalyticsId: string;
  googleTagManagerId: string;
  googleSearchConsole: string;
  googleAdsId: string;
  metaPixelId: string;
  microsoftClarityId: string;
  hotjarId: string;
  customHeadHtml: string;
};

const emptySeo = (): SeoForm => ({
  metaTitle: "",
  metaDescription: "",
  ogTitle: "",
  ogDescription: "",
  ogImage: "",
  canonicalUrl: "",
  keywords: "",
  robots: "index,follow",
});

const emptyMarketing = (): MarketingForm => ({
  googleAnalyticsId: "",
  googleTagManagerId: "",
  googleSearchConsole: "",
  googleAdsId: "",
  metaPixelId: "",
  microsoftClarityId: "",
  hotjarId: "",
  customHeadHtml: "",
});

function readForms(site: Site): { seo: SeoForm; marketing: MarketingForm } {
  const seo = (site.settings?.seo as Record<string, string>) ?? {};
  const marketing = (site.settings?.marketing as Record<string, string>) ?? {};
  return {
    seo: { ...emptySeo(), ...seo },
    marketing: { ...emptyMarketing(), ...marketing },
  };
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-teal-500/50";

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block text-sm">
      <span className="font-medium text-zinc-300">{label}</span>
      {hint ? <p className="mt-0.5 text-xs text-zinc-500">{hint}</p> : null}
      {children}
    </label>
  );
}

export default function AdminSeoPage() {
  const router = useRouter();
  const [sites, setSites] = useState<Site[]>([]);
  const [siteId, setSiteId] = useState("");
  const [seo, setSeo] = useState<SeoForm>(emptySeo());
  const [marketing, setMarketing] = useState<MarketingForm>(emptyMarketing());
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (token: string) => {
    const list = await listSites(token);
    setSites(list);
    const preferred = list[0];
    if (preferred) {
      setSiteId(preferred.id);
      const forms = readForms(preferred);
      setSeo(forms.seo);
      setMarketing(forms.marketing);
    }
  }, []);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/admin");
      return;
    }
    load(token).catch(() => setErr("Could not load sites."));
  }, [router, load]);

  function selectSite(id: string) {
    const site = sites.find((s) => s.id === id);
    if (!site) return;
    setSiteId(id);
    const forms = readForms(site);
    setSeo(forms.seo);
    setMarketing(forms.marketing);
    setMsg("");
    setErr("");
  }

  async function save() {
    const token = getToken();
    if (!token || !siteId) return;
    const site = sites.find((s) => s.id === siteId);
    if (!site) return;
    setSaving(true);
    setMsg("");
    setErr("");
    try {
      const nextSettings = {
        ...site.settings,
        seo: { ...seo },
        marketing: { ...marketing },
      };
      const updated = await updateSite(token, siteId, { settings: nextSettings });
      setSites((prev) => prev.map((s) => (s.id === siteId ? updated : s)));
      try {
        await clearAllCaches(token);
      } catch {
        /* non-fatal */
      }
      setMsg("SEO & marketing settings saved. Cache cleared.");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Save failed.");
    } finally {
      setSaving(false);
    }
  }

  const active = sites.find((s) => s.id === siteId);

  return (
    <AdminShell
      title="SEO & marketing"
      subtitle="Google tools, social meta, and tracking — applied to the live public site."
      actions={
        active ? (
          <Link
            href={`/site/${active.slug}/home`}
            target="_blank"
            className="rounded-lg border border-teal-500/30 px-3 py-1.5 text-sm text-teal-300 hover:bg-teal-500/10"
          >
            View live ↗
          </Link>
        ) : null
      }
    >
      {err ? <p className="mb-4 text-sm text-red-400">{err}</p> : null}
      {msg ? <p className="mb-4 text-sm text-teal-400">{msg}</p> : null}

      <div className="mb-6 flex flex-wrap items-end gap-3">
        <label className="text-sm text-zinc-400">
          Site
          <select
            className={`${inputClass} min-w-[220px]`}
            value={siteId}
            onChange={(e) => selectSite(e.target.value)}
          >
            {sites.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} (/{s.slug})
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          onClick={save}
          disabled={saving || !siteId}
          className="rounded-lg bg-teal-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-teal-400 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save settings"}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-xl border border-white/8 bg-[#12181f] p-5 md:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-100">Search & social SEO</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Titles, descriptions, Open Graph, and crawl rules for Google and social shares.
            </p>
          </div>
          <div className="space-y-4">
            <Field label="Meta title" hint="Shown in Google results (≈60 characters).">
              <input
                className={inputClass}
                value={seo.metaTitle}
                onChange={(e) => setSeo({ ...seo, metaTitle: e.target.value })}
                placeholder="Nourish & Thrive | Clinical nutrition"
              />
            </Field>
            <Field label="Meta description" hint="Snippet under the title (≈155 characters).">
              <textarea
                className={inputClass}
                rows={3}
                value={seo.metaDescription}
                onChange={(e) => setSeo({ ...seo, metaDescription: e.target.value })}
              />
            </Field>
            <Field label="Keywords" hint="Optional comma-separated keywords.">
              <input
                className={inputClass}
                value={seo.keywords}
                onChange={(e) => setSeo({ ...seo, keywords: e.target.value })}
                placeholder="dietitian, meal plans, nutrition"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="OG title">
                <input
                  className={inputClass}
                  value={seo.ogTitle}
                  onChange={(e) => setSeo({ ...seo, ogTitle: e.target.value })}
                />
              </Field>
              <Field label="Canonical URL">
                <input
                  className={inputClass}
                  value={seo.canonicalUrl}
                  onChange={(e) => setSeo({ ...seo, canonicalUrl: e.target.value })}
                  placeholder="https://yoursite.com/"
                />
              </Field>
            </div>
            <Field label="OG description">
              <textarea
                className={inputClass}
                rows={2}
                value={seo.ogDescription}
                onChange={(e) => setSeo({ ...seo, ogDescription: e.target.value })}
              />
            </Field>
            <ImageUploadField
              label="OG share image"
              value={seo.ogImage}
              onChange={(url) => setSeo({ ...seo, ogImage: url })}
              siteId={siteId || undefined}
              folder="seo"
              hint="1200×630 · JPG or PNG"
            />
            <Field label="Robots">
              <select
                className={inputClass}
                value={seo.robots}
                onChange={(e) => setSeo({ ...seo, robots: e.target.value })}
              >
                <option value="index,follow">Index & follow</option>
                <option value="noindex,follow">No index, follow</option>
                <option value="index,nofollow">Index, no follow</option>
                <option value="noindex,nofollow">No index, no follow</option>
              </select>
            </Field>
          </div>
        </section>

        <section className="rounded-xl border border-white/8 bg-[#12181f] p-5 md:p-6">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-100">Google & marketing tools</h2>
            <p className="mt-1 text-sm text-zinc-500">
              Paste IDs from Analytics, Tag Manager, Search Console, Ads, Meta, Clarity, or Hotjar.
            </p>
          </div>
          <div className="space-y-4">
            <Field
              label="Google Analytics 4 (Measurement ID)"
              hint="Format: G-XXXXXXXXXX. Skipped if GTM is set."
            >
              <input
                className={inputClass}
                value={marketing.googleAnalyticsId}
                onChange={(e) =>
                  setMarketing({ ...marketing, googleAnalyticsId: e.target.value })
                }
                placeholder="G-XXXXXXXXXX"
              />
            </Field>
            <Field
              label="Google Tag Manager"
              hint="Format: GTM-XXXXXXX — preferred if you manage tags in GTM."
            >
              <input
                className={inputClass}
                value={marketing.googleTagManagerId}
                onChange={(e) =>
                  setMarketing({ ...marketing, googleTagManagerId: e.target.value })
                }
                placeholder="GTM-XXXXXXX"
              />
            </Field>
            <Field
              label="Google Search Console verification"
              hint="Paste the content value from the HTML meta tag method."
            >
              <input
                className={inputClass}
                value={marketing.googleSearchConsole}
                onChange={(e) =>
                  setMarketing({ ...marketing, googleSearchConsole: e.target.value })
                }
                placeholder="google-site-verification token"
              />
            </Field>
            <Field label="Google Ads ID" hint="Optional AW-XXXXXXXXX (used with GA4).">
              <input
                className={inputClass}
                value={marketing.googleAdsId}
                onChange={(e) =>
                  setMarketing({ ...marketing, googleAdsId: e.target.value })
                }
                placeholder="AW-XXXXXXXXX"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Meta Pixel ID">
                <input
                  className={inputClass}
                  value={marketing.metaPixelId}
                  onChange={(e) =>
                    setMarketing({ ...marketing, metaPixelId: e.target.value })
                  }
                  placeholder="1234567890"
                />
              </Field>
              <Field label="Microsoft Clarity ID">
                <input
                  className={inputClass}
                  value={marketing.microsoftClarityId}
                  onChange={(e) =>
                    setMarketing({ ...marketing, microsoftClarityId: e.target.value })
                  }
                />
              </Field>
            </div>
            <Field label="Hotjar site ID">
              <input
                className={inputClass}
                value={marketing.hotjarId}
                onChange={(e) =>
                  setMarketing({ ...marketing, hotjarId: e.target.value })
                }
              />
            </Field>
            <Field
              label="Custom head HTML"
              hint="Advanced: extra meta/script snippets. Use carefully."
            >
              <textarea
                className={`${inputClass} font-mono text-xs`}
                rows={4}
                value={marketing.customHeadHtml}
                onChange={(e) =>
                  setMarketing({ ...marketing, customHeadHtml: e.target.value })
                }
                placeholder="<!-- optional tags -->"
              />
            </Field>
          </div>
        </section>
      </div>

      <p className="mt-6 text-xs text-zinc-600">
        Tip: After saving, hard-refresh the live site. Tracking scripts load on public pages only.
      </p>
    </AdminShell>
  );
}
