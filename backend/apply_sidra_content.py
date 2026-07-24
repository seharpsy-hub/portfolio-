"""Apply Sidra Kanwal CMS content from resume (editable via admin — not hardcoded in frontend).

Run after seed:
  python apply_sidra_content.py
"""
from __future__ import annotations

import uuid
from copy import deepcopy

from sqlalchemy.orm.attributes import flag_modified

from app.database import SessionLocal
from app.models import Page, Section, Site

CONTENT = {
    "hero": {
        "eyebrow": "Food Science · Quality Assurance · R&D",
        "headline": "Ensuring Food Safety & Product Excellence",
        "subheadline": (
            "B.Sc. Food Science & Technology professional with hands-on QC experience, "
            "GMP implementation, and a strong foundation in FSSC 22000 v6.0 and HACCP."
        ),
        "ctaPrimary": {"label": "Get in Touch", "href": "#contact"},
        "ctaSecondary": {"label": "Meet Sidra", "href": "#profile"},
        "backgroundImage": "https://images.unsplash.com/photo-1576086213369-97a306d36557?auto=format&fit=crop&w=1800&q=80",
        "overlayOpacity": 0.55,
        "overlayColor": "#0F172A",
        "paddingY": "lg",
        "background": "primary",
        "planChips": [
            {"label": "Quality Control", "href": "#svc-qc"},
            {"label": "Food Safety", "href": "#svc-food-safety"},
            {"label": "GMP & HACCP", "href": "#svc-gmp"},
            {"label": "R&D Support", "href": "#svc-rd"},
        ],
        "stats": [
            {"value": "3.67", "label": "CGPA / 4.0"},
            {"value": "2023", "label": "QC internship"},
            {"value": "FSSC", "label": "22000 v6.0 certified"},
        ],
        "floatCards": [
            {"title": "Focus", "value": "QA & Safety", "hint": "GMP · HACCP · FSSC"},
            {"title": "Industry", "value": "FMCG", "hint": "Oils, fats & processing"},
            {"title": "Approach", "value": "Compliance", "hint": "Docs · CAPA · risk"},
        ],
    },
    "profile": {
        "role": "professional",
        "eyebrow": "Meet your Food Science & QA professional",
        "badge": "Food Science & Technology · QA & R&D",
        "name": "Sidra Kanwal",
        "title": "Food Science & Technology Professional | Quality Assurance & R&D",
        "description": (
            "Results-driven B.Sc. Food Science & Technology graduate from The Islamia "
            "University of Bahawalpur (CGPA 3.67/4.0). Internship experience at Itehad "
            "Ghee Industry in GMP implementation, quality control, and production safety. "
            "Strong technical foundation in food processing, FSSC 22000 v6.0, and HACCP."
        ),
        "image": "https://images.unsplash.com/photo-1581093458791-9d42e3c0e0f1?auto=format&fit=crop&w=900&q=80",
        "credentials": [
            "B.Sc. (Hons) Food Science & Technology",
            "GMP & HACCP",
            "FSSC 22000 v6.0",
            "Quality Control",
            "Food Analysis",
            "R&D Support",
        ],
        "cta": {"label": "Contact Sidra", "href": "#contact"},
        "paddingY": "lg",
        "background": "surface",
    },
    "about": {
        "title": "About Sidra",
        "subtitle": "Meet Sidra Kanwal",
        "paragraphs": [
            (
                "Sidra Kanwal is a Food Science & Technology professional focused on quality "
                "assurance, food safety systems, and R&D. She holds a B.Sc. (Hons) in Food "
                "Science and Technology from The Islamia University of Bahawalpur with a "
                "CGPA of 3.67/4.0."
            ),
            (
                "During her internship at Itehad Ghee Industry (2023), she executed quality "
                "control inspections, enforced GMP standards, monitored critical production "
                "processes, and maintained comprehensive quality documentation while supporting "
                "production-line risk assessments."
            ),
            (
                "She seeks to leverage expertise in quality systems and R&D to ensure product "
                "excellence in the FMCG sector — combining technical knowledge in oils & fats, "
                "dairy, beverages, cereal & sugar technology, and food chemistry with practical "
                "compliance skills."
            ),
        ],
        "professionalSummary": (
            "Results-driven B.Sc. Food Science & Technology graduate with internship experience "
            "in GMP implementation, quality control, and production safety. Strong foundation "
            "in food processing, FSSC 22000 v6.0, and HACCP — ready to contribute to product "
            "excellence in FMCG quality and R&D teams."
        ),
        "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
        "imagePosition": "right",
        "quickInfo": [
            {
                "label": "Qualification",
                "value": "B.Sc. (Hons) Food Science & Technology\nCGPA 3.67/4.0",
            },
            {
                "label": "Specialization",
                "value": "Quality Assurance & R&D\nFood Safety Systems",
            },
            {
                "label": "Experience",
                "value": (
                    "QC & Safety Intern — Itehad Ghee Industry (2023)\n"
                    "GMP · HACCP · FSSC 22000\n"
                    "Production monitoring & documentation"
                ),
            },
            {
                "label": "Location",
                "value": "Muzaffargarh, Pakistan",
            },
        ],
        "whyChooseTitle": "Core strengths",
        "whyChoose": [
            "GMP implementation & enforcement",
            "HACCP & FSSC 22000 v6.0 knowledge",
            "Quality control inspections",
            "Production process monitoring",
            "Risk assessment & CAPA mindset",
            "Quality documentation discipline",
            "Food analysis & processing know-how",
            "Cross-functional collaboration",
        ],
        "mission": (
            "To ensure product excellence and consumer safety by applying rigorous quality "
            "systems, science-based food technology, and continuous improvement in FMCG "
            "operations and R&D."
        ),
        "vision": (
            "To grow as a trusted quality assurance and food safety professional who "
            "strengthens compliance culture and drives safer, higher-quality food products "
            "across Pakistan’s food industry."
        ),
        "values": [
            "Integrity",
            "Food Safety First",
            "Accuracy",
            "Continuous Learning",
            "Teamwork",
            "Accountability",
            "Process Discipline",
            "Professionalism",
        ],
        "statsTitle": "Highlights",
        "stats": [
            "CGPA 3.67/4.0 — IUB",
            "QC & Safety Internship — Itehad Ghee Industry",
            "FSSC 22000 v6.0 Webinar Certification (2023)",
            "GMP · HACCP · Risk Assessment",
            "Food Analysis & Unit Operations",
            "Oils & Fats · Dairy · Beverage Technology",
        ],
        "highlights": [
            {"label": "CGPA", "value": "3.67"},
            {"label": "Internship", "value": "2023"},
            {"label": "Cert", "value": "FSSC"},
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "services": {
        "title": "Expertise & Focus Areas",
        "subtitle": "Quality, safety, and food technology",
        "layout": "grid",
        "items": [
            {
                "id": "svc-qc",
                "title": "Quality Control",
                "description": (
                    "QC inspections and compliance checks to ensure product safety, "
                    "consistency, and adherence to quality standards on the production line."
                ),
                "icon": "leaf",
                "badge": "Core",
                "meta": "Inspections · Compliance",
                "tags": ["QC"],
                "image": "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-gmp",
                "title": "GMP Implementation",
                "description": (
                    "Practical experience enforcing Good Manufacturing Practices to protect "
                    "product integrity and maintain a safe production environment."
                ),
                "icon": "bowl",
                "badge": "",
                "meta": "Standards · Shop-floor",
                "tags": ["GMP"],
                "image": "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-food-safety",
                "title": "Food Safety Systems",
                "description": (
                    "Foundation in HACCP, FSSC 22000 v6.0, risk assessment, and CAPA to "
                    "support robust food safety management systems."
                ),
                "icon": "heart",
                "badge": "FSSC 22000",
                "meta": "HACCP · Risk · CAPA",
                "tags": ["Food safety"],
                "image": "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-production",
                "title": "Production Monitoring",
                "description": (
                    "Monitoring critical processes, identifying hazards, and supporting "
                    "operational safety to reduce risk on the production floor."
                ),
                "icon": "bolt",
                "badge": "",
                "meta": "Unit operations · Safety",
                "tags": ["Operations"],
                "image": "https://images.unsplash.com/photo-1565793298595-6a381b3a7a53?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-docs",
                "title": "Quality Documentation",
                "description": (
                    "Maintaining comprehensive quality records and supporting line risk "
                    "assessments with clear, audit-ready documentation."
                ),
                "icon": "leaf",
                "badge": "",
                "meta": "Records · Traceability",
                "tags": ["Documentation"],
                "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-analysis",
                "title": "Food Analysis",
                "description": (
                    "Technical grounding in food analysis, food chemistry, and processing "
                    "methods used to evaluate and improve product quality."
                ),
                "icon": "bowl",
                "badge": "",
                "meta": "Lab · Chemistry",
                "tags": ["Analysis"],
                "image": "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-oils",
                "title": "Oils & Fats Technology",
                "description": (
                    "Applied exposure through ghee industry internship plus coursework in "
                    "technology of oils & fats for FMCG quality contexts."
                ),
                "icon": "heart",
                "badge": "Industry",
                "meta": "Itehad Ghee · Processing",
                "tags": ["Oils & fats"],
                "image": "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-rd",
                "title": "R&D & Product Development",
                "description": (
                    "Interest and development exposure in product development, process "
                    "optimization, and translating food science into better products."
                ),
                "icon": "bolt",
                "badge": "R&D",
                "meta": "Innovation · Optimization",
                "tags": ["R&D"],
                "image": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-dairy-bev",
                "title": "Dairy & Beverage Technology",
                "description": (
                    "Coursework foundation in dairy technology, beverage technology, and "
                    "cereal & sugar technology for broader process understanding."
                ),
                "icon": "leaf",
                "badge": "",
                "meta": "Processing · Preservation",
                "tags": ["Dairy", "Beverage"],
                "image": "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "testimonials": {
        "title": "Education & Credentials",
        "subtitle": "Academic and professional development",
        "items": [
            {
                "quote": (
                    "B.Sc. (Hons) Food Science and Technology — The Islamia University of "
                    "Bahawalpur (2021 – Present). CGPA 3.67/4.0. Coursework includes unit "
                    "operations, food analysis, oils & fats, dairy, beverage, and food chemistry."
                ),
                "author": "The Islamia University of Bahawalpur",
                "role": "Undergraduate degree",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "Quality Control & Safety Intern at Itehad Ghee Industry (2023) — "
                    "GMP enforcement, production monitoring, quality documentation, and "
                    "support for production-line risk assessments."
                ),
                "author": "Itehad Ghee Industry",
                "role": "Internship · 2023",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "FSSC 22000 v6.0 — Webinar Certification (2023).",
                "author": "Professional Development",
                "role": "Certification",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "Human Nutrition — Webinar Attendee (2023).",
                "author": "Professional Development",
                "role": "Webinar",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "Product Development Competition — Webinar Attendee (2022).",
                "author": "Professional Development",
                "role": "Competition webinar",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "Intermediate — Govt Girls Higher Secondary School, Rohilanwali "
                    "(2018–2020), 81%. Matriculation — M. A. Jinnah Girls Higher Secondary "
                    "School, Rohilanwali (2016–2018), 86.67%."
                ),
                "author": "Academic background",
                "role": "Intermediate & Matric",
                "avatar": "",
                "rating": 5,
            },
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "About Sidra’s background & focus",
        "items": [
            {
                "question": "What is Sidra’s academic background?",
                "answer": (
                    "She is pursuing a B.Sc. (Hons) in Food Science and Technology at "
                    "The Islamia University of Bahawalpur with a CGPA of 3.67/4.0."
                ),
            },
            {
                "question": "Where did she gain industry experience?",
                "answer": (
                    "As a Quality Control & Safety Intern at Itehad Ghee Industry in 2023, "
                    "working on GMP, QC inspections, production monitoring, and documentation."
                ),
            },
            {
                "question": "Which food safety systems does she know?",
                "answer": (
                    "Core competencies include GMP, HACCP, FSSC 22000 v6.0, risk assessment, "
                    "CAPA, and quality documentation."
                ),
            },
            {
                "question": "What technical areas has she studied?",
                "answer": (
                    "Food analysis, cereal & sugar technology, oils & fats technology, dairy "
                    "and beverage technology, food chemistry, and food processing & preservation."
                ),
            },
            {
                "question": "How can I contact Sidra?",
                "answer": (
                    "Email kanwalsidra524@gmail.com or call / WhatsApp +92 322 5592535. "
                    "She is based in Muzaffargarh, Pakistan."
                ),
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "contact": {
        "title": "Let’s Connect",
        "subtitle": "Open to QA, food safety & R&D opportunities",
        "address": "Muzaffargarh, Pakistan",
        "phone": "+92 322 5592535",
        "email": "kanwalsidra524@gmail.com",
        "whatsapp": "+923225592535",
        "hours": (
            "Available for quality assurance, food safety, and R&D roles in the FMCG sector. "
            "Reach out by email, phone, or WhatsApp."
        ),
        "formEnabled": True,
        "formFields": ["name", "email", "phone", "message"],
        "paddingY": "lg",
        "background": "surface",
    },
    "footer": {
        "logoUrl": "/media/brand/sn-logo.svg",
        "tagline": "Sidra Kanwal · Food Science & QA",
        "description": (
            "Food Science & Technology professional focused on quality assurance, "
            "GMP/HACCP compliance, and R&D — Muzaffargarh, Pakistan."
        ),
        "cta": {"label": "Get in Touch", "href": "#contact"},
        "columns": [
            {
                "title": "Explore",
                "links": [
                    {"label": "Meet Sidra", "href": "#profile"},
                    {"label": "About", "href": "#about"},
                    {"label": "Expertise", "href": "#services"},
                    {"label": "Credentials", "href": "#testimonials"},
                    {"label": "FAQ", "href": "#faq"},
                ],
            },
            {
                "title": "Focus",
                "links": [
                    {"label": "Quality Control", "href": "#svc-qc"},
                    {"label": "Food Safety", "href": "#svc-food-safety"},
                    {"label": "GMP & HACCP", "href": "#svc-gmp"},
                    {"label": "R&D Support", "href": "#svc-rd"},
                    {"label": "Contact", "href": "#contact"},
                ],
            },
            {
                "title": "Contact",
                "links": [
                    {"label": "Muzaffargarh, Pakistan", "href": "#contact"},
                    {"label": "kanwalsidra524@gmail.com", "href": "mailto:kanwalsidra524@gmail.com"},
                    {"label": "+92 322 5592535", "href": "tel:+923225592535"},
                ],
            },
        ],
        "social": [
            {"platform": "whatsapp", "href": "https://wa.me/923225592535"},
            {"platform": "email", "href": "mailto:kanwalsidra524@gmail.com"},
        ],
        "copyright": "© 2026 Sidra Kanwal · Food Science & Technology. All rights reserved.",
        "policyLinks": [
            {"label": "Privacy", "href": "#"},
            {"label": "Terms", "href": "#"},
        ],
        "paddingY": "lg",
        "background": "primary",
    },
}

SEO = {
    "metaTitle": "Sidra Kanwal | Food Science, Quality Assurance & R&D",
    "metaDescription": (
        "Food Science & Technology professional in Muzaffargarh — QC internship at Itehad "
        "Ghee Industry, GMP, HACCP, FSSC 22000 v6.0, and R&D focus for FMCG excellence."
    ),
    "ogTitle": "Sidra Kanwal · Food Science & QA",
    "ogDescription": (
        "Quality assurance, food safety systems, and food technology expertise for product excellence."
    ),
    "keywords": (
        "Sidra Kanwal, Food Science Pakistan, Quality Assurance, Food Safety, GMP, HACCP, "
        "FSSC 22000, Itehad Ghee, Islamia University Bahawalpur, FMCG QA, Food Technology"
    ),
    "robots": "index,follow",
}


def apply() -> None:
    db = SessionLocal()
    try:
        site = db.query(Site).filter(Site.slug == "nourish-thrive").first()
        if not site:
            raise SystemExit("Site nourish-thrive not found — run seed.py first")

        settings = deepcopy(site.settings) if isinstance(site.settings, dict) else {}
        settings["brand_name"] = "Sidra Kanwal"
        settings["tagline"] = "Food Science · QA & R&D"
        settings["seo"] = {**(settings.get("seo") or {}), **SEO}
        site.settings = settings
        site.name = "Sidra Kanwal · Food Science & QA"
        flag_modified(site, "settings")

        page = (
            db.query(Page)
            .filter(Page.site_id == site.id, Page.slug == "home")
            .first()
        )
        if not page:
            raise SystemExit("Home page not found")

        page.title = "Home"
        page.meta_title = SEO["metaTitle"]
        page.meta_description = SEO["metaDescription"]

        order = [
            "hero",
            "profile",
            "about",
            "services",
            "testimonials",
            "faq",
            "contact",
            "footer",
        ]
        existing = {
            s.type: s
            for s in db.query(Section).filter(Section.page_id == page.id).all()
        }

        for i, stype in enumerate(order):
            cfg = CONTENT[stype]
            if stype in existing:
                sec = existing[stype]
                sec.config = cfg
                sec.sort_order = i
                sec.is_visible = True
                flag_modified(sec, "config")
            else:
                db.add(
                    Section(
                        id=uuid.uuid4(),
                        page_id=page.id,
                        type=stype,
                        config=cfg,
                        sort_order=i,
                        is_visible=True,
                    )
                )

        db.commit()
        print("Sidra Kanwal content applied from resume. Editable anytime in admin.")
    finally:
        db.close()


if __name__ == "__main__":
    apply()
