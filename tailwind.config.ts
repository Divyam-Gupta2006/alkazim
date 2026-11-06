import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "#F5F5EE",
        ink: "#172C35",
        teal: "#2D8B7C",
        mint: "#DCEBE3",
        slate: "#66777A",
        line: "#DDE2D9",
        blue: "#647FBD",
        lilac: "#8C79A8"
      },
      fontFamily: {
        sans: ["Arial", "Helvetica Neue", "sans-serif"],
        serif: ["Georgia", "Times New Roman", "serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(23, 44, 53, 0.08)",
        card: "0 8px 28px rgba(23, 44, 53, 0.06)"
      },
      backgroundImage: {
        "hero-glow": "radial-gradient(circle at 72% 28%, rgba(45,139,124,.11), transparent 30%), radial-gradient(circle at 10% 90%, rgba(140,121,168,.08), transparent 28%)"
      }
    }
  },
  plugins: []
};
export default config;
