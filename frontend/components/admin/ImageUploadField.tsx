"use client";

import { useRef, useState } from "react";
import { getToken } from "@/lib/admin";
import { mediaUrl, uploadMedia } from "@/lib/api";

const ACCEPT = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.svg";

type Props = {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  siteId?: string;
  hint?: string;
  folder?: string;
};

export function ImageUploadField({
  label,
  value = "",
  onChange,
  siteId,
  hint = "JPG, PNG, WebP, GIF — or paste a URL",
  folder = "uploads",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const preview = mediaUrl(value);

  async function onFile(file: File | undefined) {
    if (!file) return;
    const token = getToken();
    if (!token) {
      setErr("Please sign in again.");
      return;
    }
    setBusy(true);
    setErr("");
    try {
      const media = await uploadMedia(token, file, { siteId, folder });
      onChange(media.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-2">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className="text-[11px] text-zinc-600">{hint}</span>
      </div>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-black/25">
        <div className="flex flex-col gap-3 p-3 sm:flex-row sm:items-stretch">
          <div className="relative flex h-28 w-full shrink-0 items-center justify-center overflow-hidden rounded-lg bg-zinc-900/80 sm:w-36">
            {preview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="px-2 text-center text-[11px] text-zinc-600">No photo yet</span>
            )}
          </div>

          <div className="flex min-w-0 flex-1 flex-col gap-2">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                disabled={busy}
                onClick={() => inputRef.current?.click()}
                className="rounded-lg bg-teal-500 px-3 py-2 text-xs font-semibold text-zinc-950 hover:bg-teal-400 disabled:opacity-50"
              >
                {busy ? "Uploading…" : "Upload photo"}
              </button>
              {value ? (
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => onChange("")}
                  className="rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-400 hover:border-red-500/40 hover:text-red-300"
                >
                  Remove
                </button>
              ) : null}
            </div>
            <input
              className="w-full rounded-lg border border-white/10 bg-black/40 px-3 py-2 text-xs text-zinc-200 outline-none focus:border-teal-500/50"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="/media/... or https://..."
            />
            {err ? <p className="text-xs text-red-400">{err}</p> : null}
          </div>
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        className="hidden"
        onChange={(e) => onFile(e.target.files?.[0])}
      />
    </div>
  );
}
