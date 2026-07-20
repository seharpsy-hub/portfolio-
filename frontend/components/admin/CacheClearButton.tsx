"use client";

import { useState } from "react";
import { clearAllCaches } from "@/lib/api";
import { getToken } from "@/lib/admin";

export function CacheClearButton({ className = "" }: { className?: string }) {
  const [status, setStatus] = useState<"idle" | "working" | "ok" | "err">("idle");
  const [detail, setDetail] = useState("");

  async function onClear() {
    const token = getToken();
    if (!token) {
      setStatus("err");
      setDetail("Not signed in");
      return;
    }
    setStatus("working");
    setDetail("");
    try {
      const at = await clearAllCaches(token);
      setStatus("ok");
      setDetail(`Cleared ${new Date(at).toLocaleTimeString()}`);
      // Force live iframes / open tabs to refetch
      window.dispatchEvent(new CustomEvent("cms-cache-cleared", { detail: at }));
    } catch {
      setStatus("err");
      setDetail("Clear failed — is the API running?");
    }
  }

  return (
    <div className={`flex flex-col items-start gap-1 ${className}`}>
      <button
        type="button"
        onClick={onClear}
        disabled={status === "working"}
        className="rounded-md border border-amber-500/40 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-200 transition hover:bg-amber-500/20 disabled:opacity-60"
      >
        {status === "working" ? "Clearing…" : "Clear cache"}
      </button>
      {status === "ok" ? (
        <span className="text-[10px] text-teal-400">{detail || "Cache cleared"}</span>
      ) : null}
      {status === "err" ? (
        <span className="text-[10px] text-red-400">{detail}</span>
      ) : null}
    </div>
  );
}
