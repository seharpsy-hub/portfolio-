"use client";

import { SectionContainer } from "@/components/SectionContainer";
import { MotionSection, StaggerChildren, StaggerItem } from "@/components/MotionSection";
import { arr, sectionBackground, sectionPadding, sectionShell, str } from "@/lib/theme";
import type { Theme } from "@/lib/types";

interface Props {
  config: Record<string, unknown>;
  theme: Theme;
  layoutStyle?: number;
}

export function FaqSection({ config, theme, layoutStyle = 0 }: Props) {
  const title = str(config.title, "Frequently Asked Questions");
  const subtitle = str(config.subtitle);
  const items = arr<{ question?: string; answer?: string }>(config.items);
  const padding = sectionPadding(str(config.paddingY), theme.style?.spacing);
  const style = sectionBackground(str(config.background, "surface"), theme);

  return (
    <MotionSection
      id="faq"
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
          <h2
            className="mt-2 text-2xl sm:mt-3 sm:text-3xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
        </div>
        <StaggerChildren theme={theme} className="mt-8 space-y-3 sm:mt-10">
          {items.map((item, i) => (
            <StaggerItem
              key={i}
              theme={theme}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3.5 sm:px-5 sm:py-4"
            >
              <details className="group">
                <summary className="cursor-pointer list-none text-[15px] font-semibold text-[var(--color-text)] marker:content-none sm:text-base [&::-webkit-details-marker]:hidden">
                  <span className="flex items-start justify-between gap-3 sm:gap-4">
                    <span className="min-w-0 flex-1 pr-1">{str(item.question)}</span>
                    <span className="mt-0.5 shrink-0 text-[var(--color-primary)] transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-muted)] md:text-base">
                  {str(item.answer)}
                </p>
              </details>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </SectionContainer>
    </MotionSection>
  );
}
