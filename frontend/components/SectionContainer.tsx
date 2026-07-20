/** Shared inner content width + horizontal inset so text never hugs the section edge. */
export function SectionContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-full px-4 sm:px-8 md:px-10 lg:px-12 ${className}`}
      style={{ maxWidth: "var(--container)" }}
    >
      {children}
    </div>
  );
}
