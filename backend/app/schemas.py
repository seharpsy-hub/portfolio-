from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

SectionType = Literal[
    "hero",
    "about",
    "services",
    "testimonials",
    "contact",
    "footer",
    "profile",
    "faq",
]
SiteStatus = Literal["draft", "published", "archived"]
ThemeMode = Literal["light", "dark"]


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# ─── Theme ─────────────────────────────────────────────


class ThemeBase(BaseModel):
    name: str
    slug: str
    description: str | None = None
    preset: str = "custom"
    mode: ThemeMode = "light"
    colors: dict[str, Any] = Field(default_factory=dict)
    fonts: dict[str, Any] = Field(default_factory=dict)
    border_radius: str = "8px"
    style: dict[str, Any] = Field(default_factory=dict)
    animation: dict[str, Any] = Field(default_factory=dict)


class ThemeCreate(ThemeBase):
    pass


class ThemeUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    description: str | None = None
    preset: str | None = None
    mode: ThemeMode | None = None
    colors: dict[str, Any] | None = None
    fonts: dict[str, Any] | None = None
    border_radius: str | None = None
    style: dict[str, Any] | None = None
    animation: dict[str, Any] | None = None


class ThemeOut(ThemeBase, ORMModel):
    id: UUID
    created_at: datetime
    updated_at: datetime


# ─── Site ──────────────────────────────────────────────


class SiteBase(BaseModel):
    name: str
    slug: str
    niche: str | None = None
    domain: str | None = None
    theme_id: UUID | None = None
    status: SiteStatus = "draft"
    settings: dict[str, Any] = Field(default_factory=dict)


class SiteCreate(SiteBase):
    pass


class SiteUpdate(BaseModel):
    name: str | None = None
    slug: str | None = None
    niche: str | None = None
    domain: str | None = None
    theme_id: UUID | None = None
    status: SiteStatus | None = None
    settings: dict[str, Any] | None = None


class SiteOut(SiteBase, ORMModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    theme: ThemeOut | None = None


# ─── Page ──────────────────────────────────────────────


class PageBase(BaseModel):
    title: str
    slug: str
    meta_title: str | None = None
    meta_description: str | None = None
    is_home: bool = False
    is_published: bool = True
    sort_order: int = 0


class PageCreate(PageBase):
    site_id: UUID


class PageUpdate(BaseModel):
    title: str | None = None
    slug: str | None = None
    meta_title: str | None = None
    meta_description: str | None = None
    is_home: bool | None = None
    is_published: bool | None = None
    sort_order: int | None = None


class PageOut(PageBase, ORMModel):
    id: UUID
    site_id: UUID
    created_at: datetime
    updated_at: datetime


# ─── Section ───────────────────────────────────────────


class SectionBase(BaseModel):
    type: SectionType
    config: dict[str, Any] = Field(default_factory=dict)
    sort_order: int = 0
    is_visible: bool = True


class SectionCreate(SectionBase):
    page_id: UUID


class SectionUpdate(BaseModel):
    type: SectionType | None = None
    config: dict[str, Any] | None = None
    sort_order: int | None = None
    is_visible: bool | None = None


class SectionOut(SectionBase, ORMModel):
    id: UUID
    page_id: UUID
    created_at: datetime
    updated_at: datetime


class SectionReorderItem(BaseModel):
    id: UUID
    sort_order: int


class SectionReorderRequest(BaseModel):
    items: list[SectionReorderItem]


# ─── Media ─────────────────────────────────────────────


class MediaOut(ORMModel):
    id: UUID
    site_id: UUID | None
    filename: str
    original_name: str
    url: str
    mime_type: str
    size_bytes: int
    alt_text: str | None = None
    folder: str | None = None
    created_at: datetime


class MediaUpdate(BaseModel):
    alt_text: str | None = None
    folder: str | None = None


# ─── Contact ───────────────────────────────────────────


class ContactSubmit(BaseModel):
    site_id: UUID
    payload: dict[str, Any]


class ContactSubmissionOut(ORMModel):
    id: UUID
    site_id: UUID
    payload: dict[str, Any]
    created_at: datetime


# ─── Auth ──────────────────────────────────────────────


class LoginRequest(BaseModel):
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"


# ─── Public page payload ───────────────────────────────


class PublicPageOut(BaseModel):
    site: SiteOut
    page: PageOut
    sections: list[SectionOut]
    theme: ThemeOut | None = None
