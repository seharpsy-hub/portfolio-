from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.orm import Session, joinedload

from app.auth import create_access_token, require_admin, verify_password
from app.database import get_db
from app.models import (
    ContactSubmission,
    Media,
    Page,
    Section,
    Site,
    Theme,
)
from app.schemas import (
    ContactSubmissionOut,
    ContactSubmit,
    LoginRequest,
    MediaOut,
    MediaUpdate,
    PageCreate,
    PageOut,
    PageUpdate,
    PublicPageOut,
    SectionCreate,
    SectionOut,
    SectionReorderRequest,
    SectionUpdate,
    SiteCreate,
    SiteOut,
    SiteUpdate,
    ThemeCreate,
    ThemeOut,
    ThemeUpdate,
    TokenOut,
)

router = APIRouter()


# ─── Auth ──────────────────────────────────────────────


@router.post("/auth/login", response_model=TokenOut)
def login(body: LoginRequest):
    if not verify_password(body.password):
        raise HTTPException(status_code=401, detail="Invalid password")
    return TokenOut(access_token=create_access_token())


# ─── Themes ────────────────────────────────────────────


@router.get("/themes", response_model=list[ThemeOut])
def list_themes(db: Session = Depends(get_db)):
    return db.query(Theme).order_by(Theme.created_at.desc()).all()


