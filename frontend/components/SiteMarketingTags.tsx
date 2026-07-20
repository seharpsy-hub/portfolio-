import Script from "next/script";

type Marketing = {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  googleSearchConsole?: string;
  googleAdsId?: string;
  metaPixelId?: string;
  microsoftClarityId?: string;
  hotjarId?: string;
  customHeadHtml?: string;
};

function asMarketing(settings: Record<string, unknown> | undefined): Marketing {
  const raw = (settings?.marketing as Record<string, unknown>) ?? {};
  return {
    googleAnalyticsId: String(raw.googleAnalyticsId ?? "").trim(),
    googleTagManagerId: String(raw.googleTagManagerId ?? "").trim(),
    googleSearchConsole: String(raw.googleSearchConsole ?? "").trim(),
    googleAdsId: String(raw.googleAdsId ?? "").trim(),
    metaPixelId: String(raw.metaPixelId ?? "").trim(),
    microsoftClarityId: String(raw.microsoftClarityId ?? "").trim(),
    hotjarId: String(raw.hotjarId ?? "").trim(),
    customHeadHtml: String(raw.customHeadHtml ?? "").trim(),
  };
}

/** Inject GA, GTM, Pixel, Clarity, and optional custom head HTML on the public site. */
export function SiteMarketingTags({
  settings,
}: {
  settings?: Record<string, unknown>;
}) {
  const m = asMarketing(settings);
  const gtm = m.googleTagManagerId;
  const ga = m.googleAnalyticsId;
  const pixel = m.metaPixelId;
  const clarity = m.microsoftClarityId;
  const hotjar = m.hotjarId;

  return (
    <>
      {gtm ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">{`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${gtm}');
          `}</Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtm}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
              title="gtm"
            />
          </noscript>
        </>
      ) : null}

      {ga && !gtm ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${ga}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${ga}'${m.googleAdsId ? `, {'send_page_view': true}` : ""});
            ${m.googleAdsId ? `gtag('config', '${m.googleAdsId}');` : ""}
          `}</Script>
        </>
      ) : null}

      {pixel ? (
        <Script id="meta-pixel" strategy="afterInteractive">{`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${pixel}');
          fbq('track', 'PageView');
        `}</Script>
      ) : null}

      {clarity ? (
        <Script id="ms-clarity" strategy="afterInteractive">{`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "${clarity}");
        `}</Script>
      ) : null}

      {hotjar ? (
        <Script id="hotjar" strategy="afterInteractive">{`
          (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:${Number(hotjar) || 0},hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
          })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
        `}</Script>
      ) : null}

      {m.customHeadHtml ? (
        <div dangerouslySetInnerHTML={{ __html: m.customHeadHtml }} />
      ) : null}
    </>
  );
}

export function seoFromSettings(
  settings: Record<string, unknown> | undefined,
  fallback: { title?: string | null; description?: string | null }
) {
  const seo = (settings?.seo as Record<string, unknown>) ?? {};
  const marketing = (settings?.marketing as Record<string, unknown>) ?? {};
  const title =
    String(seo.metaTitle ?? "").trim() ||
    fallback.title ||
    "Site";
  const description =
    String(seo.metaDescription ?? "").trim() ||
    fallback.description ||
    undefined;
  const ogTitle = String(seo.ogTitle ?? "").trim() || title;
  const ogDescription =
    String(seo.ogDescription ?? "").trim() || description;
  const ogImage = String(seo.ogImage ?? "").trim() || undefined;
  const canonical = String(seo.canonicalUrl ?? "").trim() || undefined;
  const keywords = String(seo.keywords ?? "").trim() || undefined;
  const robots = String(seo.robots ?? "index,follow").trim();
  const gsc = String(marketing.googleSearchConsole ?? "").trim();
  const favicon =
    String(settings?.favicon_url ?? "").trim() ||
    String(settings?.logo_url ?? "").trim() ||
    undefined;
  const api = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";
  const iconUrl = favicon
    ? favicon.startsWith("http")
      ? favicon
      : `${api}${favicon.startsWith("/") ? "" : "/"}${favicon}`
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    ...(canonical ? { alternates: { canonical } } : {}),
    ...(keywords ? { keywords } : {}),
    robots,
    ...(gsc ? { verification: { google: gsc } } : {}),
    ...(iconUrl
      ? {
          icons: {
            icon: [{ url: iconUrl }],
            apple: [{ url: iconUrl }],
          },
        }
      : {}),
  };
}
