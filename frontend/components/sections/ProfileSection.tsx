"use client";

import { mediaUrl } from "@/lib/api";
import { SectionContainer } from "@/components/SectionContainer";
import {
  arr,
  sectionBackground,
  sectionPadding,
  sectionShell,
  str,
} from "@/lib/theme";
import type { Theme } from "@/lib/types";
import { MotionSection, StaggerChildren, StaggerItem } from "@/components/MotionSection";

const ROLE_LABELS: Record<string, string> = {
  dr: "Doctor",
  owner: "Owner",
  student: "Student",
  agency: "Agency",
  company: "Company",
};

interface Props {
  config: Record<string, unknown>;
  theme: Theme;
  layoutStyle?: number;
}

export function ProfileSection({ config, theme, layoutStyle = 1 }: Props) {
  const role = str(config.role, "dr").toLowerCase();
  const roleLabel = ROLE_LABELS[role] ?? "Professional";
  const name = str(config.name, "Dr. Name");
  const title = str(config.title, "Title");
  const description = str(config.description);
  const image = mediaUrl(str(config.image));
  const credentials = arr<string>(config.credentials);
  const cta = (config.cta as { label?: string; href?: string }) ?? {};
  const padding = sectionPadding(str(config.paddingY, "lg"), theme.style?.spacing);
  const style = sectionBackground(str(config.background, "default"), theme);

  return (
    <MotionSection
      id="profile"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(padding)}
      style={style}
    >
      <SectionContainer className="grid items-center gap-8 sm:gap-10 md:grid-cols-[0.9fr_1.1fr] md:gap-12">
        <div className="relative mx-auto w-full max-w-sm md:mx-0 md:max-w-none">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={image}
              alt={name}
              className="aspect-[4/5] max-h-[420px] w-full object-cover md:max-h-none"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
            />
          ) : (
            <div
              className="flex aspect-[4/5] max-h-[420px] w-full items-end bg-[var(--color-surface)] p-6 sm:p-8 md:max-h-none"
              style={{ borderRadius: "var(--radius)", boxShadow: "var(--shadow)" }}
            >
              <p
                className="text-4xl text-[var(--color-primary)]"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                {name.charAt(0)}
              </p>
            </div>
          )}
          <span className="absolute left-3 top-3 rounded-xl bg-[var(--color-primary)] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white sm:left-4 sm:top-4 sm:px-3 sm:py-1.5 sm:text-[11px]">
            {roleLabel}
          </span>
        </div>

        <div className="min-w-0 text-center md:text-left">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.22em]">
            Meet your {roleLabel.toLowerCase()}
          </p>
          <h2
            className="mt-2 text-2xl leading-tight text-[var(--color-text)] sm:mt-3 sm:text-3xl md:text-5xl"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {name}
          </h2>
          <p className="mt-2 text-base font-medium text-[var(--color-text-muted)] sm:mt-3 sm:text-lg">
            {title}
          </p>
          {description ? (
            <p className="mt-4 text-[15px] leading-relaxed text-[var(--color-text-muted)] sm:mt-6 sm:text-base md:text-lg">
              {description}
            </p>
          ) : null}

          {credentials.length > 0 ? (
            <StaggerChildren
              theme={theme}
              className="mt-6 flex flex-wrap justify-center gap-2 sm:mt-8 md:justify-start"
            >
              {credentials.map((c) => (
                <StaggerItem
                  key={c}
                  theme={theme}
                  className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1.5 text-xs font-medium text-[var(--color-text)]"
                >
                  {c}
                </StaggerItem>
              ))}
            </StaggerChildren>
          ) : null}

          {str(cta.label) ? (
            <a
              href={str(cta.href, "#contact")}
              className="mt-8 inline-flex w-full items-center justify-center px-7 py-3.5 text-sm font-semibold text-white transition hover:brightness-110 sm:mt-10 sm:w-auto"
              style={{
                borderRadius: "var(--radius)",
                background: "var(--color-primary)",
                boxShadow: "var(--shadow-sm)",
              }}
            >
              {str(cta.label)}
            </a>
          ) : null}
        </div>
      </SectionContainer>
    </MotionSection>
  );
}
