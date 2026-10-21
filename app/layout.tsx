import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Planner",
  description: "A foundation for realistic, energy-aware planning.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}