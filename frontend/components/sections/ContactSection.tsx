"use client";

import { useState } from "react";
import { submitContact } from "@/lib/api";
import { SectionContainer } from "@/components/SectionContainer";
import { arr, sectionBackground, sectionPadding, sectionShell, str } from "@/lib/theme";
import type { Theme } from "@/lib/types";
import { MotionSection } from "@/components/MotionSection";

interface ContactProps {
  config: Record<string, unknown>;
  siteId: string;
  theme: Theme;
  layoutStyle?: number;
}

export function ContactSection({ config, siteId, theme, layoutStyle = 0 }: ContactProps) {
  const title = str(config.title, "Contact");
  const subtitle = str(config.subtitle);
  const address = str(config.address);
  const phone = str(config.phone);
  const email = str(config.email);
  const hours = str(config.hours);
  const formEnabled = config.formEnabled !== false;
  const fields = arr<string>(config.formFields);
  const padding = sectionPadding(str(config.paddingY), theme.style?.spacing);
  const style = sectionBackground(str(config.background), theme);
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "err">("idle");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, string> = {};
    fd.forEach((v, k) => {
      payload[k] = String(v);
    });
    try {
      await submitContact(siteId, payload);
      setStatus("ok");
      e.currentTarget.reset();
    } catch {
      setStatus("err");
    }
  }

  const defaultFields =
    fields.length > 0 ? fields : ["name", "email", "phone", "message"];

  const inputStyle = {
    borderRadius: "var(--radius)",
    borderColor: "var(--color-border)",
    background: theme.style?.glass ? "rgba(255,255,255,0.04)" : "transparent",
  };

  return (
    <MotionSection
      id="contact"
      theme={theme}
      layoutStyle={layoutStyle}
      className={sectionShell(padding)}
      style={style}
    >
      <SectionContainer className="grid gap-8 sm:gap-10 md:grid-cols-2 md:gap-12">
        <div className="min-w-0">
          {subtitle ? (
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[var(--color-primary)] sm:text-sm sm:tracking-[0.2em]">
              {subtitle}
            </p>
          ) : null}
          <h2 className="mt-2 text-2xl sm:mt-3 sm:text-3xl md:text-5xl" style={{ fontFamily: "var(--font-heading)" }}>
            {title}
          </h2>
          <ul className="mt-8 space-y-4 text-[var(--color-text-muted)]">
            {address ? <li>{address}</li> : null}
            {phone ? (
              <li>
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:underline">
                  {phone}
                </a>
              </li>
            ) : null}
            {email ? (
              <li>
                <a href={`mailto:${email}`} className="hover:underline">
                  {email}
                </a>
              </li>
            ) : null}
            {hours ? <li>{hours}</li> : null}
          </ul>
        </div>
        {formEnabled ? (
          <form onSubmit={onSubmit} className="space-y-4">
            {defaultFields.map((field) =>
              field === "message" ? (
                <label key={field} className="block">
                  <span className="text-sm capitalize text-[var(--color-text-muted)]">{field}</span>
                  <textarea
                    name={field}
                    required
                    rows={4}
                    className="mt-1 w-full border px-3 py-2.5 outline-none focus:border-[var(--color-primary)]"
                    style={inputStyle}
                  />
                </label>
              ) : (
                <label key={field} className="block">
                  <span className="text-sm capitalize text-[var(--color-text-muted)]">{field}</span>
                  <input
                    name={field}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                    required={field !== "phone"}
                    className="mt-1 w-full border px-3 py-2.5 outline-none focus:border-[var(--color-primary)]"
                    style={inputStyle}
                  />
                </label>
              )
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full px-6 py-3.5 text-sm font-medium text-white disabled:opacity-60"
              style={{
                borderRadius: "var(--radius)",
                background:
                  theme.style?.buttonStyle === "gradient"
                    ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))"
                    : "var(--color-primary)",
              }}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "ok" ? (
              <p className="text-sm text-[var(--color-primary)]">Message sent. We&apos;ll be in touch.</p>
            ) : null}
            {status === "err" ? (
              <p className="text-sm text-red-500">Something went wrong. Try again.</p>
            ) : null}
          </form>
        ) : null}
      </SectionContainer>
    </MotionSection>
  );
}
