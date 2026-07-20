"use client";

import type { Section as SectionModel, Theme } from "@/lib/types";
import { mergeTheme } from "@/lib/theme";
import {
  AboutSection,
  HeroSection,
  ServicesSection,
  TestimonialsSection,
} from "./sections/HeroAbout";
import { ContactSection } from "./sections/ContactSection";
import { FooterSection } from "./sections/FooterSection";
import { ProfileSection } from "./sections/ProfileSection";
import { FaqSection } from "./sections/FaqSection";

interface Props {
  sections: SectionModel[];
  siteId: string;
  theme: Theme | null;
  dayNightMode?: "day" | "night";
}

export function SectionRenderer({ sections, siteId, theme }: Props) {
  const t = mergeTheme(theme);
  const visible = sections
    .filter((s) => s.is_visible)
    .sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="flex flex-col gap-6 sm:gap-10 md:gap-14 lg:gap-16">
      {visible.map((section, index) => {
        const key = section.id;
        const cfg = { ...section.config, layoutStyle: index % 4 };
        const layoutStyle = index % 4;
        switch (section.type) {
          case "hero":
            return (
              <HeroSection key={key} config={cfg} theme={t} layoutStyle={layoutStyle} />
            );
          case "about":
            return (
              <AboutSection key={key} config={cfg} theme={t} layoutStyle={layoutStyle} />
            );
          case "profile":
            return (
              <ProfileSection
                key={key}
                config={cfg}
                theme={t}
                layoutStyle={layoutStyle}
              />
            );
          case "services":
            return (
              <ServicesSection
                key={key}
                config={cfg}
                theme={t}
                layoutStyle={layoutStyle}
              />
            );
          case "testimonials":
            return (
              <TestimonialsSection
                key={key}
                config={cfg}
                theme={t}
                layoutStyle={layoutStyle}
              />
            );
          case "faq":
            return (
              <FaqSection key={key} config={cfg} theme={t} layoutStyle={layoutStyle} />
            );
          case "contact":
            return (
              <ContactSection
                key={key}
                config={cfg}
                siteId={siteId}
                theme={t}
                layoutStyle={layoutStyle}
              />
            );
          case "footer":
            return (
              <FooterSection key={key} config={cfg} theme={t} layoutStyle={layoutStyle} />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
