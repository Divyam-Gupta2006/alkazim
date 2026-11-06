import type { Metadata } from "next";
import "./globals.css";
import { Header, Footer } from "@/components/site-shell";

export const metadata: Metadata = {
  title: "Endloops — Financial workflows, reimagined",
  description: "Financial automation for accountants, auditors, finance teams, and property managers. Software prepares the work; professionals review and decide.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><Header/><main>{children}</main><Footer/></body></html>;
}
