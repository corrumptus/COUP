import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "COUP Game",
  description: "A web version of the COUP game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
