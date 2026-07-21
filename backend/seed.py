"""Seed nutritionist demo + themes (includes Verdant Nourish)."""

import uuid
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.database import SessionLocal
from app.models import Theme, Site, Page, Section

THEMES = [
    {
        "name": "Verdant Nourish",
        "slug": "verdant-nourish",
        "description": "Fresh wellness — leafy greens, soft citrus, calm nutrition studio.",
        "preset": "wellness",
        "mode": "light",
        "border_radius": "18px",
        "colors": {
            "primary": "#3F6212",
            "secondary": "#1A2E05",
            "accent": "#F4A261",
            "background": "#F7FBF4",
            "surface": "#EAF5E0",
            "text": "#1C1917",
            "textMuted": "#57534E",
            "border": "#C8E0B0",
            "heroFrom": "#3F6212",
            "heroTo": "#65A30D",
        },
        "fonts": {"heading": "Fraunces", "body": "DM Sans"},
        "style": {
            "shadow": "0 22px 50px rgba(63, 98, 18, 0.14)",
            "shadowSm": "0 8px 24px rgba(63, 98, 18, 0.1)",
            "containerWidth": "72rem",
            "spacing": "airy",
            "buttonStyle": "solid",
            "cardStyle": "elevated",
            "glass": False,
            "heroPattern": "soft-blobs",
        },
        "animation": {
            "entrance": "fade-up",
            "duration": 0.75,
            "distance": 36,
            "stagger": 0.1,
            "hover": "lift",
            "heroMotion": "float",
        },
    },
    {
        "name": "Teal Clinical",
        "slug": "teal-clinical",
        "description": "Calm medical aesthetic — trust, clarity, soft surfaces.",
        "preset": "medical",
        "mode": "light",
        "border_radius": "14px",
        "colors": {
            "primary": "#0F766E",
            "secondary": "#134E4A",
            "accent": "#F59E0B",
            "background": "#FAFFFE",
            "surface": "#F0FDFA",
            "text": "#0F172A",
            "textMuted": "#64748B",
            "border": "#99F6E4",
            "heroFrom": "#0F766E",
            "heroTo": "#115E59",
        },
        "fonts": {"heading": "Fraunces", "body": "DM Sans"},
        "style": {
            "shadow": "0 18px 40px rgba(15, 118, 110, 0.12)",
            "shadowSm": "0 4px 14px rgba(15, 23, 42, 0.06)",
            "containerWidth": "72rem",
            "spacing": "comfortable",
            "buttonStyle": "solid",
            "cardStyle": "elevated",
            "glass": False,
            "heroPattern": "soft-blobs",
        },
        "animation": {
            "entrance": "fade-up",
            "duration": 0.7,
            "distance": 28,
            "stagger": 0.08,
            "hover": "lift",
            "heroMotion": "reveal",
        },
    },
    {
        "name": "Noir Atelier",
        "slug": "noir-atelier",
        "description": "Dark luxury — gold accents, editorial serif, quiet drama.",
        "preset": "luxury",
        "mode": "dark",
        "border_radius": "4px",
        "colors": {
            "primary": "#C9A227",
            "secondary": "#0B0B0C",
            "accent": "#E8D5A3",
            "background": "#0B0B0C",
            "surface": "#161618",
            "text": "#F5F0E8",
            "textMuted": "#A39E94",
            "border": "#2A2A2E",
            "heroFrom": "#0B0B0C",
            "heroTo": "#1A1510",
        },
        "fonts": {"heading": "Cormorant Garamond", "body": "Outfit"},
        "style": {
            "shadow": "0 24px 60px rgba(0, 0, 0, 0.55)",
            "shadowSm": "0 2px 10px rgba(201, 162, 39, 0.08)",
            "containerWidth": "70rem",
            "spacing": "airy",
            "buttonStyle": "outline-gold",
            "cardStyle": "bordered",
            "glass": False,
            "heroPattern": "grain",
        },
        "animation": {
            "entrance": "fade-in",
            "duration": 0.9,
            "distance": 16,
            "stagger": 0.12,
            "hover": "glow",
            "heroMotion": "slow-rise",
        },
    },
    {
        "name": "Apex Corporate",
        "slug": "apex-corporate",
        "description": "Sharp professional blue — confident, structured, boardroom-ready.",
        "preset": "corporate",
        "mode": "light",
        "border_radius": "8px",
        "colors": {
            "primary": "#1D4ED8",
            "secondary": "#0F172A",
            "accent": "#0EA5E9",
            "background": "#FFFFFF",
            "surface": "#F1F5F9",
            "text": "#0F172A",
            "textMuted": "#475569",
            "border": "#CBD5E1",
            "heroFrom": "#0F172A",
            "heroTo": "#1E3A8A",
        },
        "fonts": {"heading": "Libre Baskerville", "body": "Plus Jakarta Sans"},
        "style": {
            "shadow": "0 12px 32px rgba(15, 23, 42, 0.1)",
            "shadowSm": "0 2px 8px rgba(15, 23, 42, 0.06)",
            "containerWidth": "74rem",
            "spacing": "compact",
            "buttonStyle": "solid",
            "cardStyle": "flat-border",
            "glass": False,
            "heroPattern": "grid",
        },
        "animation": {
            "entrance": "slide-left",
            "duration": 0.55,
            "distance": 36,
            "stagger": 0.06,
            "hover": "lift",
            "heroMotion": "reveal",
        },
    },
    {
        "name": "Quiet Minimal",
        "slug": "quiet-minimal",
        "description": "Warm stone minimalism — restraint, whitespace, soft motion.",
        "preset": "minimal",
        "mode": "light",
        "border_radius": "0px",
        "colors": {
            "primary": "#44403C",
            "secondary": "#1C1917",
            "accent": "#A8A29E",
            "background": "#FAFAF9",
            "surface": "#F5F5F4",
            "text": "#1C1917",
            "textMuted": "#78716C",
            "border": "#E7E5E4",
            "heroFrom": "#FAFAF9",
            "heroTo": "#F5F5F4",
        },
        "fonts": {"heading": "Newsreader", "body": "Instrument Sans"},
        "style": {
            "shadow": "none",
            "shadowSm": "none",
            "containerWidth": "64rem",
            "spacing": "airy",
            "buttonStyle": "underline",
            "cardStyle": "naked",
            "glass": False,
            "heroPattern": "none",
        },
        "animation": {
            "entrance": "fade-up",
            "duration": 0.85,
            "distance": 20,
            "stagger": 0.1,
            "hover": "none",
            "heroMotion": "slow-rise",
        },
    },
    {
        "name": "Glass Aurora",
        "slug": "glass-aurora",
        "description": "Glassmorphism + aurora gradients — modern, luminous, layered.",
        "preset": "glass",
        "mode": "dark",
        "border_radius": "20px",
        "colors": {
            "primary": "#22D3EE",
            "secondary": "#0F172A",
            "accent": "#A78BFA",
            "background": "#020617",
            "surface": "rgba(15, 23, 42, 0.55)",
            "text": "#F8FAFC",
            "textMuted": "#94A3B8",
            "border": "rgba(148, 163, 184, 0.25)",
            "heroFrom": "#0F172A",
            "heroTo": "#312E81",
        },
        "fonts": {"heading": "Syne", "body": "Space Grotesk"},
        "style": {
            "shadow": "0 20px 50px rgba(34, 211, 238, 0.15)",
            "shadowSm": "0 8px 24px rgba(167, 139, 250, 0.12)",
            "containerWidth": "72rem",
            "spacing": "comfortable",
            "buttonStyle": "gradient",
            "cardStyle": "glass",
            "glass": True,
            "heroPattern": "aurora",
            "blur": "16px",
        },
        "animation": {
            "entrance": "scale-in",
            "duration": 0.65,
            "distance": 24,
            "stagger": 0.09,
            "hover": "glow",
            "heroMotion": "float",
        },
    },
]


