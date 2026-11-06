"use client";

import { useMemo } from "react";

type Props = {
  size?: number;
  className?: string;
  runLap?: boolean;
  color1?: string;
  color2?: string;
  strokeWidth?: number;
};

export function InfinityLoopMark({
  size = 112,
  className = "",
  runLap = false,
  color1 = "#2D8B7C",
  color2 = "#172C35",
  strokeWidth = 20,
}: Props) {
  const { d, start } = useMemo(() => {
    const pts: string[] = [];
    const rx = 135;
    const ry = 60;
    const steps = 360;
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * Math.PI * 2;
      const s = Math.sin(t);
      const c = Math.cos(t);
      const denominator = 1 + s * s;
      const x = (rx * c) / denominator;
      const y = (ry * 2 * Math.SQRT2 * s * c) / denominator;
      pts.push(`${x.toFixed(2)} ${y.toFixed(2)}`);
    }
    return { d: `M${pts.join("L")}Z`, start: pts[0] };
  }, []);

  return (
    <svg
      width={size}
      height={size * (170 / 320)}
      viewBox="-160 -85 320 170"
      role="img"
      aria-label="Endloops infinity mark"
      className={className}
      style={{ display: "block", overflow: "visible" }}
    >
      <defs>
        <linearGradient id="endloops-infinity-gradient" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor={color1} />
          <stop offset="100%" stopColor={color2} />
        </linearGradient>
      </defs>
      <path
        d={d}
        fill="none"
        stroke="url(#endloops-infinity-gradient)"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity=".96"
      />
      <g transform={`translate(${start})`}>
        <circle r={strokeWidth * 0.56} fill={color1} />
        <path
          d={`M ${strokeWidth * 2.15} 0 L ${-strokeWidth * 0.25} ${-strokeWidth * 1.25} L ${strokeWidth * 0.45} 0 L ${-strokeWidth * 0.25} ${strokeWidth * 1.25} Z`}
          fill={color1}
        />
        {runLap && (
          <animateMotion key="one-lap" dur="1.55s" repeatCount="1" fill="freeze" rotate="auto" path={d} />
        )}
      </g>
    </svg>
  );
}