import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#070a0f] text-[#e8eef7]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(20,184,166,0.18),_transparent_55%)]" />
      <div className="relative mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6 py-20">
        <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-teal-400/90">
          Universal Portfolio CMS
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-fraunces)] text-5xl leading-tight">
          Database-driven sites with real themes & motion
        </h1>
        <p className="mt-5 text-[#94a3b8]">
          Five integrated presets · Framer Motion entrances · Admin theme studio ·
          Section builder with live preview.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/site/nourish-thrive/home"
            className="bg-teal-500 px-5 py-3 text-center text-sm font-semibold text-zinc-950 transition hover:bg-teal-400"
          >
            View nutrition demo
          </Link>
          <Link
            href="/admin"
            className="border border-white/15 px-5 py-3 text-center text-sm transition hover:border-teal-500/50"
          >
            Open studio
          </Link>
        </div>
      </div>
    </main>
  );
}
