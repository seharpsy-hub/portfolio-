"use client";

import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { Theme } from "@/lib/types";
import { mergeTheme, themeCssVars } from "@/lib/theme";

const NIGHT_COLORS = {
  primary: "#B8F06E",
  secondary: "#071008",
  accent: "#F5C16C",
  background: "#08100A",
  surface: "#122016",
  text: "#F3F7EF",
  textMuted: "#9CAE96",
  border: "#243528",
  heroFrom: "#0F1C0C",
  heroTo: "#2F5A14",
};

type Mode = "day" | "night";

export function useDayNight(baseTheme: Theme) {
  const [mode, setMode] = useState<Mode>("day");

  useEffect(() => {
    const saved = localStorage.getItem("portfolio_cms_day_night") as Mode | null;
    if (saved === "day" || saved === "night") setMode(saved);
    else if (baseTheme.mode === "dark") setMode("night");
  }, [baseTheme.mode]);

  function toggle() {
    setMode((m) => {
      const next = m === "day" ? "night" : "day";
      localStorage.setItem("portfolio_cms_day_night", next);
      return next;
    });
  }

  const theme =
    mode === "night"
      ? mergeTheme({
          ...baseTheme,
          mode: "dark",
          colors: { ...baseTheme.colors, ...NIGHT_COLORS },
        })
      : mergeTheme({
          ...baseTheme,
          mode: "light",
          colors: baseTheme.colors,
        });

  const vars = themeCssVars(theme) as CSSProperties;

  return { mode, toggle, theme, vars };
}

export function DayNightToggle({
  mode,
  onToggle,
}: {
  mode: Mode;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={mode === "day" ? "Switch to night mode" : "Switch to day mode"}
      className="inline-flex h-10 items-center gap-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-2.5 text-xs font-semibold text-[var(--color-text)] shadow-sm transition hover:border-[var(--color-primary)] sm:rounded-2xl sm:px-3 sm:py-2"
    >
      <span aria-hidden>{mode === "day" ? "☀" : "☾"}</span>
      <span className="hidden sm:inline">{mode === "day" ? "Day" : "Night"}</span>
    </button>
  );
}
