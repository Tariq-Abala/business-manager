import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#0B0F19",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "BusinessManager | Logiciel de Gestion Commerciale & Facturation PME",
  description:
    "BusinessManager SaaS — Facturation marocaine conforme DGI (ICE, IF, RC), devis, suivi des encaissements et gestion de stock pour PME et indépendants.",
  keywords: ["logiciel gestion", "facturation maroc", "SaaS PME", "devis", "ICE", "gestion commerciale", "comptabilité", "BusinessManager"],
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" className="scroll-smooth dark">
      <body className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] antialiased">
        {children}
      </body>
    </html>
  );
}