SECTION_CONFIGS = [
    {
        "type": "hero",
        "sort_order": 0,
        "config": {
            "eyebrow": "Eat smarter · Feel stronger · Look lighter",
            "headline": "Your plate. Your macros. Your glow-up.",
            "subheadline": "Fat-loss, high-protein, gym fuel & PCOS plans designed for real kitchens — not sad salad challenges.",
            "ctaPrimary": {"label": "Start my plan", "href": "#contact"},
            "ctaSecondary": {"label": "Explore diet plans", "href": "#services"},
            "backgroundImage": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80",
            "overlayOpacity": 0.55,
            "overlayColor": "#1A2E05",
            "paddingY": "lg",
            "background": "primary",
            "planChips": [
                {"label": "Fat Loss", "href": "#plan-fat-loss"},
                {"label": "High Protein", "href": "#plan-protein"},
                {"label": "Gym Fuel", "href": "#plan-gym"},
                {"label": "PCOS Balance", "href": "#plan-pcos"},
            ],
            "stats": [
                {"value": "2.4k+", "label": "Clients coached"},
                {"value": "92%", "label": "Stay on plan 90 days"},
                {"value": "4", "label": "Core diet plans"},
            ],
            "floatCards": [
                {"title": "Protein target", "value": "110g", "hint": "Today"},
                {"title": "Hydration", "value": "2.1L", "hint": "Goal 2.5L"},
                {"title": "Meals planned", "value": "21", "hint": "This week"},
            ],
        },
    },
    {
        "type": "profile",
        "sort_order": 1,
        "config": {
            "role": "dr",
            "name": "Ayesha Rahman, RD",
            "title": "Clinical Dietitian & Nutrition Coach",
            "description": "Board-trained dietitian helping clients master fat-loss, high-protein, gym fuel, and PCOS nutrition — with plates that still feel like home.",
            "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
            "credentials": ["RD", "Clinical Nutrition", "Sports Nutrition", "10+ years"],
            "eyebrow": "Meet your Consultant Nutritionist & Dietitan",
            "badge": "Consultant Nutritionist & Dietitan",
            "cta": {"label": "Book Your Consultation", "href": "#contact"},
            "paddingY": "lg",
            "background": "surface",
        },
    },
    {
        "type": "about",
        "sort_order": 2,
        "config": {
            "title": "Nutrition that actually tastes like life",
            "subtitle": "Registered dietitian · No food shame",
            "body": "I'm Ayesha Rahman, RD. I build meal systems around your culture, cravings, and calendar — so fat loss, muscle, and energy stop feeling like punishment. Clear targets. Gorgeous plates. Weekly coaching that sticks.",
            "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
            "imagePosition": "right",
            "highlights": [
                {"label": "Years practice", "value": "10+"},
                {"label": "Plans delivered", "value": "3.5k"},
                {"label": "Avg. energy lift", "value": "4 wks"},
            ],
            "paddingY": "lg",
            "background": "default",
        },
    },
    {
        "type": "services",
        "sort_order": 3,
        "config": {
            "title": "Pick your transformation lane",
            "subtitle": "Four signature diet plans — tap one to book",
            "layout": "grid",
            "items": [
                {
                    "id": "plan-fat-loss",
                    "title": "Fat Loss Plan",
                    "description": "Calorie-aware plates, weekly grocery lists, and gentle cardio pairing for steady fat loss without burnout.",
                    "icon": "leaf",
                    "badge": "Popular",
                    "meta": "4–12 weeks · ~1,600–2,000 kcal",
                    "tags": ["Fat loss", "Flexible carbs"],
                    "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
                    "href": "#contact",
                },
                {
                    "id": "plan-protein",
                    "title": "High Protein Plan",
                    "description": "Protein-forward meals (eggs, dairy, legumes, lean meats) to protect muscle while cutting or recomposing.",
                    "icon": "bowl",
                    "badge": "Muscle",
                    "meta": "Ongoing · 1.6–2.2g/kg protein",
                    "tags": ["Protein", "Recomp"],
                    "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
                    "href": "#contact",
                },
                {
                    "id": "plan-gym",
                    "title": "Gym Fuel Plan",
                    "description": "Pre/post workout meals, carb timing, and recovery snacks for push/pull days vs rest days.",
                    "icon": "bolt",
                    "badge": "Performance",
                    "meta": "Training synced · Macros",
                    "tags": ["Gym", "Performance"],
                    "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
                    "href": "#contact",
                },
                {
                    "id": "plan-pcos",
                    "title": "PCOS Balance Plan",
                    "description": "Lower-GI carbs, anti-inflammatory fats, and meal timing aligned with hormone-friendly habits.",
                    "icon": "heart",
                    "badge": "Clinical",
                    "meta": "8–16 weeks · Lab-guided",
                    "tags": ["PCOS", "Hormone care"],
                    "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
                    "href": "#contact",
                },
            ],
            "paddingY": "lg",
            "background": "surface",
        },
    },
    {
        "type": "testimonials",
        "sort_order": 4,
        "config": {
            "title": "Results you can feel (and taste)",
            "subtitle": "Stories from the Nourish community",
            "items": [
                {
                    "quote": "Down 9kg in 4 months and I still eat biryani on Sundays. The fat loss plan actually fits my life.",
                    "author": "Hira S.",
                    "role": "Fat Loss Plan · Teacher",
                    "avatar": "",
                    "rating": 5,
                },
                {
                    "quote": "Gym fueling finally makes sense — protein hits and energy for evening sessions.",
                    "author": "Omar F.",
                    "role": "Gym Fuel Plan · Lifter",
                    "avatar": "",
                    "rating": 5,
                },
                {
                    "quote": "PCOS symptoms are manageable and lunch crashes are gone.",
                    "author": "Nadia K.",
                    "role": "PCOS Balance · Designer",
                    "avatar": "",
                    "rating": 5,
                },
            ],
            "paddingY": "lg",
            "background": "default",
        },
    },
    {
        "type": "contact",
        "sort_order": 5,
        "config": {
            "title": "Ready for plates that love you back?",
            "subtitle": "Book a free 20-min discovery call",
            "address": "Studio 4B, Greenway Plaza · Online sessions worldwide",
            "phone": "+1 (555) 014-8820",
            "email": "hello@nourishthrive.demo",
            "whatsapp": "+15550148820",
            "hours": "Mon–Sat 9am–7pm · Virtual & in-person",
            "mapEmbedUrl": "",
            "formEnabled": True,
            "formFields": ["name", "email", "phone", "message"],
            "paddingY": "lg",
            "background": "surface",
        },
    },
    {
        "type": "footer",
        "sort_order": 6,
        "config": {
            "logoUrl": "",
            "tagline": "Nourish & Thrive",
            "columns": [
                {
                    "title": "Explore",
                    "links": [
                        {"label": "About", "href": "#about"},
                        {"label": "Diet plans", "href": "#services"},
                        {"label": "Book consult", "href": "#contact"},
                    ],
                },
                {
                    "title": "Programs",
                    "links": [
                        {"label": "Fat Loss", "href": "#plan-fat-loss"},
                        {"label": "High Protein", "href": "#plan-protein"},
                        {"label": "Gym Fuel", "href": "#plan-gym"},
                        {"label": "PCOS", "href": "#plan-pcos"},
                    ],
                },
            ],
            "social": [
                {"platform": "instagram", "href": "https://instagram.com"},
                {"platform": "youtube", "href": "https://youtube.com"},
            ],
            "copyright": "© 2026 Nourish & Thrive Nutrition. All rights reserved.",
            "policyLinks": [{"label": "Privacy", "href": "#"}],
            "paddingY": "md",
            "background": "primary",
        },
    },
]


