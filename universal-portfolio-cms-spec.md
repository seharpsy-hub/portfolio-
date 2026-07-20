# Universal Portfolio CMS — Project Specification

**Version:** 1.0
**Type:** Multi-Niche Website Generator & CMS Platform
**Prepared for:** Development (Cursor-ready)
**Status:** Planning / Pre-Development

---

## 1. Project Overview

The Universal Portfolio CMS is a fully dynamic website generator. A single codebase renders websites for any business niche (dentist, agency, gym, SaaS company, restaurant, etc.) purely from database-driven configuration. No frontend code changes are required to launch a new site — only content and configuration change.

**Core principle:** *Frontend = Renderer only.* All content, styling, layout, section order, visibility, and behavior come from the database via the admin panel.

---

## 2. Goals

- Admin can build/edit a complete website without a developer.
- One architecture supports unlimited themes and unlimited industries.
- Every visual and structural element (text, images, colors, fonts, sections, animations, SEO, forms) is editable from the CMS.
- System is extensible toward a multi-tenant SaaS product in later phases.

---

## 3. Recommended Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 14 (App Router, SSR/SSG) |
| Backend/API | FastAPI (Python) |
| Database | PostgreSQL (JSONB for dynamic section config) |
| Caching | Redis |
| Media Storage | S3-compatible bucket (or Cloudinary) |
| Auth | JWT + Role-Based Access Control |
| Admin Panel | Next.js (separate app or `/admin` route group) |
| Animation | Framer Motion / GSAP (config-driven) |
| Search/Analytics | GA4, GTM, Meta Pixel integrations |
| Deployment | Vercel (frontend) + Docker/VPS (API) |

> This stack aligns with your existing toolset (FastAPI, PostgreSQL, Python). Adjust if a different frontend framework is preferred.

---

## 4. Core Architecture

```
Admin Panel (Next.js)
        │
        ▼
   FastAPI (REST/GraphQL)
        │
        ▼
PostgreSQL (Site, Page, Section, Content tables)
        │
        ▼
  Media Storage (S3)
        │
        ▼
Frontend Renderer (Next.js) — reads config, renders sections dynamically
```

**Key design rule:** Every page = an ordered list of "Section" records. Every Section = a `type` + a JSONB `config` payload. The frontend has one renderer component per section type; content is never hardcoded.

---

## 5. Data Model (High-Level)

- **Site** — niche, domain, theme_id, language(s), status
- **Theme** — colors, fonts, spacing, border-radius, animation style, mode (light/dark)
- **Page** — slug, SEO meta, section order
- **Section** — type (hero, about, services, pricing, etc.), config (JSON), visibility, order, animation settings
- **Service / Portfolio Item / Testimonial / Team Member / Pricing Plan / Blog Post** — niche-agnostic repeatable content models, each with SEO fields
- **Form** — dynamic fields, webhook/email/CRM targets
- **Media** — file, alt text, folder, type
- **User** — role (Admin, Editor, Content Manager, Developer), 2FA, activity log

---

## 6. Feature Modules (from R&D Document)

### 6.1 Global Sections (all optional, show/hide/duplicate/reorder)
Header, Hero, About, Services, Why Choose Us, Process, Features, Gallery, Portfolio, Pricing, Testimonials, FAQ, Team, Blog, Contact, Footer.

### 6.2 Section-Level Controls (applies to every section)
Title, subtitle, description, images, background image/video, animation, padding/margin, buttons + links, gradient, overlay, border radius, typography, cards, icons, color, dark/light mode.

### 6.3 Content Modules
- **Hero:** headline, sub-heading, typing effect, CTAs, background (video/particles/gradient), stats, trust badges, client logos, floating cards, shapes
- **About:** image, experience years, mission/vision, timeline, counters, video popup, certificates, awards
- **Services:** unlimited entries, icon/title/description/image/button/slug/SEO, layout switch (grid/slider/cards/tabs/accordion)
- **Portfolio:** category, gallery, videos, tech stack, client, duration, country, case study, before/after, project URL
- **Testimonials:** photo/video, rating, company, position, country, layout switch
- **Team:** photo, bio, social links, experience, skills, certificates, department
- **Pricing:** monthly/yearly, features, highlight/popular badge, discount
- **Blog:** categories, tags, author, SEO, rich text, media, comments, related posts, search
- **Contact:** address, map, phone, email, WhatsApp, Telegram, hours, inquiry/appointment forms, newsletter
- **Footer:** logo, menus, social links, copyright, policies, newsletter, app links

