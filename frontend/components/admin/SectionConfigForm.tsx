"use client";

import { useEffect, useState } from "react";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import type { SectionType } from "@/lib/types";

type Props = {
  type: SectionType;
  config: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
  siteId?: string;
};

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
      <span className="text-zinc-400">{label}</span>
      {hint ? <span className="ml-2 text-xs text-zinc-600">{hint}</span> : null}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

const inputClass =
  "w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-sm text-zinc-100 outline-none focus:border-teal-500/50";

function setKey(
  config: Record<string, unknown>,
  key: string,
  value: unknown,
  onChange: (c: Record<string, unknown>) => void
) {
  onChange({ ...config, [key]: value });
}

function LayoutFields({
  c,
  onChange,
}: {
  c: Record<string, unknown>;
  onChange: (config: Record<string, unknown>) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Vertical padding">
        <select
          className={inputClass}
          value={String(c.paddingY ?? "md")}
          onChange={(e) => setKey(c, "paddingY", e.target.value, onChange)}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </Field>
      <Field label="Background variant">
        <select
          className={inputClass}
          value={String(c.background ?? "default")}
          onChange={(e) => setKey(c, "background", e.target.value, onChange)}
        >
          <option value="default">Default (page bg)</option>
          <option value="surface">Surface</option>
          <option value="primary">Primary gradient</option>
        </select>
      </Field>
    </div>
  );
}

function JsonArrayEditor({
  label,
  value,
  onChange,
  rows = 10,
}: {
  label: string;
  value: unknown;
  onChange: (v: unknown) => void;
  rows?: number;
}) {
  const [text, setText] = useState(JSON.stringify(value ?? [], null, 2));
  const [error, setError] = useState("");

  useEffect(() => {
    setText(JSON.stringify(value ?? [], null, 2));
  }, [value]);

  return (
    <Field label={label} hint={error || "Advanced JSON optional"}>
      <textarea
        className={`${inputClass} font-mono text-xs leading-relaxed`}
        rows={rows}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          try {
            const parsed = JSON.parse(e.target.value);
            if (!Array.isArray(parsed)) {
              setError("Must be an array");
              return;
            }
            setError("");
            onChange(parsed);
          } catch {
            setError("Invalid JSON");
          }
        }}
      />
    </Field>
  );
}

function asItems(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? (value as Record<string, unknown>[]) : [];
}

