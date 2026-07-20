"""Apply Dr. Samavia CMS content (editable via admin — not hardcoded in frontend)."""
from __future__ import annotations

import uuid
from copy import deepcopy

from sqlalchemy.orm.attributes import flag_modified

from app.database import SessionLocal
from app.models import Page, Section, Site

CONTENT = {
    "hero": {
        "eyebrow": "Healthy Eating. Better Living. Lasting Results.",
        "headline": "Transform Your Health with Expert Nutrition Care",
        "subheadline": (
            "Achieve your health goals with personalized nutrition plans, evidence-based "
            "dietary guidance, and compassionate support from an experienced Dietitian & Nutritionist."
        ),
        "ctaPrimary": {"label": "Book Your Consultation", "href": "#contact"},
        "ctaSecondary": {"label": "Meet Dr. Samavia", "href": "#profile"},
        "backgroundImage": "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1800&q=80",
        "overlayOpacity": 0.55,
        "overlayColor": "#1A2E05",
        "paddingY": "lg",
        "background": "primary",
        "planChips": [
            {"label": "Weight Loss", "href": "#plan-weight-loss"},
            {"label": "Diabetes", "href": "#plan-diabetes"},
            {"label": "PCOS", "href": "#plan-pcos"},
            {"label": "Pregnancy", "href": "#plan-pregnancy"},
        ],
        "stats": [
            {"value": "100+", "label": "Personalized diet plans"},
            {"value": "500+", "label": "Nutrition consultations"},
            {"value": "2", "label": "Clinic locations"},
        ],
        "floatCards": [
            {"title": "Focus", "value": "Clinical", "hint": "Evidence-based care"},
            {"title": "Approach", "value": "Personal", "hint": "Plans for your lifestyle"},
            {"title": "Support", "value": "Ongoing", "hint": "Follow-ups available"},
        ],
    },
    "profile": {
        "role": "dr",
        "name": "Dr. Samavia",
        "title": "Clinical Dietitian & Nutritionist",
        "description": (
            "Dedicated and compassionate Dietitian & Nutritionist committed to helping individuals "
            "achieve healthier lifestyles through personalized nutrition care. BS Dietetics & Nutrition, "
            "with clinical experience at DHQ Hospital Lodhran and the Punjab Food Authority."
        ),
        "image": "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=900&q=80",
        "credentials": [
            "BS Dietetics & Nutrition",
            "Clinical Nutrition",
            "Diet Planning",
            "Weight Management",
            "Therapeutic Diets",
            "Food Safety",
        ],
        "cta": {"label": "Book Your Consultation", "href": "#contact"},
        "paddingY": "lg",
        "background": "surface",
    },
    "about": {
        "title": "About Dr. Samavia",
        "subtitle": "Meet Dr. Samavia",
        "paragraphs": [
            (
                "Dr. Samavia is a dedicated and compassionate Dietitian & Nutritionist committed to helping "
                "individuals achieve healthier lifestyles through personalized nutrition care. With a Bachelor "
                "of Science (BS) in Dietetics & Nutrition, she combines scientific knowledge with practical "
                "dietary solutions to support people of all ages."
            ),
            (
                "She has gained valuable professional experience through her internship at DHQ Hospital Lodhran "
                "and has also worked with the Punjab Food Authority, where she developed expertise in food safety, "
                "nutrition awareness, and public health."
            ),
            (
                "Known for her caring approach, strong communication skills, and commitment to patient well-being, "
                "Dr. Samavia provides customized nutrition plans designed to meet each individual's unique health "
                "needs and lifestyle."
            ),
        ],
        "professionalSummary": (
            "Dr. Samavia believes that every person deserves a healthy life through balanced nutrition. "
            "Her mission is to educate, guide, and support individuals in making sustainable dietary choices "
            "that improve long-term health and overall well-being."
        ),
        "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=1000&q=80",
        "imagePosition": "right",
        "quickInfo": [
            {"label": "Qualification", "value": "BS Dietetics & Nutrition"},
            {"label": "Specialization", "value": "Clinical Dietitian & Nutritionist"},
            {
                "label": "Experience",
                "value": "Clinical Nutrition\nDiet Planning\nWeight Management\nTherapeutic Diets\nFood Safety",
            },
            {
                "label": "Locations",
                "value": "Bahawalpur, Punjab\nHaroonabad, Punjab",
            },
        ],
        "whyChooseTitle": "Why Choose Dr. Samavia?",
        "whyChoose": [
            "Personalized Nutrition Plans",
            "Evidence-Based Dietary Guidance",
            "Professional Clinical Experience",
            "Patient-Centered Care",
            "Practical Lifestyle Coaching",
            "Long-Term Health Management",
            "Friendly & Supportive Consultation",
            "Nutrition for Every Age Group",
        ],
        "mission": (
            "To improve lives by providing evidence-based nutrition guidance that empowers individuals "
            "to make healthier lifestyle choices for lifelong wellness."
        ),
        "vision": (
            "To become a trusted nutrition professional recognized for delivering high-quality dietary care, "
            "promoting preventive healthcare, and inspiring healthier communities across Pakistan."
        ),
        "values": [
            "Compassion",
            "Professionalism",
            "Integrity",
            "Evidence-Based Practice",
            "Patient Care",
            "Continuous Learning",
            "Respect",
            "Confidentiality",
        ],
        "statsTitle": "Statistics",
        "stats": [
            "100+ Personalized Diet Plans",
            "500+ Nutrition Consultations",
            "Clinical Internship Experience",
            "Public Health Nutrition Experience",
            "Personalized Patient Care",
            "Evidence-Based Recommendations",
        ],
        "highlights": [
            {"label": "Locations", "value": "2"},
            {"label": "Diet plans", "value": "100+"},
            {"label": "Consults", "value": "500+"},
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "services": {
        "title": "Services",
        "subtitle": "Personalized nutrition programs",
        "layout": "grid",
        "items": [
            {
                "id": "plan-weight-loss",
                "title": "Weight Loss Programs",
                "description": "Healthy, sustainable weight loss plans designed specifically for your body and lifestyle.",
                "icon": "leaf",
                "badge": "Popular",
                "meta": "Personalized · Sustainable",
                "tags": ["Weight loss"],
                "image": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-weight-gain",
                "title": "Weight Gain Programs",
                "description": "Balanced nutrition strategies to help you gain healthy weight safely and effectively.",
                "icon": "bowl",
                "badge": "",
                "meta": "Healthy gain · Safe progress",
                "tags": ["Weight gain"],
                "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-clinical",
                "title": "Clinical Nutrition Therapy",
                "description": "Personalized nutrition support for various medical conditions under professional guidance.",
                "icon": "heart",
                "badge": "Clinical",
                "meta": "Condition-focused care",
                "tags": ["Clinical"],
                "image": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-diabetes",
                "title": "Diabetes Nutrition",
                "description": "Customized meal planning to help manage blood sugar levels and improve overall health.",
                "icon": "leaf",
                "badge": "",
                "meta": "Blood sugar support",
                "tags": ["Diabetes"],
                "image": "https://images.unsplash.com/photo-1505576399279-565b52d5ac37?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-pregnancy",
                "title": "Pregnancy & Maternal Nutrition",
                "description": "Nutrition guidance for healthy pregnancies and the well-being of both mother and baby.",
                "icon": "heart",
                "badge": "",
                "meta": "Mother & baby care",
                "tags": ["Pregnancy"],
                "image": "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-child",
                "title": "Child Nutrition",
                "description": "Healthy eating plans to support children's growth, development, and immunity.",
                "icon": "bowl",
                "badge": "",
                "meta": "Growth & immunity",
                "tags": ["Children"],
                "image": "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-pcos",
                "title": "PCOS Nutrition",
                "description": "Evidence-based dietary strategies to help manage PCOS symptoms and improve hormonal health.",
                "icon": "heart",
                "badge": "Hormone care",
                "meta": "Evidence-based",
                "tags": ["PCOS"],
                "image": "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-heart",
                "title": "Heart-Healthy Diet",
                "description": "Nutrition plans focused on maintaining healthy cholesterol levels and supporting cardiovascular health.",
                "icon": "heart",
                "badge": "",
                "meta": "Heart health",
                "tags": ["Cardio"],
                "image": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
            {
                "id": "plan-sports",
                "title": "Sports Nutrition",
                "description": "Performance-focused meal planning for athletes, fitness enthusiasts, and active individuals.",
                "icon": "bolt",
                "badge": "Performance",
                "meta": "Athletes & active lifestyles",
                "tags": ["Sports"],
                "image": "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=800&q=80",
                "href": "#contact",
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "testimonials": {
        "title": "Patient Testimonials",
        "subtitle": "Trusted by patients across Punjab",
        "items": [
            {
                "quote": "Dr. Samavia listened carefully to my concerns and created a nutrition plan that was easy to follow. I feel healthier and more energetic than ever.",
                "author": "Ayesha K.",
                "role": "Patient",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "The personalized diet plan helped me lose weight in a healthy way without feeling deprived. Highly recommended.",
                "author": "Muhammad A.",
                "role": "Patient",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "Her professional guidance and continuous support made it easy for me to improve my eating habits and overall lifestyle.",
                "author": "Sana R.",
                "role": "Patient",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "Excellent consultation with practical advice that fits into everyday life. I truly appreciate her dedication.",
                "author": "Ali H.",
                "role": "Patient",
                "avatar": "",
                "rating": 5,
            },
            {
                "quote": "A knowledgeable and caring nutritionist who genuinely wants the best for her patients.",
                "author": "Fatima S.",
                "role": "Patient",
                "avatar": "",
                "rating": 5,
            },
        ],
        "paddingY": "lg",
        "background": "default",
    },
    "faq": {
        "title": "Frequently Asked Questions",
        "subtitle": "Answers before you book",
        "items": [
            {
                "question": "Do I need a consultation before receiving a diet plan?",
                "answer": "Yes. Every nutrition plan is prepared after understanding your health condition, lifestyle, and personal goals.",
            },
            {
                "question": "Are your diet plans personalized?",
                "answer": "Absolutely. Every meal plan is customized according to your individual nutritional requirements.",
            },
            {
                "question": "Do you provide online consultations?",
                "answer": "Yes. Online consultations are available for patients who cannot visit in person.",
            },
            {
                "question": "Can you help with medical conditions?",
                "answer": "Yes. Nutrition guidance is available for various health conditions, including diabetes, weight management, digestive health, and more, based on individual assessment.",
            },
            {
                "question": "How often should I schedule follow-up sessions?",
                "answer": "Regular follow-up sessions are recommended to monitor progress, make adjustments, and ensure long-term success.",
            },
        ],
        "paddingY": "lg",
        "background": "surface",
    },
    "contact": {
        "title": "Start Your Journey Toward Better Health",
        "subtitle": "Book Your Consultation Today",
        "address": "Bahawalpur, Punjab · Haroonabad, Punjab · Online consultations available",
        "phone": "",
        "email": "",
        "hours": "Book a consultation for personalized nutrition guidance tailored to your needs.",
        "formEnabled": True,
        "formFields": ["name", "email", "phone", "message"],
        "paddingY": "lg",
        "background": "surface",
    },
    "footer": {
        "logoUrl": "/media/brand/sn-logo.svg",
        "tagline": "SN Diet & Nutrition",
        "description": (
            "Clinical dietetics with Dr. Samavia — personalized nutrition plans for weight "
            "management, diabetes, PCOS, pregnancy, and lasting wellness across Bahawalpur & Haroonabad."
        ),
        "cta": {"label": "Book Your Consultation", "href": "#contact"},
        "columns": [
            {
                "title": "Explore",
                "links": [
                    {"label": "Meet Dr. Samavia", "href": "#profile"},
                    {"label": "About", "href": "#about"},
                    {"label": "Services", "href": "#services"},
                    {"label": "Client stories", "href": "#testimonials"},
                    {"label": "FAQ", "href": "#faq"},
                ],
            },
            {
                "title": "Care",
                "links": [
                    {"label": "Weight management", "href": "#plan-weight-loss"},
                    {"label": "Diabetes nutrition", "href": "#plan-diabetes"},
                    {"label": "PCOS support", "href": "#plan-pcos"},
                    {"label": "Pregnancy nutrition", "href": "#plan-pregnancy"},
                    {"label": "Book a consult", "href": "#contact"},
                ],
            },
            {
                "title": "Clinics",
                "links": [
                    {"label": "Bahawalpur, Punjab", "href": "#contact"},
                    {"label": "Haroonabad, Punjab", "href": "#contact"},
                    {"label": "Online consultations", "href": "#contact"},
                ],
            },
        ],
        "social": [
            {"platform": "instagram", "href": "https://instagram.com"},
            {"platform": "facebook", "href": "https://facebook.com"},
            {"platform": "whatsapp", "href": "https://wa.me/"},
        ],
        "copyright": "© 2026 SN Diet & Nutrition · Dr. Samavia. All rights reserved.",
        "policyLinks": [
            {"label": "Privacy", "href": "#"},
            {"label": "Terms", "href": "#"},
        ],
        "paddingY": "lg",
        "background": "primary",
    },
}

SEO = {
    "metaTitle": "Dr. Samavia | Dietitian & Nutritionist in Bahawalpur & Haroonabad",
    "metaDescription": (
        "Personalized nutrition plans, clinical diet guidance, weight management, diabetes, "
        "PCOS, pregnancy & sports nutrition with Dr. Samavia — Bahawalpur & Haroonabad, Punjab."
    ),
    "ogTitle": "Dr. Samavia · Clinical Dietitian & Nutritionist",
    "ogDescription": "Evidence-based, personalized nutrition care for lasting health.",
    "keywords": (
        "Dietitian in Bahawalpur, Nutritionist in Bahawalpur, Best Dietitian in Punjab, "
        "Clinical Nutritionist Pakistan, Weight Loss Dietitian, Personalized Diet Plans, "
        "Nutrition Consultation, Healthy Lifestyle Coach, Dietitian in Haroonabad, Clinical Dietitian Pakistan"
    ),
    "robots": "index,follow",
}


def apply() -> None:
    db = SessionLocal()
    try:
        site = db.query(Site).filter(Site.slug == "nourish-thrive").first()
        if not site:
            raise SystemExit("Site nourish-thrive not found")

        settings = deepcopy(site.settings) if isinstance(site.settings, dict) else {}
        settings["brand_name"] = "SN Diet"
        settings["tagline"] = "Diet & Nutrition"
        settings["seo"] = {**(settings.get("seo") or {}), **SEO}
        site.settings = settings
        site.name = "SN Diet & Nutrition"
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
        print("Dr. Samavia content applied. Editable anytime in admin.")
    finally:
        db.close()


if __name__ == "__main__":
    apply()
