"use client";
import { useEffect } from "react";

export function AnimatedInfinityLogo({ className = "" }: { className?: string }) {
  useEffect(() => {
    import("@/components/infinity-loop-element");
  }, []);

  return (
    <infinity-loop
      className={className}
      mode="snake"
      scale-x="179"
      scale-y="66"
      speed="0.2"
      length="0.9"
      width="30"
      size="590"
      color1="#07AD67"
      color2="#0A877C"
      track="false"
      arrow="true"
    />
  );
}