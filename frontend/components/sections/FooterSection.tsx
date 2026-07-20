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

export function FooterSection({ config, theme, layoutStyle = 0 }: Props) {
  const tagline = str(config.tagline);
  const logo = mediaUrl(str(config.logoUrl));
  const columns = arr<FooterColumn>(config.columns);
  const social = arr<SocialLink>(config.social);
  const copyright = str(config.copyright);
  const policyLinks = arr<{ label?: string; href?: string }>(config.policyLinks);
  const padding = sectionPadding(str(config.paddingY, "md"), theme.style?.spacing);
  const style = sectionBackground(str(config.background, "primary"), theme);
  const onPrimary = str(config.background, "primary") === "primary";

  return (
    <MotionSection
      id="footer"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(padding)}
      style={style}
      entrance="fade-in"
    >
      <SectionContainer>
        <div className="flex flex-col gap-8 sm:gap-10 md:flex-row md:justify-between">
          <div>
            {logo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={logo} alt="" className="h-9 w-auto sm:h-10" />
            ) : tagline ? (
              <p className="text-lg sm:text-xl" style={{ fontFamily: "var(--font-heading)" }}>
                {tagline}
              </p>
            ) : null}
          </div>
          <div className="grid gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-3">
            {columns.map((col, i) => (
              <div key={i}>
                <p className="text-sm font-semibold uppercase tracking-wide opacity-80">
                  {str(col.title)}
                </p>
                <ul className="mt-4 space-y-2">
                  {arr<{ label?: string; href?: string }>(col.links).map((link, j) => (
                    <li key={j}>
                      <a
                        href={str(link.href, "#")}
                        className="text-sm opacity-90 transition hover:opacity-100"
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
        {social.length > 0 ? (
          <ul className="mt-10 flex gap-4">
            {social.map((s, i) => (
              <li key={i}>
                <a
                  href={str(s.href, "#")}
                  className="text-sm capitalize underline-offset-4 hover:underline"
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {str(s.platform)}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
        <div
          className={`mt-8 flex flex-col gap-3 border-t pt-6 text-sm sm:mt-10 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-4 sm:pt-8 ${
            onPrimary ? "border-white/20" : "border-[var(--color-border)]"
          }`}
        >
          <p className="text-xs sm:text-sm">{copyright}</p>
          <ul className="flex flex-wrap gap-3 sm:gap-4">
            {policyLinks.map((l, i) => (
              <li key={i}>
                <a href={str(l.href, "#")} className="hover:underline">
                  {str(l.label)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </SectionContainer>
    </MotionSection>
  );
}
