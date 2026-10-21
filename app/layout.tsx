import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Energy Planner",
  description: "A calm place to make a plan that fits.",
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