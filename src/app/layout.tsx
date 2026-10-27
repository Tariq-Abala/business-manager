import type { Metadata, Viewport } from "next";
import "./globals.css";
import { BusinessProvider } from "@/context/BusinessContext";

export const viewport: Viewport = {
  themeColor: "#F8FAFC",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BusinessManager SaaS | Logiciel de Facturation & Gestion Commerciale PME",
  description:
    "Application SaaS de facturation, devis, suivi des créances et gestion de stocks pour PME au Maroc. Projet de démonstration interactive conçu par Tariq Abala.",
  keywords: [
    "gestion commerciale",
    "facturation PME",
    "devis",
    "créances",
    "SaaS Maroc",
    "Casablanca",
    "stocks",
    "BusinessManager",
  ],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className="min-h-screen bg-[#F8FAFC] text-[#0F172A] antialiased selection:bg-blue-100 selection:text-blue-900">
        <BusinessProvider>{children}</BusinessProvider>
      </body>
    </html>
  );
}
