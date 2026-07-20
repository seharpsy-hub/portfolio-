import { mediaUrl } from "@/lib/api";
import { SectionContainer } from "@/components/SectionContainer";
import { arr, sectionBackground, sectionPadding, sectionShell, str } from "@/lib/theme";
import type { FooterColumn, SocialLink, Theme } from "@/lib/types";
import { MotionSection } from "@/components/MotionSection";

interface Props {
  config: Record<string, unknown>;
  theme: Theme;
  layoutStyle?: number;
}

function SocialIcon({ platform }: { platform: string }) {
  const p = platform.toLowerCase();
  const common = "h-[18px] w-[18px]";
  if (p.includes("insta")) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }
  if (p.includes("face")) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H9v3h2v7h3v-7h2.5l.5-3H14V9z" />
      </svg>
    );
  }
  if (p.includes("you") || p.includes("yt")) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M23 12.2s0-3.2-.4-4.7c-.2-.9-.9-1.6-1.8-1.8C18.5 5.2 12 5.2 12 5.2s-6.5 0-8.8.5c-.9.2-1.6.9-1.8 1.8C1 9 1 12.2 1 12.2s0 3.2.4 4.7c.2.9.9 1.6 1.8 1.8 2.3.5 8.8.5 8.8.5s6.5 0 8.8-.5c.9-.2 1.6-.9 1.8-1.8.4-1.5.4-4.7.4-4.7zM9.8 15.5v-6.6l5.7 3.3-5.7 3.3z" />
      </svg>
    );
  }
  if (p.includes("whats") || p.includes("wa")) {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 2a10 10 0 0 0-8.7 14.9L2 22l5.3-1.4A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-3.1.8.8-3-.2-.3A8 8 0 1 1 12 20zm4.4-5.9c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-1.4-.7-2.3-1.2-3.2-2.8-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.5-.4h-.5c-.2 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3z" />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path d="M3 12h18M12 3c3 3.5 3 14.5 0 18M12 3c-3 3.5-3 14.5 0 18" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

export function FooterSection({ config, theme, layoutStyle = 0 }: Props) {
  const tagline = str(config.tagline);
  const description = str(config.description);
  const logo = mediaUrl(str(config.logoUrl));
  const columns = arr<FooterColumn>(config.columns);
  const social = arr<SocialLink>(config.social);
  const copyright = str(config.copyright);
  const policyLinks = arr<{ label?: string; href?: string }>(config.policyLinks);
  const cta = (config.cta ?? {}) as { label?: string; href?: string };
  const ctaLabel = str(cta.label);
  const ctaHref = str(cta.href, "#contact");
  const padding = sectionPadding(str(config.paddingY, "lg"), theme.style?.spacing);
  const style = sectionBackground(str(config.background, "primary"), theme);
  const onPrimary = str(config.background, "primary") === "primary";
  const muted = onPrimary ? "text-white/70" : "text-[var(--color-text-muted)]";
  const softBorder = onPrimary ? "border-white/15" : "border-[var(--color-border)]";
  const linkHover = onPrimary
    ? "hover:text-white"
    : "hover:text-[var(--color-primary)]";

  return (
    <MotionSection
      id="footer"
      theme={theme}
      layoutStyle={layoutStyle}
      className={`${sectionShell(padding)} relative overflow-hidden`}
      style={style}
      entrance="fade-in"
    >
      {/* Soft atmosphere — not a card grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background: onPrimary
            ? "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(255,255,255,0.14), transparent 55%), radial-gradient(ellipse 50% 40% at 90% 100%, rgba(0,0,0,0.18), transparent 50%)"
            : "radial-gradient(ellipse 70% 50% at 0% 100%, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 60%)",
        }}
        aria-hidden
      />

      <SectionContainer className="relative">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.5fr)] lg:gap-16 xl:gap-20">
          {/* Brand column */}
          <div className="max-w-md">
            <a href="#hero" className="inline-flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={tagline || "Brand"}
                  className="h-11 w-auto object-contain sm:h-12"
                />
              ) : (
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl text-xs font-bold tracking-wide text-white sm:h-12 sm:w-12"
                  style={{ background: onPrimary ? "rgba(255,255,255,0.18)" : "var(--color-primary)" }}
                >
                  SN
                </span>
              )}
              {tagline ? (
                <span
                  className="text-lg font-semibold tracking-tight sm:text-xl"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  {tagline}
                </span>
              ) : null}
            </a>

            {description ? (
              <p className={`mt-5 text-sm leading-relaxed sm:text-[15px] ${muted}`}>
                {description}
              </p>
            ) : null}

            {ctaLabel ? (
              <a
                href={ctaHref}
                className={`mt-7 inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  onPrimary
                    ? "bg-white text-[var(--color-secondary)] hover:bg-white/90"
                    : "bg-[var(--color-primary)] text-white hover:opacity-90"
                }`}
              >
                {ctaLabel}
                <span aria-hidden className="text-base leading-none">
                  →
                </span>
              </a>
            ) : null}

            {social.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2.5">
                {social.map((s, i) => {
                  const platform = str(s.platform, "social");
                  return (
                    <li key={i}>
                      <a
                        href={str(s.href, "#")}
                        aria-label={platform}
                        title={platform}
                        rel="noopener noreferrer"
                        target="_blank"
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${softBorder} ${
                          onPrimary
                            ? "bg-white/5 text-white/85 hover:bg-white/15 hover:text-white"
                            : "bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)]"
                        }`}
                      >
                        <SocialIcon platform={platform} />
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          <div
            className={`grid gap-8 sm:grid-cols-2 ${
              columns.length >= 3 ? "md:grid-cols-3" : ""
            }`}
          >
            {columns.map((col, i) => (
              <div key={i}>
                <p
                  className={`text-[11px] font-semibold uppercase tracking-[0.18em] ${
                    onPrimary ? "text-white/55" : "text-[var(--color-text-muted)]"
                  }`}
                >
                  {str(col.title)}
                </p>
                <ul className="mt-4 space-y-3">
                  {arr<{ label?: string; href?: string }>(col.links).map((link, j) => (
                    <li key={j}>
                      <a
                        href={str(link.href, "#")}
                        className={`text-sm font-medium opacity-90 transition ${linkHover}`}
                      >
                        {str(link.label)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div
          className={`mt-12 flex flex-col gap-4 border-t pt-7 text-sm sm:mt-14 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-5 sm:pt-8 ${softBorder}`}
        >
          <p className={`text-xs leading-relaxed sm:text-[13px] ${muted}`}>
            {copyright}
          </p>
          {policyLinks.length > 0 ? (
            <ul className="flex flex-wrap gap-x-5 gap-y-2">
              {policyLinks.map((l, i) => (
                <li key={i}>
                  <a
                    href={str(l.href, "#")}
                    className={`text-xs font-medium transition sm:text-[13px] ${muted} ${linkHover}`}
                  >
                    {str(l.label)}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </SectionContainer>
    </MotionSection>
  );
}
