"use client";

import { mediaUrl } from "@/lib/api";
import { SectionContainer } from "@/components/SectionContainer";
import {
  arr,
  cardClass,
  cardShadow,
  obj,
  sectionBackground,
  sectionPadding,
  sectionShell,
  str,
} from "@/lib/theme";
import type { CtaLink, Theme } from "@/lib/types";
import {
  FloatingOrbs,
  MotionSection,
  ParallaxPanel,
  ScrollRevealRow,
  StaggerChildren,
  StaggerItem,
} from "@/components/MotionSection";

interface SectionProps {
  config: Record<string, unknown>;
  theme: Theme;
  layoutStyle?: number;
}

function HeroPattern({ pattern }: { pattern?: string }) {
  if (pattern === "soft-blobs") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50">
        <div className="absolute -left-24 top-0 h-80 w-80 rounded-full bg-white/25 blur-3xl" />
        <div className="absolute bottom-[-10%] right-0 h-[28rem] w-[28rem] rounded-full bg-[var(--color-accent)]/35 blur-3xl" />
      </div>
    );
  }
  if (pattern === "aurora") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-1/4 top-0 h-[120%] w-1/2 rotate-12 bg-gradient-to-b from-cyan-400/30 via-violet-500/20 to-transparent blur-3xl" />
        <div className="absolute -right-1/4 bottom-0 h-[120%] w-1/2 -rotate-12 bg-gradient-to-t from-fuchsia-500/25 via-blue-500/15 to-transparent blur-3xl" />
      </div>
    );
  }
  if (pattern === "grid") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
    );
  }
  if (pattern === "grain") {
    return (
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    );
  }
  return null;
}

function Cta({
  link,
  primary,
  theme,
}: {
  link: CtaLink;
  primary?: boolean;
  theme: Theme;
}) {
  const label = str(link.label, "Learn more");
  const href = str(link.href, "#");
  const btn = theme.style?.buttonStyle ?? "solid";
  const base =
    "inline-flex w-full items-center justify-center px-6 py-3.5 text-sm font-semibold tracking-wide transition-all duration-300 sm:w-auto sm:px-7";

  if (!str(link.label)) return null;

  if (btn === "underline") {
    return (
      <a href={href} className={`${base} border-b-2 border-current px-1 py-1`}>
        {label}
      </a>
    );
  }
  if (btn === "outline-gold" || (!primary && btn !== "gradient")) {
    return (
      <a
        href={href}
        className={`${base} border border-current/45 bg-white/5 backdrop-blur-sm hover:bg-white/10`}
        style={{ borderRadius: "var(--radius)" }}
      >
        {label}
      </a>
    );
  }
  if (btn === "gradient" && primary) {
    return (
      <a
        href={href}
        className={`${base} text-[var(--color-secondary)]`}
        style={{
          borderRadius: "var(--radius)",
          backgroundImage: "linear-gradient(135deg, var(--color-primary), var(--color-accent))",
          boxShadow: "var(--shadow-sm)",
        }}
      >
        {label}
      </a>
    );
  }
  return (
    <a
      href={href}
      className={`${base} bg-[var(--color-accent)] text-[var(--color-secondary)] hover:brightness-105`}
      style={{ borderRadius: "999px", boxShadow: "var(--shadow-sm)" }}
    >
      {label}
    </a>
  );
}

const ICONS: Record<string, string> = {
  leaf: "🌿",
  heart: "♡",
  bolt: "⚡",
  bowl: "◎",
  tooth: "◆",
  sparkles: "✦",
  smile: "☺",
  clock: "◷",
  default: "●",
};

