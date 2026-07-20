"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CacheClearButton } from "@/components/admin/CacheClearButton";
import { clearToken, getToken } from "@/lib/admin";

const NAV = [
  { href: "/admin/sites", label: "Sites & pages", hint: "Content & themes" },
  { href: "/admin/pages", label: "Sections", hint: "Pick a page from Sites", soft: true },
  { href: "/admin/seo", label: "SEO & marketing", hint: "Google tools & meta" },
  { href: "/admin/themes", label: "Theme studio", hint: "Colors & style" },
];

export function AdminShell({
  children,
  title,
  subtitle,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function logout() {
    clearToken();
    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-[#0b0f14] text-zinc-100">
      <div className="mx-auto flex min-h-screen max-w-[1440px]">
        <aside className="hidden w-60 shrink-0 border-r border-white/[0.06] bg-[#080b10] p-5 md:flex md:flex-col">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-teal-400/90">
              Portfolio CMS
            </p>
            <p className="mt-1.5 text-sm font-medium text-zinc-200">Studio console</p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500">
              Edit content, SEO, and look — then preview live.
            </p>
          </div>

          <nav className="mt-8 flex-1 space-y-1">
            {NAV.filter((item) => !item.soft).map((item) => {
              const active =
                item.href === "/admin/sites"
                  ? pathname.startsWith("/admin/sites") || pathname.startsWith("/admin/pages")
                  : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block rounded-lg px-3 py-2.5 transition ${
                    active
                      ? "bg-teal-500/12 text-teal-100 ring-1 ring-teal-500/25"
                      : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-100"
                  }`}
                >
                  <span className="block text-sm font-medium">{item.label}</span>
                  <span className="mt-0.5 block text-[11px] text-zinc-500">{item.hint}</span>
                </Link>
              );
            })}
          </nav>

          <div className="space-y-3 border-t border-white/[0.06] pt-5">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
              Quick actions
            </p>
            <CacheClearButton />
            <a
              href="/site/nourish-thrive/home"
              target="_blank"
              rel="noreferrer"
              className="block rounded-lg px-3 py-2 text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-teal-300"
            >
              Open live site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
            >
              Log out
            </button>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex flex-wrap items-end justify-between gap-4 border-b border-white/[0.06] bg-[#0b0f14]/90 px-5 py-4 backdrop-blur-md md:px-8">
            <div className="min-w-0">
              <div className="mb-2 flex gap-2 md:hidden">
                {NAV.filter((n) => !n.soft).map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`rounded-md px-2.5 py-1 text-xs ${
                      pathname.startsWith(item.href)
                        ? "bg-teal-500/15 text-teal-200"
                        : "text-zinc-500"
                    }`}
                  >
                    {item.label.split(" ")[0]}
                  </Link>
                ))}
              </div>
              <h1 className="font-[family-name:var(--font-fraunces)] text-2xl tracking-tight">
                {title}
              </h1>
              {subtitle ? <p className="mt-1 max-w-2xl text-sm text-zinc-500">{subtitle}</p> : null}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <div className="md:hidden">
                <CacheClearButton />
              </div>
              {actions}
            </div>
          </header>
          <div className="flex-1 px-5 py-6 md:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function useRequireAdmin() {
  const router = useRouter();
  if (typeof window !== "undefined" && !getToken()) {
    router.replace("/admin");
    return null;
  }
  return getToken();
}