def upsert_themes(db) -> dict[str, Theme]:
    by_slug: dict[str, Theme] = {}
    for data in THEMES:
        existing = db.query(Theme).filter(Theme.slug == data["slug"]).first()
        if existing:
            for key, value in data.items():
                setattr(existing, key, value)
            theme = existing
        else:
            theme = Theme(id=uuid.uuid4(), **data)
            db.add(theme)
        db.flush()
        by_slug[data["slug"]] = theme
    return by_slug


def seed() -> None:
    db = SessionLocal()
    try:
        themes = upsert_themes(db)
        nourish_theme = themes["verdant-nourish"]

        # Migrate old dentist demo → nutritionist demo
        site = db.query(Site).filter(Site.slug == "nourish-thrive").first()
        if not site:
            old = db.query(Site).filter(Site.slug == "bright-smile-dental").first()
            if old:
                site = old
                site.slug = "nourish-thrive"
                site.name = "Nourish & Thrive"
                site.niche = "nutritionist"
                site.settings = {
                    "tagline": "Clinical nutrition & personal diet plans",
                    "logo_url": "",
                    "seo": {
                        "metaTitle": "Nourish & Thrive | Clinical nutrition & diet plans",
                        "metaDescription": "Personal meal plans, fat-loss coaching, and clinical nutrition with Ayesha Rahman, RD.",
                        "keywords": "dietitian, meal plans, nutrition coach",
                        "robots": "index,follow",
                    },
                    "marketing": {
                        "googleAnalyticsId": "",
                        "googleTagManagerId": "",
                        "googleSearchConsole": "",
                        "googleAdsId": "",
                        "metaPixelId": "",
                        "microsoftClarityId": "",
                        "hotjarId": "",
                        "customHeadHtml": "",
                    },
                }
            else:
                site = Site(
                    id=uuid.uuid4(),
                    name="Nourish & Thrive",
                    slug="nourish-thrive",
                    niche="nutritionist",
                    status="published",
                    settings={
                        "tagline": "Clinical nutrition & personal diet plans",
                        "logo_url": "",
                        "seo": {
                            "metaTitle": "Nourish & Thrive | Clinical nutrition & diet plans",
                            "metaDescription": "Personal meal plans, fat-loss coaching, and clinical nutrition with Ayesha Rahman, RD.",
                            "keywords": "dietitian, meal plans, nutrition coach",
                            "robots": "index,follow",
                        },
                        "marketing": {
                            "googleAnalyticsId": "",
                            "googleTagManagerId": "",
                            "googleSearchConsole": "",
                            "googleAdsId": "",
                            "metaPixelId": "",
                            "microsoftClarityId": "",
                            "hotjarId": "",
                            "customHeadHtml": "",
                        },
                    },
                )
                db.add(site)
                db.flush()

        site.theme_id = nourish_theme.id
        site.status = "published"
        site.niche = "nutritionist"
        site.name = "Nourish & Thrive"
        db.flush()

        page = (
            db.query(Page)
            .filter(Page.site_id == site.id, Page.slug == "home")
            .first()
        )
        if not page:
            page = Page(
                id=uuid.uuid4(),
                site_id=site.id,
                title="Home",
                slug="home",
                meta_title="Nourish & Thrive | Dietitian & Nutrition Plans",
                meta_description="Personal diet plans, PCOS nutrition, athletic fueling, and gut health coaching.",
                is_home=True,
                is_published=True,
                sort_order=0,
            )
            db.add(page)
            db.flush()
        else:
            page.title = "Home"
            page.meta_title = "Nourish & Thrive | Dietitian & Nutrition Plans"
            page.meta_description = (
                "Personal diet plans, PCOS nutrition, athletic fueling, and gut health coaching."
            )
            page.is_published = True

        # Replace sections with nutrition content
        db.query(Section).filter(Section.page_id == page.id).delete()
        for item in SECTION_CONFIGS:
            db.add(
                Section(
                    id=uuid.uuid4(),
                    page_id=page.id,
                    type=item["type"],
                    sort_order=item["sort_order"],
                    is_visible=True,
                    config=item["config"],
                )
            )

        db.commit()
        print("Seeded Nourish & Thrive nutritionist demo.")
        print("  Site slug: nourish-thrive")
        print("  Theme: Verdant Nourish")
        print(f"  Themes available: {len(themes)}")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
