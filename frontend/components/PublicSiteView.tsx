"use client";

import { useEffect, useState } from "react";
import { DayNightToggle, useDayNight } from "@/components/DayNight";
import { SectionRenderer } from "@/components/SectionRenderer";
import { mediaUrl } from "@/lib/api";
import type { Section, Site, Theme } from "@/lib/types";

const NAV = [
  { href: "#profile", label: "Consultant Nutritionist & Dietitan" },
  { href: "#about", label: "About" },
  { href: "#services", label: "Services" },
  { href: "#testimonials", label: "Reviews" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Book" },
];

export function PublicSiteView({
  site,
  sections,
  theme,
}: {
  site: Site;
  sections: Section[];
  theme: Theme;
}) {
  const { mode, toggle, theme: liveTheme, vars } = useDayNight(theme);
  const settings = (site.settings ?? {}) as Record<string, unknown>;
  const brand = String(settings.brand_name ?? site.name ?? "Studio");
  const tagline = String(settings.tagline ?? "");
  const logo = mediaUrl(String(settings.logo_url ?? settings.favicon_url ?? ""));
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function go(href: string) {
    setMenuOpen(false);
    // allow drawer to close before smooth scroll
    requestAnimationFrame(() => {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <div
      style={vars}
      className="min-h-screen overflow-x-clip bg-[var(--color-bg)] text-[var(--color-text)] transition-[background-color,color] duration-500 antialiased"
      data-theme={liveTheme.slug}
      data-mode={mode}
    >
      <header className="sticky top-0 z-40 border-b border-[var(--color-border)]/70 bg-[color-mix(in_srgb,var(--color-bg)_82%,transparent)] backdrop-blur-xl supports-[padding:max(0px)]:pt-[env(safe-area-inset-top)]">
        <div
          className="mx-auto flex w-full max-w-full items-center justify-between gap-3 px-4 py-3 sm:px-8 sm:py-3.5 md:px-10 lg:px-12"
          style={{ maxWidth: "var(--container)" }}
        >
          <a href="#hero" className="flex min-w-0 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logo}
                alt={brand}
                className="h-8 w-8 shrink-0 object-contain sm:h-9 sm:w-9"
              />
            ) : (
              <span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-[10px] font-bold text-white sm:h-9 sm:w-9 sm:text-xs"
                style={{ background: "var(--color-primary)" }}
              >
                SN
              </span>
            )}
            <span className="min-w-0">
              <span
                className="block truncate text-sm font-semibold tracking-tight text-[var(--color-text)] sm:text-base"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {brand}
              </span>
              {tagline ? (
                <span className="hidden truncate text-[11px] text-[var(--color-text-muted)] sm:block">
                  {tagline}
                </span>
              ) : null}
            </span>
          </a>

          <nav className="hidden items-center gap-5 text-sm font-medium text-[var(--color-text-muted)] lg:flex xl:gap-6">
            {NAV.map((item) => (
              <a
                key={item.href}
                className="transition hover:text-[var(--color-primary)]"
                href={item.href}
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <DayNightToggle mode={mode} onToggle={toggle} />
            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--color-border)] text-[var(--color-text)] lg:hidden"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMenuOpen((v) => !v)}
            >
              <span className="sr-only">Menu</span>
              <span className="relative block h-3.5 w-4">
                <span
                  className={`absolute left-0 top-0 h-0.5 w-full bg-current transition ${
                    menuOpen ? "translate-y-1.5 rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition ${
                    menuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-3 h-0.5 w-full bg-current transition ${
                    menuOpen ? "-translate-y-1.5 -rotate-45" : ""
                  }`}
                />
              </span>
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div
          className={`lg:hidden overflow-hidden border-t border-[var(--color-border)]/60 transition-[max-height,opacity] duration-300 ${
            menuOpen ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col gap-1 px-4 py-3 sm:px-8">
            {NAV.map((item) => (
              <button
                key={item.href}
                type="button"
                onClick={() => go(item.href)}
                className="rounded-xl px-3 py-3 text-left text-base font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface)]"
              >
                {item.label}
              </button>
            ))}
            <button
              type="button"
              onClick={() => go("#contact")}
              className="mt-2 rounded-xl px-3 py-3.5 text-center text-sm font-semibold text-white"
              style={{ background: "var(--color-primary)" }}
            >
              Book consultation
            </button>
          </nav>
        </div>
      </header>

      <SectionRenderer
        sections={sections}
        siteId={site.id}
        theme={liveTheme}
        dayNightMode={mode}
      />
    </div>
  );
}