function ServiceItemsEditor({
  items,
  onChange,
  siteId,
}: {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
  siteId?: string;
}) {
  function update(i: number, patch: Record<string, unknown>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([
      ...items,
      {
        id: `plan-${items.length + 1}`,
        title: "New plan",
        description: "",
        image: "",
        badge: "",
        meta: "",
        href: "#contact",
        tags: [],
      },
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">Diet plans / services</p>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-zinc-200 hover:bg-white/15"
        >
          + Add plan
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-300">Plan #{i + 1}</p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[11px] text-zinc-500 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Title">
              <input
                className={inputClass}
                value={String(item.title ?? "")}
                onChange={(e) => update(i, { title: e.target.value })}
              />
            </Field>
            <Field label="Badge">
              <input
                className={inputClass}
                value={String(item.badge ?? "")}
                onChange={(e) => update(i, { badge: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Description">
            <textarea
              className={inputClass}
              rows={2}
              value={String(item.description ?? "")}
              onChange={(e) => update(i, { description: e.target.value })}
            />
          </Field>
          <ImageUploadField
            label="Plan photo"
            value={String(item.image ?? "")}
            onChange={(url) => update(i, { image: url })}
            siteId={siteId}
            folder="plans"
          />
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Meta line">
              <input
                className={inputClass}
                value={String(item.meta ?? "")}
                onChange={(e) => update(i, { meta: e.target.value })}
              />
            </Field>
            <Field label="Link">
              <input
                className={inputClass}
                value={String(item.href ?? "")}
                onChange={(e) => update(i, { href: e.target.value })}
              />
            </Field>
          </div>
        </div>
      ))}
    </div>
  );
}

function TestimonialItemsEditor({
  items,
  onChange,
  siteId,
}: {
  items: Record<string, unknown>[];
  onChange: (items: Record<string, unknown>[]) => void;
  siteId?: string;
}) {
  function update(i: number, patch: Record<string, unknown>) {
    onChange(items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function add() {
    onChange([
      ...items,
      { quote: "", author: "", role: "", avatar: "", rating: 5 },
    ]);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-zinc-400">Reviews</p>
        <button
          type="button"
          onClick={add}
          className="rounded-md bg-white/10 px-2.5 py-1 text-xs text-zinc-200 hover:bg-white/15"
        >
          + Add review
        </button>
      </div>
      {items.map((item, i) => (
        <div
          key={i}
          className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-zinc-300">Review #{i + 1}</p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-[11px] text-zinc-500 hover:text-red-300"
            >
              Remove
            </button>
          </div>
          <Field label="Quote">
            <textarea
              className={inputClass}
              rows={3}
              value={String(item.quote ?? "")}
              onChange={(e) => update(i, { quote: e.target.value })}
            />
          </Field>
          <div className="grid gap-2 sm:grid-cols-2">
            <Field label="Author">
              <input
                className={inputClass}
                value={String(item.author ?? "")}
                onChange={(e) => update(i, { author: e.target.value })}
              />
            </Field>
            <Field label="Role">
              <input
                className={inputClass}
                value={String(item.role ?? "")}
                onChange={(e) => update(i, { role: e.target.value })}
              />
            </Field>
          </div>
          <ImageUploadField
            label="Avatar photo"
            value={String(item.avatar ?? "")}
            onChange={(url) => update(i, { avatar: url })}
            siteId={siteId}
            folder="avatars"
          />
          <Field label="Rating (1–5)">
            <input
              type="number"
              min={1}
              max={5}
              className={inputClass}
              value={Number(item.rating ?? 5)}
              onChange={(e) => update(i, { rating: Number(e.target.value) })}
            />
          </Field>
        </div>
      ))}
    </div>
  );
}

export function SectionConfigForm({ type, config, onChange, siteId }: Props) {
  const c = config;

  if (type === "hero") {
    const cp = (c.ctaPrimary as Record<string, string>) ?? {};
    const cs = (c.ctaSecondary as Record<string, string>) ?? {};
    return (
      <div className="space-y-4">
        <Field label="Eyebrow">
          <input
            className={inputClass}
            value={String(c.eyebrow ?? "")}
            onChange={(e) => setKey(c, "eyebrow", e.target.value, onChange)}
          />
        </Field>
        <Field label="Headline">
          <input
            className={inputClass}
            value={String(c.headline ?? "")}
            onChange={(e) => setKey(c, "headline", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subheadline">
          <textarea
            className={inputClass}
            rows={3}
            value={String(c.subheadline ?? "")}
            onChange={(e) => setKey(c, "subheadline", e.target.value, onChange)}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Primary CTA label">
            <input
              className={inputClass}
              value={cp.label ?? ""}
              onChange={(e) =>
                setKey(c, "ctaPrimary", { ...cp, label: e.target.value }, onChange)
              }
            />
          </Field>
          <Field label="Primary CTA link">
            <input
              className={inputClass}
              value={cp.href ?? ""}
              onChange={(e) =>
                setKey(c, "ctaPrimary", { ...cp, href: e.target.value }, onChange)
              }
            />
          </Field>
          <Field label="Secondary CTA label">
            <input
              className={inputClass}
              value={cs.label ?? ""}
              onChange={(e) =>
                setKey(c, "ctaSecondary", { ...cs, label: e.target.value }, onChange)
              }
            />
          </Field>
          <Field label="Secondary CTA link">
            <input
              className={inputClass}
              value={cs.href ?? ""}
              onChange={(e) =>
                setKey(c, "ctaSecondary", { ...cs, href: e.target.value }, onChange)
              }
            />
          </Field>
        </div>
        <ImageUploadField
          label="Hero background photo"
          value={String(c.backgroundImage ?? "")}
          onChange={(url) => setKey(c, "backgroundImage", url, onChange)}
          siteId={siteId}
          folder="hero"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Overlay opacity (0–1)" hint="Transparency over photo">
            <input
              type="number"
              min={0}
              max={1}
              step={0.05}
              className={inputClass}
              value={Number(c.overlayOpacity ?? 0.55)}
              onChange={(e) =>
                setKey(c, "overlayOpacity", Number(e.target.value), onChange)
              }
            />
          </Field>
          <Field label="Overlay color" hint="#1A2E05">
            <input
              className={inputClass}
              value={String(c.overlayColor ?? "")}
              onChange={(e) => setKey(c, "overlayColor", e.target.value, onChange)}
              placeholder="#1A2E05"
            />
          </Field>
        </div>
        <JsonArrayEditor
          label="Clickable diet plan chips (hero)"
          value={c.planChips}
          onChange={(v) => setKey(c, "planChips", v, onChange)}
          rows={5}
        />
        <JsonArrayEditor
          label="Hero stats"
          value={c.stats}
          onChange={(v) => setKey(c, "stats", v, onChange)}
          rows={5}
        />
        <JsonArrayEditor
          label="Floating metric cards"
          value={c.floatCards}
          onChange={(v) => setKey(c, "floatCards", v, onChange)}
          rows={6}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "about") {
    return (
      <div className="space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={String(c.subtitle ?? "")}
            onChange={(e) => setKey(c, "subtitle", e.target.value, onChange)}
          />
        </Field>
        <JsonArrayEditor
          label="Story paragraphs (array of strings)"
          value={c.paragraphs ?? (c.body ? [c.body] : [])}
          onChange={(v) => setKey(c, "paragraphs", v, onChange)}
          rows={8}
        />
        <Field label="Professional summary">
          <textarea
            className={inputClass}
            rows={4}
            value={String(c.professionalSummary ?? "")}
            onChange={(e) =>
              setKey(c, "professionalSummary", e.target.value, onChange)
            }
          />
        </Field>
        <ImageUploadField
          label="About photo"
          value={String(c.image ?? "")}
          onChange={(url) => setKey(c, "image", url, onChange)}
          siteId={siteId}
          folder="about"
        />
        <Field label="Image position">
          <select
            className={inputClass}
            value={String(c.imagePosition ?? "right")}
            onChange={(e) => setKey(c, "imagePosition", e.target.value, onChange)}
          >
            <option value="right">Right</option>
            <option value="left">Left</option>
          </select>
        </Field>
        <JsonArrayEditor
          label="Quick information [{label,value}]"
          value={c.quickInfo}
          onChange={(v) => setKey(c, "quickInfo", v, onChange)}
          rows={8}
        />
        <Field label="Why choose title">
          <input
            className={inputClass}
            value={String(c.whyChooseTitle ?? "")}
            onChange={(e) => setKey(c, "whyChooseTitle", e.target.value, onChange)}
          />
        </Field>
        <JsonArrayEditor
          label="Why choose (string list)"
          value={c.whyChoose}
          onChange={(v) => setKey(c, "whyChoose", v, onChange)}
          rows={8}
        />
        <Field label="Mission">
          <textarea
            className={inputClass}
            rows={3}
            value={String(c.mission ?? "")}
            onChange={(e) => setKey(c, "mission", e.target.value, onChange)}
          />
        </Field>
        <Field label="Vision">
          <textarea
            className={inputClass}
            rows={3}
            value={String(c.vision ?? "")}
            onChange={(e) => setKey(c, "vision", e.target.value, onChange)}
          />
        </Field>
        <JsonArrayEditor
          label="Core values (string list)"
          value={c.values}
          onChange={(v) => setKey(c, "values", v, onChange)}
          rows={5}
        />
        <JsonArrayEditor
          label="Statistics (string list — update anytime)"
          value={c.stats}
          onChange={(v) => setKey(c, "stats", v, onChange)}
          rows={6}
        />
        <JsonArrayEditor
          label="Highlights [{label,value}]"
          value={c.highlights}
          onChange={(v) => setKey(c, "highlights", v, onChange)}
          rows={5}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "services") {
    return (
      <div className="space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={String(c.subtitle ?? "")}
            onChange={(e) => setKey(c, "subtitle", e.target.value, onChange)}
          />
        </Field>
        <ServiceItemsEditor
          items={asItems(c.items)}
          onChange={(items) => setKey(c, "items", items, onChange)}
          siteId={siteId}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "testimonials") {
    return (
      <div className="space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={String(c.subtitle ?? "")}
            onChange={(e) => setKey(c, "subtitle", e.target.value, onChange)}
          />
        </Field>
        <TestimonialItemsEditor
          items={asItems(c.items)}
          onChange={(items) => setKey(c, "items", items, onChange)}
          siteId={siteId}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={String(c.subtitle ?? "")}
            onChange={(e) => setKey(c, "subtitle", e.target.value, onChange)}
          />
        </Field>
        <Field label="Address">
          <input
            className={inputClass}
            value={String(c.address ?? "")}
            onChange={(e) => setKey(c, "address", e.target.value, onChange)}
          />
        </Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Phone">
            <input
              className={inputClass}
              value={String(c.phone ?? "")}
              onChange={(e) => setKey(c, "phone", e.target.value, onChange)}
            />
          </Field>
          <Field label="Email">
            <input
              className={inputClass}
              value={String(c.email ?? "")}
              onChange={(e) => setKey(c, "email", e.target.value, onChange)}
            />
          </Field>
        </div>
        <Field label="Hours">
          <input
            className={inputClass}
            value={String(c.hours ?? "")}
            onChange={(e) => setKey(c, "hours", e.target.value, onChange)}
          />
        </Field>
        <Field label="Show contact form">
          <select
            className={inputClass}
            value={c.formEnabled === false ? "no" : "yes"}
            onChange={(e) =>
              setKey(c, "formEnabled", e.target.value === "yes", onChange)
            }
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </Field>
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "profile") {
    const cta = (c.cta as Record<string, string>) ?? {};
    return (
      <div className="space-y-4">
        <Field label="Role type">
          <select
            className={inputClass}
            value={String(c.role ?? "dr")}
            onChange={(e) => setKey(c, "role", e.target.value, onChange)}
          >
            <option value="dr">Doctor / Dietitian</option>
            <option value="owner">Owner</option>
            <option value="student">Student</option>
            <option value="agency">Agency</option>
            <option value="company">Company</option>
          </select>
        </Field>
        <Field label="Name">
          <input
            className={inputClass}
            value={String(c.name ?? "")}
            onChange={(e) => setKey(c, "name", e.target.value, onChange)}
          />
        </Field>
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Description">
          <textarea
            className={inputClass}
            rows={4}
            value={String(c.description ?? "")}
            onChange={(e) => setKey(c, "description", e.target.value, onChange)}
          />
        </Field>
        <ImageUploadField
          label="Doctor / profile photo"
          value={String(c.image ?? "")}
          onChange={(url) => setKey(c, "image", url, onChange)}
          siteId={siteId}
          folder="profile"
        />
        <JsonArrayEditor
          label="Credentials / badges"
          value={c.credentials}
          onChange={(v) => setKey(c, "credentials", v, onChange)}
          rows={4}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA label">
            <input
              className={inputClass}
              value={cta.label ?? ""}
              onChange={(e) =>
                setKey(c, "cta", { ...cta, label: e.target.value }, onChange)
              }
            />
          </Field>
          <Field label="CTA link">
            <input
              className={inputClass}
              value={cta.href ?? ""}
              onChange={(e) =>
                setKey(c, "cta", { ...cta, href: e.target.value }, onChange)
              }
            />
          </Field>
        </div>
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "faq") {
    return (
      <div className="space-y-4">
        <Field label="Title">
          <input
            className={inputClass}
            value={String(c.title ?? "")}
            onChange={(e) => setKey(c, "title", e.target.value, onChange)}
          />
        </Field>
        <Field label="Subtitle">
          <input
            className={inputClass}
            value={String(c.subtitle ?? "")}
            onChange={(e) => setKey(c, "subtitle", e.target.value, onChange)}
          />
        </Field>
        <JsonArrayEditor
          label="FAQ items [{question, answer}]"
          value={c.items}
          onChange={(v) => setKey(c, "items", v, onChange)}
          rows={14}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  if (type === "footer") {
    const footerCta = (c.cta ?? {}) as { label?: string; href?: string };
    return (
      <div className="space-y-4">
        <Field label="Tagline / brand">
          <input
            className={inputClass}
            value={String(c.tagline ?? "")}
            onChange={(e) => setKey(c, "tagline", e.target.value, onChange)}
          />
        </Field>
        <Field label="Short description">
          <textarea
            className={inputClass}
            rows={3}
            value={String(c.description ?? "")}
            onChange={(e) => setKey(c, "description", e.target.value, onChange)}
          />
        </Field>
        <ImageUploadField
          label="Footer logo"
          value={String(c.logoUrl ?? "")}
          onChange={(url) => setKey(c, "logoUrl", url, onChange)}
          siteId={siteId}
          folder="brand"
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA label">
            <input
              className={inputClass}
              value={String(footerCta.label ?? "")}
              onChange={(e) =>
                setKey(c, "cta", { ...footerCta, label: e.target.value }, onChange)
              }
            />
          </Field>
          <Field label="CTA link">
            <input
              className={inputClass}
              value={String(footerCta.href ?? "")}
              onChange={(e) =>
                setKey(c, "cta", { ...footerCta, href: e.target.value }, onChange)
              }
            />
          </Field>
        </div>
        <Field label="Copyright">
          <input
            className={inputClass}
            value={String(c.copyright ?? "")}
            onChange={(e) => setKey(c, "copyright", e.target.value, onChange)}
          />
        </Field>
        <JsonArrayEditor
          label="Columns"
          value={c.columns}
          onChange={(v) => setKey(c, "columns", v, onChange)}
          rows={8}
        />
        <JsonArrayEditor
          label="Social links"
          value={c.social}
          onChange={(v) => setKey(c, "social", v, onChange)}
          rows={4}
        />
        <LayoutFields c={c} onChange={onChange} />
      </div>
    );
  }

  return (
    <textarea
      className={`${inputClass} font-mono text-xs`}
      rows={12}
      value={JSON.stringify(c, null, 2)}
      onChange={(e) => {
        try {
          onChange(JSON.parse(e.target.value) as Record<string, unknown>);
        } catch {
          /* ignore */
        }
      }}
    />
  );
}
