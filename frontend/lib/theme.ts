import type { CSSProperties } from "react";
import type { Theme, ThemeAnimation, ThemeColors, ThemeStyle } from "./types";

export const DEFAULT_COLORS: Required<ThemeColors> = {
  primary: "#0F766E",
  secondary: "#134E4A",
  accent: "#F59E0B",
  background: "#FFFFFF",
  surface: "#F8FAFC",
  text: "#0F172A",
  textMuted: "#64748B",
  border: "#E2E8F0",
  heroFrom: "#0F766E",
  heroTo: "#115E59",
};

export const DEFAULT_STYLE: Required<
  Pick<
    ThemeStyle,
    | "shadow"
    | "shadowSm"
    | "containerWidth"
    | "spacing"
    | "buttonStyle"
    | "cardStyle"
    | "glass"
    | "heroPattern"
    | "blur"
  >
> = {
  shadow: "0 18px 40px rgba(15, 23, 42, 0.1)",
  shadowSm: "0 4px 14px rgba(15, 23, 42, 0.06)",
  containerWidth: "72rem",
  spacing: "comfortable",
  buttonStyle: "solid",
  cardStyle: "elevated",
  glass: false,
  heroPattern: "none",
  blur: "12px",
};

export const DEFAULT_ANIMATION: Required<ThemeAnimation> = {
  entrance: "fade-up",
  duration: 0.7,
  distance: 28,
  stagger: 0.08,
  hover: "lift",
  heroMotion: "reveal",
};

export function mergeTheme(theme: Theme | null | undefined): Theme {
  const colors = { ...DEFAULT_COLORS, ...(theme?.colors ?? {}) };
  const style = { ...DEFAULT_STYLE, ...(theme?.style ?? {}) };
  const animation = { ...DEFAULT_ANIMATION, ...(theme?.animation ?? {}) };
  return {
    id: theme?.id ?? "default",
    name: theme?.name ?? "Default",
    slug: theme?.slug ?? "default",
    description: theme?.description ?? null,
    preset: theme?.preset ?? "custom",
    mode: theme?.mode ?? "light",
    colors,
    fonts: {
      heading: theme?.fonts?.heading ?? "Fraunces",
      body: theme?.fonts?.body ?? "DM Sans",
    },
    border_radius: theme?.border_radius ?? "12px",
    style,
    animation,
  };
}

export function themeCssVars(theme: Theme | null | undefined): CSSProperties {
  const t = mergeTheme(theme);
  const c = t.colors;
  const s = t.style;
  return {
    ["--color-primary" as string]: c.primary,
    ["--color-secondary" as string]: c.secondary,
    ["--color-accent" as string]: c.accent,
    ["--color-bg" as string]: c.background,
    ["--color-surface" as string]: c.surface,
    ["--color-text" as string]: c.text,
    ["--color-text-muted" as string]: c.textMuted,
    ["--color-border" as string]: c.border,
    ["--hero-from" as string]: c.heroFrom ?? c.primary,
    ["--hero-to" as string]: c.heroTo ?? c.secondary,
    ["--font-heading" as string]: `"${t.fonts.heading}", Georgia, serif`,
    ["--font-body" as string]: `"${t.fonts.body}", system-ui, sans-serif`,
    ["--radius" as string]: t.border_radius,
    ["--shadow" as string]: s.shadow ?? "none",
    ["--shadow-sm" as string]: s.shadowSm ?? "none",
    ["--container" as string]: s.containerWidth ?? "72rem",
    ["--blur" as string]: s.blur ?? "12px",
  };
}

export function sectionPadding(p?: string, spacing?: string): string {
  const airy = spacing === "airy";
  const compact = spacing === "compact";
  // Mobile-first: tighter vertical rhythm on phones, roomy from md up
  if (p === "sm") {
    return compact
      ? "py-12 sm:py-16 md:py-20"
      : airy
        ? "py-14 sm:py-20 md:py-28"
        : "py-12 sm:py-16 md:py-24";
  }
  if (p === "lg") {
    return compact
      ? "py-16 sm:py-24 md:py-36"
      : airy
        ? "py-16 sm:py-28 md:py-44"
        : "py-16 sm:py-24 md:py-40";
  }
  return compact
    ? "py-14 sm:py-20 md:py-28"
    : airy
      ? "py-16 sm:py-24 md:py-36"
      : "py-14 sm:py-20 md:py-32";
}

/** Keeps sections from visually merging into each other */
export function sectionShell(extra = ""): string {
  return `relative isolate scroll-mt-24 sm:scroll-mt-28 overflow-x-clip overflow-y-visible ${extra}`.trim();
}

export function sectionBackground(
  bg?: string,
  theme?: Theme | null
): CSSProperties {
  const glass = theme?.style?.glass;
  if (bg === "surface") {
    return {
      backgroundColor: "var(--color-surface)",
      ...(glass
        ? {
            backdropFilter: `blur(var(--blur))`,
            WebkitBackdropFilter: `blur(var(--blur))`,
          }
        : {}),
    };
  }
  if (bg === "primary") {
    return {
      backgroundImage: "linear-gradient(135deg, var(--hero-from), var(--hero-to))",
      color: theme?.mode === "dark" && theme.preset === "luxury" ? "var(--color-text)" : "#fff",
    };
  }
  return { backgroundColor: "var(--color-bg)", color: "var(--color-text)" };
}

export function cardClass(theme: Theme): string {
  const style = theme.style?.cardStyle ?? "elevated";
  if (style === "glass") {
    return "border border-[var(--color-border)] bg-[var(--color-surface)] backdrop-blur-xl";
  }
  if (style === "bordered") {
    return "border border-[var(--color-border)] bg-transparent";
  }
  if (style === "flat-border") {
    return "border border-[var(--color-border)] bg-[var(--color-bg)]";
  }
  if (style === "naked") {
    return "bg-transparent";
  }
  return "border border-[var(--color-border)] bg-[var(--color-bg)]";
}

export function cardShadow(theme: Theme): CSSProperties {
  const style = theme.style?.cardStyle ?? "elevated";
  if (style === "naked" || style === "flat-border") return {};
  if (theme.style?.shadow === "none") return {};
  return { boxShadow: "var(--shadow-sm)" };
}

export function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

export function num(v: unknown, fallback = 0): number {
  return typeof v === "number" && !Number.isNaN(v) ? v : fallback;
}

export function arr<T>(v: unknown): T[] {
  return Array.isArray(v) ? (v as T[]) : [];
}

export function obj(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

/** Google Fonts CSS2 family query fragment */
export function googleFontParam(name: string): string {
  return name.trim().replace(/\s+/g, "+");
}