### 6.4 Theme Engine
Primary/secondary/accent colors, fonts, border radius, shadows, spacing, container width, animation style, dark/light mode, style presets (glassmorphism, minimal, corporate, medical, luxury).

### 6.5 Animation Engine
Per-section: type, delay, duration, scroll animation, hover animation, parallax, mouse movement — powered by Lottie / GSAP / Framer Motion, all admin-selectable.

### 6.6 Layout Builder
Move/clone/hide sections, create and duplicate landing pages, custom URLs.

### 6.7 SEO Manager
Global/page/blog/service SEO, schema markup, Open Graph, Twitter Cards, canonical URLs, redirects, sitemap, robots.txt.

### 6.8 Analytics Integrations
Meta Pixel, GTM, GA4, Microsoft Clarity, Search Console.

### 6.9 Media Library
Images, videos, PDFs, SVGs, folders, compression, crop/resize, alt text, lazy loading.

### 6.10 Form Builder
Drag-and-drop fields (text, email, phone, select, checkbox, radio, file, date, time, signature), webhook, email notification, CRM integration.

### 6.11 Multi-Language
English, Arabic, French, German, Spanish, Urdu — dynamic translation, RTL support.

### 6.12 Performance
Lazy loading, image optimization, code splitting, caching, CDN-ready, SSR/SSG, Core Web Vitals optimization.

### 6.13 Security & Access
Role-based access (Admin, Editor, Content Manager, Developer), 2FA, activity logs, backups.

### 6.14 Analytics Dashboard
Visitors, traffic sources, top pages, conversions, form submissions, downloads, clicks, heatmaps, SEO rankings.

---

## 7. Phased Roadmap

### Phase 1 — MVP Foundation (Build First)
- Core data models: Site, Page, Section, Theme, Media
- Dynamic section renderer (Hero, About, Services, Testimonials, Contact, Footer only)
- Basic admin panel: create/edit/reorder/show-hide sections
- Basic theme engine (colors, fonts)
- One working niche demo site end-to-end

### Phase 2 — Content Depth
- Portfolio, Pricing, Team, Blog CMS
- Form Builder + webhook/email notifications
- Media Library (upload, crop, alt text)
- SEO Manager (meta, OG, sitemap)

### Phase 3 — Polish & Engine Expansion
- Animation Engine (scroll, hover, parallax)
- Full Theme Engine (presets, dark/light, glassmorphism etc.)
- Layout Builder (clone/duplicate landing pages)
- Analytics integrations (GA4, GTM, Meta Pixel, Clarity)

### Phase 4 — Scale & Access Control
- Role-based access + 2FA + activity logs
- Multi-language + RTL support
- Analytics dashboard (visitors, conversions, heatmaps)
- Performance hardening (CDN, caching, Core Web Vitals)

### Phase 5 — Future Expansion (Not MVP)
- Multi-tenant SaaS mode
- AI Content Generator / AI Image Generator / AI SEO Assistant
- Template Marketplace
- White-label support
- One-click website creation

---

## 8. Non-Functional Requirements

- No hardcoded content anywhere in the frontend render path.
- Every section type must degrade gracefully if config fields are missing (sane defaults).
- Admin changes should reflect on the live site without a redeploy (ISR/on-demand revalidation or SSR).
- System must support launching a new niche site by content/config only — zero code changes.

---

## 9. Open Decisions (to confirm before build starts)

- [ ] Single shared frontend serving all sites vs. one deployment per site
- [ ] Multi-tenant from day one, or single-tenant MVP first (recommended: single-tenant MVP, per Phase 1)
- [ ] Rich text editor choice for Blog (e.g., Tiptap vs. Lexical)
- [ ] Hosting/domain strategy per generated site (subdomain, custom domain, or both)

---

## 10. Next Steps

1. Lock Phase 1 scope (Section types + Admin CRUD).
2. Design PostgreSQL schema for Site/Page/Section/Theme/Media.
3. Build section-type renderer components in Next.js.
4. Build minimal admin CRUD UI for sections.
5. Ship one working demo niche site to validate the architecture before adding Phase 2 modules.
