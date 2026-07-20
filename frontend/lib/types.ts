export type SectionType =
  | "hero"
  | "about"
  | "services"
  | "testimonials"
  | "contact"
  | "footer"
  | "profile"
  | "faq";

export type ProfileRole = "dr" | "owner" | "student" | "agency" | "company";

export interface ThemeColors {
  primary?: string;
  secondary?: string;
  accent?: string;
  background?: string;
  surface?: string;
  text?: string;
  textMuted?: string;
  border?: string;
  heroFrom?: string;
  heroTo?: string;
}

export interface ThemeFonts {
  heading?: string;
  body?: string;
}

export interface ThemeStyle {
  shadow?: string;
  shadowSm?: string;
  containerWidth?: string;
  spacing?: "compact" | "comfortable" | "airy" | string;
  buttonStyle?: string;
  cardStyle?: string;
  glass?: boolean;
  heroPattern?: string;
  blur?: string;
}

export interface ThemeAnimation {
  entrance?: "fade-up" | "fade-in" | "slide-left" | "scale-in" | string;
  duration?: number;
  distance?: number;
  stagger?: number;
  hover?: "lift" | "glow" | "none" | string;
  heroMotion?: string;
}

export interface Theme {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  preset: string;
  mode: "light" | "dark";
  colors: ThemeColors;
  fonts: ThemeFonts;
  border_radius: string;
  style: ThemeStyle;
  animation: ThemeAnimation;
}

export interface Site {
  id: string;
  name: string;
  slug: string;
  niche?: string | null;
  theme_id?: string | null;
  status: string;
  settings: Record<string, unknown>;
  theme?: Theme | null;
}

export interface Page {
  id: string;
  site_id: string;
  title: string;
  slug: string;
  meta_title?: string | null;
  meta_description?: string | null;
  is_home: boolean;
  is_published: boolean;
}

export interface Section {
  id: string;
  page_id: string;
  type: SectionType;
  config: Record<string, unknown>;
  sort_order: number;
  is_visible: boolean;
}

export interface PublicPagePayload {
  site: Site;
  page: Page;
  sections: Section[];
  theme: Theme | null;
}

export interface CtaLink {
  label?: string;
  href?: string;
}

export interface ServiceItem {
  title?: string;
  description?: string;
  icon?: string;
  image?: string;
  href?: string;
}

export interface TestimonialItem {
  quote?: string;
  author?: string;
  role?: string;
  avatar?: string;
  rating?: number;
}

export interface FooterColumn {
  title?: string;
  links?: { label?: string; href?: string }[];
}

export interface SocialLink {
  platform?: string;
  href?: string;
}
