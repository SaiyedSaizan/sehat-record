import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sehat Record",
  description: "Investor-demo-ready MVP for patient history aggregation and prescription simplification.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
