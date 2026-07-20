import { notFound } from "next/navigation";
import { PublicSiteView } from "@/components/PublicSiteView";
import { SiteMarketingTags, seoFromSettings } from "@/components/SiteMarketingTags";
import { ThemeFontLinks } from "@/components/ThemeFontLinks";
import { fetchPublicPage } from "@/lib/api";
import { mergeTheme } from "@/lib/theme";

export const dynamic = "force-dynamic";

interface Props {
  params: { siteSlug: string; pageSlug: string };
}

export async function generateMetadata({ params }: Props) {
  try {
    const data = await fetchPublicPage(params.siteSlug, params.pageSlug);
    return seoFromSettings(data.site.settings, {
      title: data.page.meta_title ?? data.page.title,
      description: data.page.meta_description,
    });
  } catch {
    return { title: "Site" };
  }
}

export default async function PublicSitePage({ params }: Props) {
  let data;
  try {
    data = await fetchPublicPage(params.siteSlug, params.pageSlug);
  } catch {
    notFound();
  }

  const theme = mergeTheme(data.theme);

  return (
    <>
      <ThemeFontLinks
        heading={theme.fonts.heading ?? "Fraunces"}
        body={theme.fonts.body ?? "DM Sans"}
      />
      <SiteMarketingTags settings={data.site.settings} />
      <PublicSiteView site={data.site} sections={data.sections} theme={theme} />
    </>
  );
}
