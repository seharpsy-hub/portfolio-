import { googleFontParam } from "@/lib/theme";

/** Inject Google Fonts for the active theme (heading + body). */
export function ThemeFontLinks({
  heading,
  body,
}: {
  heading: string;
  body: string;
}) {
  const families = Array.from(new Set([heading, body].filter(Boolean)));
  const query = families
    .map((f) => `family=${googleFontParam(f)}:wght@300;400;500;600;700`)
    .join("&");
  const href = `https://fonts.googleapis.com/css2?${query}&display=swap`;

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      {/* eslint-disable-next-line @next/next/no-page-custom-font */}
      <link href={href} rel="stylesheet" />
    </>
  );
}
