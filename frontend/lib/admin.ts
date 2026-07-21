import type { SectionType } from "@/lib/types";

export const SECTION_TYPES: SectionType[] = [
  "hero",
  "profile",
  "about",
  "services",
  "testimonials",
  "faq",
  "contact",
  "footer",
];

/** Friendly labels for admin UI */
export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero banner",
  profile: "Consultant Nutritionist & Dietitan / Profile",
  about: "About story",
  services: "Diet plans",
  testimonials: "Reviews",
  faq: "FAQ",
  contact: "Contact form",
  footer: "Footer",
};

export const PROFILE_ROLES = [
  { value: "dr", label: "Consultant Nutritionist & Dietitan" },
  { value: "owner", label: "Owner" },
  { value: "student", label: "Student" },
  { value: "agency", label: "Agency" },
  { value: "company", label: "Company" },
] as const;

export function defaultConfig(type: SectionType): Record<string, unknown> {
  switch (type) {
    case "hero":
      return {
        eyebrow: "",
        headline: "Headline",
        subheadline: "",
        ctaPrimary: { label: "", href: "#" },
        ctaSecondary: { label: "", href: "#" },
        backgroundImage: "",
        overlayOpacity: 0.55,
        overlayColor: "#1A2E05",
        planChips: [],
        stats: [],
        floatCards: [],
        paddingY: "lg",
        background: "primary",
      };
    case "about":
      return {
        title: "About",
        subtitle: "",
        body: "",
        image: "",
        imagePosition: "right",
        highlights: [],
        paddingY: "md",
        background: "default",
      };
    case "services":
      return {
        title: "Services",
        subtitle: "",
        layout: "grid",
        items: [],
        paddingY: "md",
        background: "surface",
      };
    case "testimonials":
      return {
        title: "Testimonials",
        subtitle: "",
        items: [],
        paddingY: "md",
        background: "default",
      };
    case "contact":
      return {
        title: "Contact",
        subtitle: "",
        address: "",
        phone: "",
        email: "",
        hours: "",
        formEnabled: true,
        formFields: ["name", "email", "message"],
        paddingY: "md",
        background: "surface",
      };
    case "footer":
      return {
        tagline: "",
        logoUrl: "",
        description: "",
        cta: { label: "Book Your Consultation", href: "#contact" },
        columns: [],
        social: [],
        copyright: "",
        policyLinks: [],
        paddingY: "lg",
        background: "primary",
      };
    case "profile":
      return {
        role: "dr",
        eyebrow: "Meet your Consultant Nutritionist & Dietitan",
        badge: "Consultant Nutritionist & Dietitan",
        name: "Dr. Samavia",
        title: "Clinical Dietitian & Nutritionist",
        description:
          "Helping individuals achieve healthier lifestyles through personalized nutrition care.",
        image: "",
        credentials: ["BS Dietetics & Nutrition", "Clinical Nutrition", "Diet Planning"],
        cta: { label: "Book Your Consultation", href: "#contact" },
        paddingY: "lg",
        background: "default",
      };
    case "faq":
      return {
        title: "Frequently Asked Questions",
        subtitle: "Common questions",
        items: [
          {
            question: "Do I need a consultation before receiving a diet plan?",
            answer:
              "Yes. Every nutrition plan is prepared after understanding your health condition, lifestyle, and personal goals.",
          },
        ],
        paddingY: "md",
        background: "surface",
      };
    default:
      return {};
  }
}

export const TOKEN_KEY = "portfolio_cms_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}
