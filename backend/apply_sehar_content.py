"""Apply Sehar Saqib CMS content from portfolio data (editable via admin — not hardcoded in frontend).

Run after seed:
  python apply_sehar_content.py
"""
from __future__ import annotations

import uuid
from copy import deepcopy

from sqlalchemy.orm.attributes import flag_modified

from app.database import SessionLocal
from app.models import Page, Section, Site

CONTENT = {
    "hero": {
        "eyebrow": "Clinical Psychology · Assessment · Therapy",
        "headline": "Compassionate Care for Mental Well-Being",
        "subheadline": (
            "Clinical Psychologist with BS Psychology and Advanced Diploma in Clinical "
            "Psychology (ADCP) — trained in psychological assessment, counseling, "
            "psychotherapy, and evidence-based mental health interventions."
        ),
        "ctaPrimary": {"label": "Book a Consultation", "href": "#contact"},
        "ctaSecondary": {"label": "Meet Sehar", "href": "#profile"},
        "backgroundImage": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=1800&q=80",
        "overlayOpacity": 0.55,
        "overlayColor": "#1A2E05",
        "paddingY": "lg",
        "background": "primary",
        "planChips": [
            {"label": "Assessment", "href": "#svc-assessment"},
            {"label": "Counseling", "href": "#svc-counseling"},
            {"label": "CBT", "href": "#svc-cbt"},
            {"label": "Child & Adolescent", "href": "#svc-child"},
        ],
        "stats": [
            {"value": "3.76", "label": "BS Psychology CGPA"},
            {"value": "ADCP", "label": "Clinical diploma"},
            {"value": "2", "label": "Hospital trainings"},
        ],
        "floatCards": [
            {"title": "Focus", "value": "Clinical", "hint": "Assessment · Therapy"},
            {"title": "Approach", "value": "Evidence-based", "hint": "CBT · Counseling"},
            {"title": "Care", "value": "Ethical", "hint": "Confidential · Professional"},
        ],
    },
    "profile": {
        "role": "dr",
        "eyebrow": "Meet your Clinical Psychologist",
        "badge": "Clinical Psychologist",
        "name": "Sehar Saqib",
        "title": "Clinical Psychologist",
        "description": (
            "Dedicated and compassionate Clinical Psychologist with academic training in "
            "psychological assessment, psychotherapy, counseling, and mental health "
            "interventions. BS in Psychology from The Islamia University of Bahawalpur "
            "and Advanced Diploma in Clinical Psychology (ADCP). Committed to promoting "
            "mental well-being through evidence-based psychological services while "
            "maintaining the highest ethical and professional standards."
        ),
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
        "credentials": [
            "BS Psychology",
            "ADCP",
            "Psychological Assessment",
            "CBT",
            "Individual Counseling",
            "Clinical Interviewing",
        ],
        "cta": {"label": "Book a Consultation", "href": "#contact"},
        "paddingY": "lg",
        "background": "surface",
    },
    "about": {
        "title": "About Sehar",
        "subtitle": "Meet Sehar Saqib",
        "paragraphs": [
            (
                "Sehar Saqib is a dedicated and compassionate Clinical Psychologist with "
                "academic training in psychological assessment, psychotherapy, counseling, "
                "and mental health interventions. She holds a BS in Psychology from "
                "The Islamia University of Bahawalpur (CGPA 3.76) and an Advanced Diploma "
                "in Clinical Psychology (ADCP)."
            ),
            (
                "Her clinical training includes a Clinical Psychologist Internship at "
                "THQ Hospital Khanpur — conducting interviews, assisting in assessment, "
                "providing supervised individual counseling, preparing case histories and "
                "reports, and working with clients facing anxiety, depression, stress, "
                "behavioral issues, and adjustment problems."
            ),
            (
                "As a Field Observer in the Psychiatry Ward at Bahawal Victoria Hospital "
                "(BVH), Bahawalpur, she observed psychiatric evaluations, assisted in "
                "mental status examinations, learned psychodiagnostic procedures, and "
                "participated in ward rounds and case discussions."
            ),
        ],
        "professionalSummary": (
            "To utilize knowledge, clinical training, and therapeutic skills in a "
            "professional healthcare or educational setting — contributing to psychological "
            "assessment, counseling, psychotherapy, and mental health awareness while "
            "continuing to develop professionally."
        ),
        "image": "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1000&q=80",
        "imagePosition": "right",
        "quickInfo": [
            {
                "label": "Qualification",
                "value": "BS Psychology (CGPA 3.76)\nAdvanced Diploma in Clinical Psychology (ADCP)",
            },
            {
                "label": "Specialization",
                "value": "Clinical Psychology\nAssessment · Counseling · Psychotherapy",
            },
            {
                "label": "Training",
                "value": (
                    "Clinical Intern — THQ Hospital Khanpur\n"
                    "Field Observer — Psychiatry Ward, BVH Bahawalpur"
                ),
            },
            {
                "label": "Interests",
                "value": (
                    "CBT · Trauma & Stress\n"
                    "Anxiety · Depression\n"
                    "Child & Adolescent Psychology"
                ),
            },
        ],
        "whyChooseTitle": "Professional strengths",
        "whyChoose": [
            "Psychological assessment & MSE",
            "Case history & formulation",
            "Individual counseling",
            "Cognitive Behavioral Therapy (CBT)",
            "Behavior therapy techniques",
            "Psychoeducation & crisis intervention",
            "Psychological report writing",
            "Ethical clinical practice",
        ],
        "mission": (
            "To promote mental well-being through evidence-based psychological services, "
            "compassionate counseling, and ethical clinical practice that respects every "
            "client’s dignity and confidentiality."
        ),
        "vision": (
            "To grow as a trusted Clinical Psychologist contributing to accessible mental "
            "health care, awareness, and high-quality assessment and therapy in healthcare "
            "and educational settings."
        ),
        "values": [
            "Compassion",
            "Ethics",
            "Confidentiality",
            "Evidence-Based Practice",
            "Respect",
            "Professionalism",
            "Empathy",
            "Continuous Learning",
        ],
        "statsTitle": "Highlights",
        "stats": [
            "BS Psychology — CGPA 3.76 (IUB)",
            "Advanced Diploma in Clinical Psychology (ADCP)",
            "Clinical Intern — THQ Hospital Khanpur",
            "Psychiatry Field Observer — BVH Bahawalpur",
            "BS & ADCP research experience",
            "Assessment, counseling & CBT skills",
        ],
        "highlights": [
            {"label": "CGPA", "value": "3.76"},
            {"label": "Diploma", "value": "ADCP"},
            {"label": "Sites", "value": "2"},
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "services": {
        "title": "Clinical Focus Areas",
        "subtitle": "Assessment, counseling & mental health support",
        "layout": "grid",
        "items": [
            {
                "id": "svc-assessment",
                "title": "Psychological Assessment",
                "description": (
                    "Clinical interviews, mental status examination, behavioral observation, "
                    "cognitive screening, personality assessment, and case formulation under "
                    "professional standards."
                ),
                "icon": "leaf",
                "badge": "Core",
                "meta": "MSE · Formulation · Reports",
                "tags": ["Assessment"],
                "image": "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-counseling",
                "title": "Individual Counseling",
                "description": (
                    "Supportive, supervised counseling experience for anxiety, depression, "
                    "stress, behavioral issues, and adjustment problems with strong rapport "
                    "building."
                ),
                "icon": "heart",
                "badge": "Popular",
                "meta": "1:1 · Supportive care",
                "tags": ["Counseling"],
                "image": "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-cbt",
                "title": "Cognitive Behavioral Therapy",
                "description": (
                    "Training and interest in CBT and behavior therapy techniques to help "
                    "clients understand thoughts, emotions, and coping patterns."
                ),
                "icon": "bolt",
                "badge": "CBT",
                "meta": "Evidence-based therapy",
                "tags": ["CBT"],
                "image": "https://images.unsplash.com/photo-1544027993-37dbfe435903?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-anxiety",
                "title": "Anxiety & Stress Support",
                "description": (
                    "Clinical experience with clients facing anxiety, stress, and related "
                    "adjustment difficulties through assessment, counseling, and psychoeducation."
                ),
                "icon": "leaf",
                "badge": "",
                "meta": "Anxiety · Stress",
                "tags": ["Anxiety"],
                "image": "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-depression",
                "title": "Depression Support",
                "description": (
                    "Compassionate psychological support for depressive concerns, including "
                    "interviewing, assessment, and supervised therapeutic engagement."
                ),
                "icon": "heart",
                "badge": "",
                "meta": "Mood · Coping",
                "tags": ["Depression"],
                "image": "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-child",
                "title": "Child & Adolescent Psychology",
                "description": (
                    "Area of interest focused on understanding developmental, emotional, and "
                    "behavioral needs of children and adolescents."
                ),
                "icon": "bowl",
                "badge": "Interest",
                "meta": "Youth mental health",
                "tags": ["Child", "Adolescent"],
                "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-trauma",
                "title": "Trauma & Emotional Regulation",
                "description": (
                    "Research and clinical interest in childhood trauma, emotional "
                    "dysregulation, and adaptive coping strategies among young adults."
                ),
                "icon": "heart",
                "badge": "",
                "meta": "Trauma · Coping",
                "tags": ["Trauma"],
                "image": "https://images.unsplash.com/photo-1516302752623-00355c4c8c1a?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-psychoeducation",
                "title": "Psychoeducation & Awareness",
                "description": (
                    "Psychoeducation, mental health awareness, and clear communication to "
                    "help clients and families understand psychological concerns and care."
                ),
                "icon": "leaf",
                "badge": "",
                "meta": "Education · Awareness",
                "tags": ["Psychoeducation"],
                "image": "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "svc-crisis",
                "title": "Crisis Intervention",
                "description": (
                    "Training in crisis intervention skills to support clients during "
                    "acute emotional distress with ethical, calm, and structured care."
                ),
                "icon": "bolt",
                "badge": "",
                "meta": "Acute support",
                "tags": ["Crisis"],
                "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "testimonials": {
        "title": "Training, Research & Credentials",
        "subtitle": "Education and clinical development",
        "items": [
            {
                "quote": (
                    "Bachelor of Science (BS) in Psychology — The Islamia University of "
                    "Bahawalpur. CGPA: 3.76."
                ),
                "author": "The Islamia University of Bahawalpur",
                "role": "BS Psychology",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "Advanced Diploma in Clinical Psychology (ADCP) — completed, with "
                    "focused clinical training in assessment, counseling, and psychotherapy."
                ),
                "author": "Professional Qualification",
                "role": "ADCP",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "Clinical Psychologist Intern at THQ Hospital Khanpur — psychological "
                    "interviews, assessment support, supervised counseling, case histories, "
                    "reports, and multidisciplinary discussions."
                ),
                "author": "THQ Hospital Khanpur",
                "role": "Clinical Internship",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "Field Observer — Psychiatry Ward, Bahawal Victoria Hospital (BVH), "
                    "Bahawalpur. Observed evaluations, assisted MSE, learned psychodiagnostic "
                    "procedures, and joined ward rounds."
                ),
                "author": "Bahawal Victoria Hospital",
                "role": "Psychiatry Field Observation",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "BS Research: Impact of Sleep Quality and Cognitive Functioning on the "
                    "Academic Performance of University Students — literature review, design, "
                    "data collection, SPSS analysis, and report writing."
                ),
                "author": "BS Research",
                "role": "Research project",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": (
                    "ADCP Research: Impact of Childhood Trauma and Emotional Dysregulation "
                    "on Coping Strategies among Young Adults — using standardized "
                    "psychological measures."
                ),
                "author": "ADCP Research",
                "role": "Research project",
                "avatar": "",
                "rating": 5,
            },
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "About Sehar’s practice & background",
        "items": [
            {
                "question": "What are Sehar’s qualifications?",
                "answer": (
                    "She holds a BS in Psychology from The Islamia University of Bahawalpur "
                    "(CGPA 3.76) and an Advanced Diploma in Clinical Psychology (ADCP)."
                ),
            },
            {
                "question": "Where did she complete clinical training?",
                "answer": (
                    "As a Clinical Psychologist Intern at THQ Hospital Khanpur, and as a "
                    "Field Observer in the Psychiatry Ward at Bahawal Victoria Hospital "
                    "(BVH), Bahawalpur."
                ),
            },
            {
                "question": "What concerns has she worked with?",
                "answer": (
                    "During training she worked with clients experiencing anxiety, depression, "
                    "stress, behavioral issues, and adjustment problems."
                ),
            },
            {
                "question": "Which therapeutic approaches does she use?",
                "answer": (
                    "Professional skills include CBT, behavior therapy techniques, individual "
                    "counseling, psychoeducation, crisis intervention, and ethical clinical practice."
                ),
            },
            {
                "question": "How can I contact Sehar?",
                "answer": (
                    "Email seharsaqib2558@gmail.com. Use the contact form to request a "
                    "consultation or inquire about psychological services."
                ),
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "contact": {
        "title": "Start Your Path Toward Better Mental Health",
        "subtitle": "Get in touch for assessment or counseling inquiries",
        "address": "Available for healthcare and educational settings",
        "phone": "",
        "email": "seharsaqib2558@gmail.com",
        "whatsapp": "",
        "hours": (
            "Open to clinical psychology roles and client inquiries for assessment, "
            "counseling, and mental health support. Reach out by email or the form below."
        ),
        "formEnabled": True,
        "formFields": ["name", "email", "phone", "message"],
        "paddingY": "lg",
        "background": "surface",
    },
    "footer": {
        "logoUrl": "/media/brand/sn-logo.svg",
        "tagline": "Sehar Saqib · Clinical Psychologist",
        "description": (
            "Clinical Psychologist offering evidence-based assessment, counseling, and "
            "mental health support — BS Psychology & ADCP trained."
        ),
        "cta": {"label": "Book a Consultation", "href": "#contact"},
        "columns": [
            {
                "title": "Explore",
                "links": [
                    {"label": "Meet Sehar", "href": "#profile"},
                    {"label": "About", "href": "#about"},
                    {"label": "Focus areas", "href": "#services"},
                    {"label": "Credentials", "href": "#testimonials"},
                    {"label": "FAQ", "href": "#faq"},
                ],
            },
            {
                "title": "Care",
                "links": [
                    {"label": "Assessment", "href": "#svc-assessment"},
                    {"label": "Counseling", "href": "#svc-counseling"},
                    {"label": "CBT", "href": "#svc-cbt"},
                    {"label": "Child & Adolescent", "href": "#svc-child"},
                    {"label": "Contact", "href": "#contact"},
                ],
            },
            {
                "title": "Contact",
                "links": [
                    {"label": "seharsaqib2558@gmail.com", "href": "mailto:seharsaqib2558@gmail.com"},
                    {"label": "Request a consult", "href": "#contact"},
                ],
            },
        ],
        "social": [
            {"platform": "email", "href": "mailto:seharsaqib2558@gmail.com"},
        ],
        "copyright": "© 2026 Sehar Saqib · Clinical Psychologist. All rights reserved.",
        "policyLinks": [
            {"label": "Privacy", "href": "#"},
            {"label": "Terms", "href": "#"},
        ],
        "paddingY": "lg",
        "background": "primary",
    },
}

SEO = {
    "metaTitle": "Sehar Saqib | Clinical Psychologist",
    "metaDescription": (
        "Clinical Psychologist Sehar Saqib — BS Psychology & ADCP. Assessment, counseling, "
        "CBT, and mental health support. Training at THQ Hospital Khanpur and BVH Bahawalpur."
    ),
    "ogTitle": "Sehar Saqib · Clinical Psychologist",
    "ogDescription": (
        "Evidence-based psychological assessment, counseling, and therapy with ethical, "
        "compassionate clinical care."
    ),
    "keywords": (
        "Sehar Saqib, Clinical Psychologist, ADCP, BS Psychology, Counseling, CBT, "
        "Psychological Assessment, Mental Health, THQ Khanpur, BVH Bahawalpur, "
        "Islamia University Bahawalpur"
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
        settings["brand_name"] = "Sehar Saqib"
        settings["tagline"] = "Clinical Psychologist"
        settings["seo"] = {**(settings.get("seo") or {}), **SEO}
        site.settings = settings
        site.name = "Sehar Saqib · Clinical Psychologist"
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
        print("Sehar Saqib content applied. Editable anytime in admin.")
    finally:
        db.close()


if __name__ == "__main__":
    apply()
