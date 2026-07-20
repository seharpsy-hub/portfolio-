import type { PublicPagePayload, Section, Site, Page } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

function authHeaders(token?: string): HeadersInit {
  const h: HeadersInit = { "Content-Type": "application/json" };
  if (token) h.Authorization = `Bearer ${token}`;
  return h;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API}${path}`, {
    cache: "no-store",
    ...init,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

export async function fetchPublicPage(
  siteSlug: string,
  pageSlug: string
): Promise<PublicPagePayload> {
  return request(`/api/public/${siteSlug}/pages/${pageSlug}`);
}

export async function loginAdmin(password: string): Promise<{ access_token: string }> {
  return request("/api/auth/login", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ password }),
  });
}

export async function listSites(token: string): Promise<Site[]> {
  return request("/api/sites", { headers: authHeaders(token) });
}

export async function listPages(siteId: string, token?: string): Promise<Page[]> {
  return request(`/api/pages?site_id=${siteId}`, {
    headers: authHeaders(token),
  });
}

export async function listSections(pageId: string, token?: string): Promise<Section[]> {
  return request(`/api/sections?page_id=${pageId}`, {
    headers: authHeaders(token),
  });
}

export async function createSection(
  token: string,
  body: { page_id: string; type: string; config?: Record<string, unknown>; sort_order?: number }
): Promise<Section> {
  return request("/api/sections", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function updateSection(
  token: string,
  id: string,
  body: Partial<Pick<Section, "type" | "config" | "sort_order" | "is_visible">>
): Promise<Section> {
  return request(`/api/sections/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function deleteSection(token: string, id: string): Promise<void> {
  return request(`/api/sections/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
  });
}

export async function reorderSections(
  token: string,
  items: { id: string; sort_order: number }[]
): Promise<Section[]> {
  return request("/api/sections/reorder", {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify({ items }),
  });
}

export async function submitContact(
  siteId: string,
  payload: Record<string, unknown>
): Promise<void> {
  await request("/api/contact", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ site_id: siteId, payload }),
  });
}

export async function listThemes(token?: string): Promise<import("./types").Theme[]> {
  return request("/api/themes", { headers: authHeaders(token) });
}

export async function updateSite(
  token: string,
  id: string,
  body: Partial<{
    name: string;
    slug: string;
    niche: string | null;
    theme_id: string | null;
    status: string;
    settings: Record<string, unknown>;
  }>
): Promise<import("./types").Site> {
  return request(`/api/sites/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function getSite(id: string, token?: string): Promise<import("./types").Site> {
  return request(`/api/sites/${id}`, { headers: authHeaders(token) });
}

export async function updateTheme(
  token: string,
  id: string,
  body: Partial<{
    name: string;
    description: string | null;
    mode: string;
    colors: Record<string, string>;
    fonts: Record<string, string>;
    border_radius: string;
    style: Record<string, unknown>;
    animation: Record<string, unknown>;
  }>
): Promise<import("./types").Theme> {
  return request(`/api/themes/${id}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export async function clearServerCache(token: string): Promise<{
  ok: boolean;
  cleared_at: string;
  redis: string;
  message: string;
}> {
  return request("/api/admin/cache/clear", {
    method: "POST",
    headers: authHeaders(token),
  });
}

export async function clearNextCache(): Promise<{ ok: boolean; message?: string }> {
  const res = await fetch("/api/revalidate", { method: "POST", cache: "no-store" });
  if (!res.ok) throw new Error("Next revalidate failed");
  return res.json();
}

/** Clear API Redis (if any) + Next.js data cache + bump local bust token. */
export async function clearAllCaches(token: string): Promise<string> {
  const api = await clearServerCache(token);
  try {
    await clearNextCache();
  } catch {
    /* Next route may fail outside app router context — still ok */
  }
  const bust = String(Date.now());
  if (typeof window !== "undefined") {
    localStorage.setItem("portfolio_cms_cache_bust", bust);
  }
  return api.cleared_at || bust;
}

export function cacheBustQuery(): string {
  if (typeof window === "undefined") return String(Date.now());
  return localStorage.getItem("portfolio_cms_cache_bust") ?? String(Date.now());
}

export function mediaUrl(path: string | undefined | null): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http")) return path;
  return `${API}${path.startsWith("/") ? "" : "/"}${path}`;
}

export interface MediaAsset {
  id: string;
  site_id?: string | null;
  filename: string;
  original_name: string;
  url: string;
  mime_type: string;
  size_bytes: number;
  alt_text?: string | null;
  folder?: string | null;
}

export async function uploadMedia(
  token: string,
  file: File,
  opts?: { siteId?: string; altText?: string; folder?: string }
): Promise<MediaAsset> {
  const form = new FormData();
  form.append("file", file);
  if (opts?.siteId) form.append("site_id", opts.siteId);
  if (opts?.altText) form.append("alt_text", opts.altText);
  form.append("folder", opts?.folder ?? "uploads");

  const res = await fetch(`${API}/api/media/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || res.statusText);
  }
  return res.json();
}

export async function listMedia(
  token: string,
  siteId?: string
): Promise<MediaAsset[]> {
  const q = siteId ? `?site_id=${siteId}` : "";
  return request(`/api/media${q}`, { headers: authHeaders(token) });
}

export async function getPage(pageId: string, token?: string): Promise<Page> {
  return request(`/api/pages/${pageId}`, { headers: authHeaders(token) });
}

export async function updatePage(
  token: string,
  pageId: string,
  body: Partial<{
    title: string;
    slug: string;
    meta_title: string | null;
    meta_description: string | null;
    is_home: boolean;
    is_published: boolean;
    sort_order: number;
  }>
): Promise<Page> {
  return request(`/api/pages/${pageId}`, {
    method: "PATCH",
    headers: authHeaders(token),
    body: JSON.stringify(body),
  });
}

export { API };
