import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Inscrever-se"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
