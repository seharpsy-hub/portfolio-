"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import type { Theme, ThemeAnimation } from "@/lib/types";
import { DEFAULT_ANIMATION } from "@/lib/theme";
import { useIsMobile } from "@/lib/useIsMobile";

function variants(
  anim: ThemeAnimation,
  override?: string,
  layoutStyle = 0,
  mobile = false
) {
  const entrance =
    override && override !== "inherit"
      ? override
      : layoutStyle === 1
        ? "slide-left"
        : layoutStyle === 2
          ? "scale-in"
          : layoutStyle === 3
            ? "fade-in"
            : anim.entrance ?? "fade-up";
  // Softer entrances on mobile — less horizontal slide (feels jumpy on narrow screens)
  const distance = mobile
    ? 18
    : (anim.distance ?? 28) + layoutStyle * 8;
  const duration = mobile
    ? 0.55
    : (anim.duration ?? 0.7) + layoutStyle * 0.05;
  const ease = [0.22, 1, 0.36, 1] as const;

  switch (entrance) {
    case "fade-in":
      return {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { duration, ease } },
      };
    case "slide-left":
      return {
        hidden: { opacity: 0, x: mobile ? 0 : distance, y: mobile ? distance : 0 },
        show: { opacity: 1, x: 0, y: 0, transition: { duration, ease } },
      };
    case "scale-in":
      return {
        hidden: { opacity: 0, scale: mobile ? 0.97 : 0.92 },
        show: { opacity: 1, scale: 1, transition: { duration, ease } },
      };
    case "fade-up":
    default:
      return {
        hidden: { opacity: 0, y: distance },
        show: { opacity: 1, y: 0, transition: { duration, ease } },
      };
  }
}

export function MotionSection({
  children,
  theme,
  className,
  style,
  id,
  entrance,
  delay = 0,
  layoutStyle = 0,
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
  id?: string;
  entrance?: string;
  delay?: number;
  layoutStyle?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const anim = { ...DEFAULT_ANIMATION, ...theme.animation };
  const v = variants(anim, entrance, layoutStyle, mobile);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Mobile: almost no parallax so scroll feels stable & professional
  const yRange = reduce || mobile
    ? ([0, 0, 0] as const)
    : layoutStyle === 0
      ? ([36, 0, -16] as const)
      : layoutStyle === 1
        ? ([48, 0, -24] as const)
        : layoutStyle === 2
          ? ([28, 0, -32] as const)
          : ([40, 0, -14] as const);

  const y = useTransform(scrollYProgress, [0, 0.45, 1], [...yRange]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.4, 1],
    reduce || mobile
      ? [1, 1, 1]
      : layoutStyle === 2
        ? [0.96, 1, 0.99]
        : [0.99, 1, 1]
  );

  if (reduce) {
    return (
      <section id={id} className={className} style={style} ref={ref}>
        {children}
      </section>
    );
  }

  return (
    <motion.section
      ref={ref}
      id={id}
      className={className}
      style={{ ...style, y, scale }}
      initial="hidden"
      whileInView="show"
      viewport={{
        once: true,
        amount: mobile ? 0.12 : 0.18,
        margin: mobile ? "0px 0px -4% 0px" : "0px 0px -6% 0px",
      }}
      variants={{
        hidden: v.hidden,
        show: {
          ...v.show,
          transition: {
            ...(typeof v.show === "object" && "transition" in v.show
              ? v.show.transition
              : {}),
            delay,
          },
        },
      }}
    >
      {children}
    </motion.section>
  );
}

export function StaggerChildren({
  children,
  theme,
  className,
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const stagger = mobile
    ? Math.min(theme.animation?.stagger ?? 0.06, 0.06)
    : theme.animation?.stagger ?? 0.08;

  if (reduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: mobile ? 0.08 : 0.12 }}
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  theme,
  className,
  style,
}: {
  children: ReactNode;
  theme: Theme;
  className?: string;
  style?: React.CSSProperties;
}) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const v = variants({ ...DEFAULT_ANIMATION, ...theme.animation }, undefined, 0, mobile);

  if (reduce) {
    return (
      <div className={className} style={style}>
        {children}
      </div>
    );
  }

  const hover = theme.animation?.hover ?? "lift";
  const whileHover = mobile
    ? undefined
    : hover === "lift"
      ? { y: -6, scale: 1.01, transition: { duration: 0.25 } }
      : hover === "glow"
        ? {
            boxShadow:
              "0 0 40px color-mix(in srgb, var(--color-primary) 40%, transparent)",
          }
        : undefined;

  return (
    <motion.div
      className={className}
      style={style}
      variants={v}
      whileHover={whileHover}
    >
      {children}
    </motion.div>
  );
}

export function FloatingOrbs() {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  if (reduce || mobile) return null;

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <motion.div
        className="absolute left-[8%] top-[18%] h-40 w-40 rounded-full bg-white/15 blur-2xl"
        animate={{ y: [0, -28, 0], x: [0, 14, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[12%] right-[10%] h-56 w-56 rounded-full bg-[var(--color-accent)]/25 blur-3xl"
        animate={{ y: [0, 34, 0], x: [0, -18, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute right-[28%] top-[30%] h-24 w-24 rounded-full bg-white/20 blur-xl"
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}

export function ParallaxPanel({
  children,
  className,
  speed = 40,
}: {
  children: ReactNode;
  className?: string;
  speed?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    mobile || reduce ? [0, 0] : [speed * 0.6, -speed * 0.6]
  );

  if (reduce || mobile) {
    return (
      <div ref={ref} className={className}>
        {children}
      </div>
    );
  }

  return (
    <motion.div ref={ref} className={className} style={{ y }}>
      {children}
    </motion.div>
  );
}

export function ScrollRevealRow({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const mobile = useIsMobile();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: mobile ? 16 : 0, x: mobile ? 0 : 32 }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