@router.post("/themes", response_model=ThemeOut, status_code=201)
def create_theme(
    body: ThemeCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    theme = Theme(**body.model_dump())
    db.add(theme)
    db.commit()
    db.refresh(theme)
    return theme


@router.get("/themes/{theme_id}", response_model=ThemeOut)
def get_theme(theme_id: UUID, db: Session = Depends(get_db)):
    theme = db.get(Theme, theme_id)
    if not theme:
        raise HTTPException(404, "Theme not found")
    return theme


@router.patch("/themes/{theme_id}", response_model=ThemeOut)
def update_theme(
    theme_id: UUID,
    body: ThemeUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    theme = db.get(Theme, theme_id)
    if not theme:
        raise HTTPException(404, "Theme not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(theme, key, value)
    db.commit()
    db.refresh(theme)
    return theme


@router.delete("/themes/{theme_id}", status_code=204)
def delete_theme(
    theme_id: UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    theme = db.get(Theme, theme_id)
    if not theme:
        raise HTTPException(404, "Theme not found")
    db.delete(theme)
    db.commit()


# ─── Sites ─────────────────────────────────────────────


@router.get("/sites", response_model=list[SiteOut])
def list_sites(db: Session = Depends(get_db)):
    return (
        db.query(Site)
        .options(joinedload(Site.theme))
        .order_by(Site.created_at.desc())
        .all()
    )


@router.post("/sites", response_model=SiteOut, status_code=201)
def create_site(
    body: SiteCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    if db.query(Site).filter(Site.slug == body.slug).first():
        raise HTTPException(400, "Slug already exists")
    site = Site(**body.model_dump())
    db.add(site)
    db.commit()
    db.refresh(site)
    return (
        db.query(Site)
        .options(joinedload(Site.theme))
        .filter(Site.id == site.id)
        .one()
    )


@router.get("/sites/{site_id}", response_model=SiteOut)
def get_site(site_id: UUID, db: Session = Depends(get_db)):
    site = (
        db.query(Site)
        .options(joinedload(Site.theme))
        .filter(Site.id == site_id)
        .first()
    )
    if not site:
        raise HTTPException(404, "Site not found")
    return site


@router.get("/sites/by-slug/{slug}", response_model=SiteOut)
def get_site_by_slug(slug: str, db: Session = Depends(get_db)):
    site = (
        db.query(Site)
        .options(joinedload(Site.theme))
        .filter(Site.slug == slug)
        .first()
    )
    if not site:
        raise HTTPException(404, "Site not found")
    return site


@router.patch("/sites/{site_id}", response_model=SiteOut)
def update_site(
    site_id: UUID,
    body: SiteUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    site = db.get(Site, site_id)
    if not site:
        raise HTTPException(404, "Site not found")
    data = body.model_dump(exclude_unset=True)
    if "slug" in data:
        conflict = (
            db.query(Site)
            .filter(Site.slug == data["slug"], Site.id != site_id)
            .first()
        )
        if conflict:
            raise HTTPException(400, "Slug already exists")
    for key, value in data.items():
        setattr(site, key, value)
    db.commit()
    return (
        db.query(Site)
        .options(joinedload(Site.theme))
        .filter(Site.id == site_id)
        .one()
    )


@router.delete("/sites/{site_id}", status_code=204)
def delete_site(
    site_id: UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    site = db.get(Site, site_id)
    if not site:
        raise HTTPException(404, "Site not found")
    db.delete(site)
    db.commit()


# ─── Pages ─────────────────────────────────────────────


@router.get("/pages", response_model=list[PageOut])
def list_pages(site_id: UUID | None = None, db: Session = Depends(get_db)):
    q = db.query(Page)
    if site_id:
        q = q.filter(Page.site_id == site_id)
    return q.order_by(Page.sort_order, Page.created_at).all()


@router.post("/pages", response_model=PageOut, status_code=201)
def create_page(
    body: PageCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    if not db.get(Site, body.site_id):
        raise HTTPException(404, "Site not found")
    page = Page(**body.model_dump())
    db.add(page)
    db.commit()
    db.refresh(page)
    return page


@router.get("/pages/{page_id}", response_model=PageOut)
def get_page(page_id: UUID, db: Session = Depends(get_db)):
    page = db.get(Page, page_id)
    if not page:
        raise HTTPException(404, "Page not found")
    return page


@router.patch("/pages/{page_id}", response_model=PageOut)
def update_page(
    page_id: UUID,
    body: PageUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    page = db.get(Page, page_id)
    if not page:
        raise HTTPException(404, "Page not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(page, key, value)
    db.commit()
    db.refresh(page)
    return page


@router.delete("/pages/{page_id}", status_code=204)
def delete_page(
    page_id: UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    page = db.get(Page, page_id)
    if not page:
        raise HTTPException(404, "Page not found")
    db.delete(page)
    db.commit()


# ─── Sections ──────────────────────────────────────────


@router.get("/sections", response_model=list[SectionOut])
def list_sections(page_id: UUID | None = None, db: Session = Depends(get_db)):
    q = db.query(Section)
    if page_id:
        q = q.filter(Section.page_id == page_id)
    return q.order_by(Section.sort_order, Section.created_at).all()


@router.post("/sections", response_model=SectionOut, status_code=201)
def create_section(
    body: SectionCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    if not db.get(Page, body.page_id):
        raise HTTPException(404, "Page not found")
    section = Section(**body.model_dump())
    db.add(section)
    db.commit()
    db.refresh(section)
    return section


@router.get("/sections/{section_id}", response_model=SectionOut)
def get_section(section_id: UUID, db: Session = Depends(get_db)):
    section = db.get(Section, section_id)
    if not section:
        raise HTTPException(404, "Section not found")
    return section


@router.patch("/sections/{section_id}", response_model=SectionOut)
def update_section(
    section_id: UUID,
    body: SectionUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    section = db.get(Section, section_id)
    if not section:
        raise HTTPException(404, "Section not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(section, key, value)
    db.commit()
    db.refresh(section)
    return section


@router.post("/sections/reorder", response_model=list[SectionOut])
def reorder_sections(
    body: SectionReorderRequest,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    updated: list[Section] = []
    for item in body.items:
        section = db.get(Section, item.id)
        if not section:
            raise HTTPException(404, f"Section {item.id} not found")
        section.sort_order = item.sort_order
        updated.append(section)
    db.commit()
    for section in updated:
        db.refresh(section)
    return sorted(updated, key=lambda s: s.sort_order)


@router.delete("/sections/{section_id}", status_code=204)
def delete_section(
    section_id: UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    section = db.get(Section, section_id)
    if not section:
        raise HTTPException(404, "Section not found")
    db.delete(section)
    db.commit()


# ─── Media ─────────────────────────────────────────────


@router.get("/media", response_model=list[MediaOut])
def list_media(site_id: UUID | None = None, db: Session = Depends(get_db)):
    q = db.query(Media)
    if site_id:
        q = q.filter(Media.site_id == site_id)
    return q.order_by(Media.created_at.desc()).all()


@router.get("/media/{media_id}", response_model=MediaOut)
def get_media(media_id: UUID, db: Session = Depends(get_db)):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(404, "Media not found")
    return media


@router.patch("/media/{media_id}", response_model=MediaOut)
def update_media(
    media_id: UUID,
    body: MediaUpdate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(404, "Media not found")
    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(media, key, value)
    db.commit()
    db.refresh(media)
    return media


@router.delete("/media/{media_id}", status_code=204)
def delete_media(
    media_id: UUID,
    db: Session = Depends(get_db),
    _: dict = Depends(require_admin),
):
    media = db.get(Media, media_id)
    if not media:
        raise HTTPException(404, "Media not found")
    db.delete(media)
    db.commit()


# ─── Contact form ──────────────────────────────────────


@router.post("/contact", response_model=ContactSubmissionOut, status_code=201)
def submit_contact(body: ContactSubmit, db: Session = Depends(get_db)):
    if not db.get(Site, body.site_id):
        raise HTTPException(404, "Site not found")
    row = ContactSubmission(site_id=body.site_id, payload=body.payload)
    db.add(row)
    db.commit()
    db.refresh(row)
    return row


# ─── Public renderer payload ───────────────────────────


@router.get(
    "/public/{site_slug}/pages/{page_slug}",
    response_model=PublicPageOut,
)
def get_public_page(
    site_slug: str,
    page_slug: str,
    response: Response,
    db: Session = Depends(get_db),
):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    site = (
        db.query(Site)
        .options(joinedload(Site.theme))
        .filter(Site.slug == site_slug)
        .first()
    )
    if not site:
        raise HTTPException(404, "Site not found")

    page = (
        db.query(Page)
        .filter(Page.site_id == site.id, Page.slug == page_slug, Page.is_published.is_(True))
        .first()
    )
    if not page:
        raise HTTPException(404, "Page not found")

    sections = (
        db.query(Section)
        .filter(Section.page_id == page.id, Section.is_visible.is_(True))
        .order_by(Section.sort_order)
        .all()
    )

    return PublicPageOut(
        site=site,
        page=page,
        sections=sections,
        theme=site.theme,
    )