export function HeroSection({ config, theme, layoutStyle = 0 }: SectionProps) {
  const eyebrow = str(config.eyebrow, str(theme.preset));
  const headline = str(config.headline, "Welcome");
  const subheadline = str(config.subheadline);
  const bgImage = mediaUrl(str(config.backgroundImage));
  const overlay =
    typeof config.overlayOpacity === "number" ? config.overlayOpacity : 0.55;
  const overlayColor = str(config.overlayColor, "var(--color-secondary)");
  const ctaPrimary = obj(config.ctaPrimary) as CtaLink;
  const ctaSecondary = obj(config.ctaSecondary) as CtaLink;
  const stats = arr<{ value?: string; label?: string }>(config.stats);
  const floatCards = arr<{ title?: string; value?: string; hint?: string }>(
    config.floatCards
  );
  const planChips = arr<{ label?: string; href?: string }>(config.planChips);
  const padding = sectionPadding(str(config.paddingY, "lg"), theme.style?.spacing);
  const style = sectionBackground(str(config.background, "primary"), theme);

  return (
    <MotionSection
      id="hero"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(`overflow-hidden ${padding}`)}
      style={style}
    >
      {/* Editable background photo + transparency overlay */}
      {bgImage ? (
        <>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={bgImage}
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ backgroundColor: overlayColor, opacity: overlay }}
          />
        </>
      ) : null}
      <HeroPattern pattern={theme.style?.heroPattern} />
      <FloatingOrbs />

      <SectionContainer className="relative grid items-center gap-8 sm:gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div className="min-w-0">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-white/80 sm:mb-4 sm:text-xs sm:tracking-[0.32em]">
            {eyebrow}
          </p>
          <h1
            className="max-w-2xl text-[1.85rem] leading-[1.12] tracking-tight text-white sm:text-4xl md:text-6xl lg:text-[4.1rem]"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {headline}
          </h1>
          {subheadline ? (
            <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/90 sm:mt-6 sm:text-base md:text-lg">
              {subheadline}
            </p>
          ) : null}

          {planChips.length > 0 ? (
            <div className="mt-6 sm:mt-8">
              <p className="mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/70 sm:mb-3 sm:text-[11px] sm:tracking-[0.25em]">
                Quick diet plans
              </p>
              <div className="flex flex-wrap gap-2">
                {planChips.map((chip, i) => (
                  <a
                    key={i}
                    href={str(chip.href, "#services")}
                    className="rounded-xl border border-white/30 bg-white/15 px-3 py-2 text-xs font-medium text-white backdrop-blur-md transition active:scale-[0.98] sm:px-4 sm:text-sm hover:bg-white/25"
                  >
                    {str(chip.label, "Plan")}
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          <div className="mt-6 flex w-full flex-col gap-3 sm:mt-8 sm:w-auto sm:flex-row sm:flex-wrap">
            <Cta link={ctaPrimary} primary theme={theme} />
            <Cta link={ctaSecondary} theme={theme} />
          </div>

          {stats.length > 0 ? (
            <ScrollRevealRow className="mt-8 grid max-w-lg grid-cols-3 gap-2 border-t border-white/20 pt-6 sm:mt-12 sm:gap-4 sm:pt-8">
              {stats.map((s, i) => (
                <div key={i} className="min-w-0">
                  <p className="text-xl font-semibold text-white sm:text-2xl md:text-3xl">
                    {str(s.value)}
                  </p>
                  <p className="mt-1 text-[10px] leading-snug text-white/70 sm:text-xs">
                    {str(s.label)}
                  </p>
                </div>
              ))}
            </ScrollRevealRow>
          ) : null}
        </div>

        {floatCards.length > 0 ? (
          <ParallaxPanel className="relative hidden min-h-[22rem] lg:block" speed={55}>
            <div
              className="absolute inset-0 rounded-[2rem] bg-white/10 backdrop-blur-md"
              style={{ boxShadow: "var(--shadow)" }}
            />
            <div className="relative space-y-4 p-6">
              {floatCards.map((card, i) => (
                <div
                  key={i}
                  className="animate-float-slow rounded-2xl border border-white/20 bg-white/95 p-4 text-[var(--color-text)] shadow-lg"
                  style={{ animationDelay: `${i * 0.4}s` }}
                >
                  <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                    {str(card.title)}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[var(--color-primary)]">
                    {str(card.value)}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {str(card.hint)}
                  </p>
                </div>
              ))}
            </div>
          </ParallaxPanel>
        ) : null}
      </SectionContainer>
    </MotionSection>
  );
}

export function AboutSection({ config, theme, layoutStyle = 1 }: SectionProps) {
  const title = str(config.title, "About");
  const subtitle = str(config.subtitle);
  const body = str(config.body);
  const paragraphs = arr<string>(config.paragraphs);
  const professionalSummary = str(config.professionalSummary);
  const image = mediaUrl(str(config.image));
  const imageRight = str(config.imagePosition, "right") !== "left";
  const highlights = arr<{ label?: string; value?: string }>(config.highlights);
  const quickInfo = arr<{ label?: string; value?: string }>(config.quickInfo);
  const whyChoose = arr<string>(config.whyChoose);
  const mission = str(config.mission);
  const vision = str(config.vision);
  const values = arr<string>(config.values);
  const stats = arr<string>(config.stats);
  const padding = sectionPadding(str(config.paddingY), theme.style?.spacing);
  const style = sectionBackground(str(config.background), theme);
  const bodyBlocks = paragraphs.length > 0 ? paragraphs : body ? [body] : [];

  return (
    <MotionSection
      id="about"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(padding)}
      style={style}
    >
      <SectionContainer>
        <div
          className={`grid items-start gap-8 sm:gap-10 md:grid-cols-2 md:gap-14 ${
            layoutStyle % 2 === 1
              ? "md:[direction:rtl]"
              : imageRight
                ? ""
                : "md:[direction:rtl]"
          }`}
        >
          <div className="min-w-0 md:[direction:ltr]">
            {subtitle ? (
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.22em]">
                {subtitle}
              </p>
            ) : null}
            <h2
              className="mt-2 text-2xl leading-tight sm:mt-3 sm:text-3xl md:text-5xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {title}
            </h2>
            {bodyBlocks.map((p, i) => (
              <p
                key={i}
                className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:mt-5 sm:text-base md:text-lg"
              >
                {p}
              </p>
            ))}
            {highlights.length > 0 ? (
              <StaggerChildren
                theme={theme}
                className="mt-8 grid grid-cols-3 gap-2 sm:mt-10 sm:gap-4"
              >
                {highlights.map((h, i) => (
                  <StaggerItem
                    key={i}
                    theme={theme}
                    className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3 sm:p-4"
                  >
                    <p className="text-xl font-semibold text-[var(--color-primary)] sm:text-2xl md:text-3xl">
                      {str(h.value, "—")}
                    </p>
                    <p className="mt-1 text-[10px] text-[var(--color-text-muted)] sm:text-xs md:text-sm">
                      {str(h.label)}
                    </p>
                  </StaggerItem>
                ))}
              </StaggerChildren>
            ) : null}
          </div>
          <ParallaxPanel className="md:[direction:ltr]" speed={30}>
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={image}
                alt=""
                className="aspect-[4/5] w-full object-cover"
                style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
              />
            ) : (
              <div
                className="relative aspect-[4/5] w-full overflow-hidden"
                style={{
                  borderRadius: "var(--radius)",
                  background:
                    "linear-gradient(160deg, var(--color-surface), color-mix(in srgb, var(--color-primary) 35%, var(--color-accent)))",
                  boxShadow: "var(--shadow)",
                }}
              >
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 20%, white, transparent 45%), radial-gradient(circle at 70% 80%, var(--color-accent), transparent 40%)",
                  }}
                />
                <p
                  className="absolute bottom-8 left-8 right-8 text-3xl text-white drop-shadow"
                  style={{ fontFamily: "var(--font-heading)" }}
                >
                  Healthy Eating. Better Living. Lasting Results.
                </p>
              </div>
            )}
          </ParallaxPanel>
        </div>

        {professionalSummary ? (
          <div className="mt-10 max-w-3xl sm:mt-16">
            <h3
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Professional Summary
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:mt-4 sm:text-base md:text-lg">
              {professionalSummary}
            </p>
          </div>
        ) : null}

        {quickInfo.length > 0 ? (
          <div className="mt-10 sm:mt-14">
            <h3
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Quick Information
            </h3>
            <div className="mt-5 grid gap-3 sm:mt-6 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
              {quickInfo.map((item, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-primary)]">
                    {str(item.label)}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-text)] whitespace-pre-line">
                    {str(item.value)}
                  </p>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {whyChoose.length > 0 ? (
          <div className="mt-10 sm:mt-14">
            <h3
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {str(config.whyChooseTitle, "Why Choose Dr. Samavia?")}
            </h3>
            <ul className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3">
              {whyChoose.map((item, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text)]"
                >
                  <span className="mt-0.5 text-[var(--color-primary)]">✓</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {(mission || vision) && (
          <div className="mt-10 grid gap-4 sm:mt-14 sm:gap-6 md:grid-cols-2">
            {mission ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                  {mission}
                </p>
              </div>
            ) : null}
            {vision ? (
              <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
                <h3 className="text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                  Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                  {vision}
                </p>
              </div>
            ) : null}
          </div>
        )}

        {values.length > 0 ? (
          <div className="mt-10 sm:mt-14">
            <h3
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Core Values
            </h3>
            <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
              {values.map((v) => (
                <span
                  key={v}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2 text-sm text-[var(--color-text)]"
                >
                  {v}
                </span>
              ))}
            </div>
          </div>
        ) : null}

        {stats.length > 0 ? (
          <div className="mt-10 sm:mt-14">
            <h3
              className="text-xl sm:text-2xl md:text-3xl"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              {str(config.statsTitle, "Statistics")}
            </h3>
            <p className="mt-2 text-xs text-[var(--color-text-muted)]">
              Update these figures anytime from the admin panel before publishing.
            </p>
            <ul className="mt-5 grid gap-2.5 sm:mt-6 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
              {stats.map((s, i) => (
                <li
                  key={i}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm font-medium text-[var(--color-text)]"
                >
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </SectionContainer>
    </MotionSection>
  );
}

export function ServicesSection({ config, theme, layoutStyle = 2 }: SectionProps) {
  const title = str(config.title, "Diet plans");
  const subtitle = str(config.subtitle);
  const items = arr<{
    id?: string;
    title?: string;
    description?: string;
    icon?: string;
    image?: string;
    href?: string;
    badge?: string;
    meta?: string;
    tags?: string[];
  }>(config.items);
  const padding = sectionPadding(str(config.paddingY), theme.style?.spacing);
  const style = sectionBackground(str(config.background), theme);

  return (
    <MotionSection
      id="services"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(`relative ${padding}`)}
      style={style}
    >
      <SectionContainer className="relative">
        <div className="max-w-2xl">
          {subtitle ? (
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {subtitle}
            </p>
          ) : null}
          <h2
            className="mt-2 text-2xl sm:mt-3 sm:text-3xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
        </div>
        <StaggerChildren
          theme={theme}
          className={`mt-8 grid gap-5 sm:mt-12 sm:gap-8 ${
            layoutStyle === 2
              ? "sm:grid-cols-2 lg:grid-cols-3"
              : "sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {items.map((item, i) => {
            const iconKey = str(item.icon, "default");
            const img = mediaUrl(str(item.image));
            const tags = arr<string>(item.tags);
            const anchor = str(item.id, `plan-${i}`);
            return (
              <StaggerItem
                key={anchor}
                theme={theme}
                className={`${cardClass(theme)} group relative flex h-full flex-col overflow-hidden`}
                style={{
                  borderRadius: "var(--radius)",
                  ...cardShadow(theme),
                  scrollMarginTop: "6rem",
                }}
              >
                <div id={anchor} className="absolute -top-24" aria-hidden />
                <a
                  href={str(item.href, "#contact")}
                  className="flex h-full flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--color-surface)]">
                    {img ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={img}
                        alt={str(item.title, "Diet plan")}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-3xl text-[var(--color-primary)]">
                        {ICONS[iconKey] ?? ICONS.default}
                      </div>
                    )}
                    {str(item.badge) ? (
                      <span className="absolute left-3 top-3 rounded-lg bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                        {str(item.badge)}
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3
                      className="text-xl"
                      style={{ fontFamily: "var(--font-heading)" }}
                    >
                      {str(item.title, "Plan")}
                    </h3>
                    {str(item.meta) ? (
                      <p className="mt-2 text-xs font-medium text-[var(--color-primary)]">
                        {str(item.meta)}
                      </p>
                    ) : null}
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--color-text-muted)]">
                      {str(item.description)}
                    </p>
                    {tags.length > 0 ? (
                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-lg border border-[var(--color-border)] px-2.5 py-0.5 text-[11px] text-[var(--color-text-muted)]"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <span className="mt-5 text-sm font-semibold text-[var(--color-primary)] transition group-hover:translate-x-1">
                      Choose this plan →
                    </span>
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </SectionContainer>
    </MotionSection>
  );
}

export function TestimonialsSection({
  config,
  theme,
  layoutStyle = 3,
}: SectionProps) {
  const title = str(config.title, "Testimonials");
  const subtitle = str(config.subtitle);
  const items = arr<import("@/lib/types").TestimonialItem>(config.items);
  const padding = sectionPadding(str(config.paddingY), theme.style?.spacing);
  const style = sectionBackground(str(config.background), theme);

  return (
    <MotionSection
      id="testimonials"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(padding)}
      style={style}
    >
      <SectionContainer>
        <div className="max-w-2xl">
          {subtitle ? (
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[var(--color-primary)]">
              {subtitle}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl sm:mt-3 sm:text-3xl md:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h2>
        </div>
        <StaggerChildren
          theme={theme}
          className="mt-8 grid gap-5 sm:mt-12 sm:gap-7 md:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((item, i) => {
            const avatar = mediaUrl(str(item.avatar));
            const rating = typeof item.rating === "number" ? item.rating : 5;
            return (
              <StaggerItem
                key={i}
                theme={theme}
                className={`${cardClass(theme)} flex flex-col p-7`}
                style={{ borderRadius: "var(--radius)", ...cardShadow(theme) }}
              >
                <p className="text-[var(--color-accent)]" aria-label={`${rating} stars`}>
                  {"★".repeat(Math.min(5, Math.max(0, rating)))}
                </p>
                <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed text-[var(--color-text-muted)]">
                  &ldquo;{str(item.quote)}&rdquo;
                </blockquote>
                <footer className="mt-6 flex items-center gap-3 border-t border-[var(--color-border)] pt-5">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" className="h-11 w-11 rounded-full object-cover" />
                  ) : (
                    <span
                      className="flex h-11 w-11 items-center justify-center text-sm font-semibold"
                      style={{
                        borderRadius: "50%",
                        background: "color-mix(in srgb, var(--color-primary) 16%, transparent)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {str(item.author, "?").charAt(0)}
                    </span>
                  )}
                  <div>
                    <cite className="not-italic font-semibold">{str(item.author)}</cite>
                    {item.role ? (
                      <p className="text-sm text-[var(--color-text-muted)]">{item.role}</p>
                    ) : null}
                  </div>
                </footer>
              </StaggerItem>
            );
          })}
        </StaggerChildren>
      </SectionContainer>
    </MotionSection>
  );
}
