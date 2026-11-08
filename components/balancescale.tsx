
"use client";

import { motion } from "framer-motion";

export type ScaleSide = "solutions" | "tools";

const MAX_TILT = 9; // degrees

const beamSpring = {
  type: "spring",
  stiffness: 140,
  damping: 11,
  mass: 1,
} as const;

const panSpring = {
  type: "spring",
  stiffness: 95,
  damping: 7.5,
  mass: 0.6,
} as const;

/**
 * Layered balance scale illustration.
 *
 * Assets:
 * - /images/base.png
 * - /images/beam.png
 * - /images/pan-left.png
 * - /images/pan-right.png
 *
 * Hovering a pan tilts the beam towards that side.
 * Each pan counter-rotates to remain visually upright.
 */
export function BalanceScale({
  activeSide,
  onActivate,
  className = "",
}: {
  activeSide: ScaleSide | null;
  onActivate: (side: ScaleSide | null) => void;
  className?: string;
}) {
  const tilt = activeSide === "solutions" ? -MAX_TILT : activeSide === "tools" ? MAX_TILT : 0;

  return (
    <div
      className={`relative mx-auto aspect-[578/432] w-full select-none ${className}`}
    >
      {/* Rotating beam and hanging pans */}
      <motion.div
        className="absolute inset-0"
        style={{ transformOrigin: "49.65% 22%" }}
        animate={{ rotate: tilt }}
        transition={beamSpring}
      >
        {/* Main beam */}
        <picture>
          <source srcSet="/images/beam.webp" type="image/webp" />
          <img
            src="/images/beam.png"
            alt=""
            width={382}
            height={51}
            loading="lazy"
            decoding="async"
            draggable={false}
            className="absolute"
            style={{
              left: "16.78%",
              top: "19.9%",
              width: "66.1%",
            }}
          />
        </picture>

        {/* Left pan: End-to-end solutions */}
        <Pan
          side="solutions"
          counterRotate={-tilt}
          active={activeSide === "solutions"}
          label="End-to-end solutions"
          style={{
            left: "8.1%",
            top: "31.7%",
            width: "23.5%",
          }}
          onEnter={() => onActivate("solutions")}
          onLeave={() => onActivate(null)}
        />

        {/* Right pan: Standalone tools */}
        <Pan
          side="tools"
          counterRotate={-tilt}
          active={activeSide === "tools"}
          label="Standalone tools"
          style={{
            left: "68.5%",
            top: "31.7%",
            width: "23.5%",
          }}
          onEnter={() => onActivate("tools")}
          onLeave={() => onActivate(null)}
        />
      </motion.div>

      {/* Stationary base */}
      <picture>
        <source srcSet="/images/base.webp" type="image/webp" />
        <img
          src="/images/base.png"
          alt="Endloops balance scale"
          width={125}
          height={398}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="absolute"
          style={{
            left: "38.9%",
            top: "4.4%",
            width: "21.6%",
          }}
        />
      </picture>
    </div>
  );
}

/* Individual hanging pan */
function Pan({
  side,
  counterRotate,
  active,
  label,
  style,
  onEnter,
  onLeave,
}: {
  side: ScaleSide;
  counterRotate: number;
  active: boolean;
  label: string;
  style: React.CSSProperties;
  onEnter: () => void;
  onLeave: () => void;
}) {
  return (
    <motion.div
      className="absolute cursor-pointer"
      style={{
        transformOrigin: side === "solutions" ? "50% 0%" : "47% 0%",
        ...style,
      }}
      animate={{ rotate: counterRotate }}
      transition={panSpring}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      tabIndex={0}
      role="button"
      aria-pressed={active}
      aria-label={`Show ${label}`}
    >
      <picture>
        <source
          srcSet={`/images/pan-${side === "solutions" ? "left" : "right"}.webp`}
          type="image/webp"
        />
        <img
          src={`/images/pan-${side === "solutions" ? "left" : "right"}.png`}
          alt=""
          width={136}
          height={206}
          loading="lazy"
          decoding="async"
          draggable={false}
          className="w-full"
        />
      </picture>

      <span
        className={`absolute left-1/2 top-full mt-3 w-max -translate-x-1/2 text-xs font-semibold tracking-[-.01em] transition-colors ${
          active ? "text-ink" : "text-slate/55"
        }`}
      >
        {label}
      </span>
    </motion.div>
  );
}
