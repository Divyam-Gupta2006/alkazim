import type { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "infinity-loop": DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> & {
        mode?: "snake" | "draw";
        "scale-x"?: string;
        "scale-y"?: string;
        speed?: string;
        length?: string;
        width?: string;
        size?: string;
        color1?: string;
        color2?: string;
        track?: "true" | "false";
        arrow?: "true" | "false";
        reverse?: "true" | "false";
      };
    }
  }
}
export {};