"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { loginAdmin } from "@/lib/api";
import { getToken, setToken } from "@/lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (getToken()) router.replace("/admin/sites");
  }, [router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { access_token } = await loginAdmin(password);
      setToken(access_token);
      router.push("/admin/sites");
    } catch {
      setError("Invalid password or API unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a0f] text-zinc-100">
      <div className="pointer-events-none absolute -left-32 top-0 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-violet-500/15 blur-3xl" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
        <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-teal-400">
          Universal Portfolio CMS
        </p>
        <h1 className="mt-3 font-[family-name:var(--font-fraunces)] text-4xl">
          Studio access
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          Manage sites, Consultant Nutritionist & Dietitan sections, SEO & Google tools, and themes — password from backend .env
        </p>
        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <label className="block text-sm text-zinc-400">
            Admin password
            <input
              type="password"
              className="mt-1.5 w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 outline-none focus:border-teal-500/50"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-500 py-3 text-sm font-semibold text-zinc-950 disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter studio"}
          </button>
        </form>
        <Link href="/" className="mt-8 text-sm text-zinc-600 hover:text-zinc-300">
          ← Back to home
        </Link>
      </div>
    </main>
  );
}
