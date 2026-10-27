"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Sparkles,
  CreditCard,
  Zap,
  ArrowRight,
  ShieldCheck,
  Building2,
  Clock,
  HelpCircle,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";

export default function TarifsPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-12 max-w-6xl mx-auto w-full">
            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Formules Adaptées aux PME Marocaines</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Tarifs Simples &amp; Transparents en MAD
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Sans engagement de durée. Choisissez la formule correspondant à la taille de votre équipe et faites évoluer votre abonnement à tout moment.
              </p>

              {/* Cycle Toggle */}
              <div className="inline-flex items-center gap-2 p-1 rounded-2xl bg-slate-200/60 border border-slate-300 text-xs mt-2">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                    billingCycle === "monthly"
                      ? "bg-white text-slate-900 shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Mensuel
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                    billingCycle === "yearly"
                      ? "bg-blue-600 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Annuel (-20% de remise)
                </button>
              </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {/* Starter */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    STARTER
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Auto-Entrepreneur &amp; TPE</h3>
                  <p className="text-xs text-slate-500 mt-1">Idéal pour les indépendants et consultants de services.</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {billingCycle === "yearly" ? "150" : "190"}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">MAD / mois</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {billingCycle === "yearly" ? "Facturé 1 800 MAD par an" : "Facturation mensuelle sans engagement"}
                  </span>

                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Jusqu&apos;à 50 factures &amp; devis / mois</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>1 Utilisateur gestionnaire</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Mentions administratives types (ICE, IF, RC)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Impression A4 &amp; export PDF standard</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors block"
                >
                  Tester la Démo Starter
                </Link>
              </div>

              {/* PME Croissance (Recommended) */}
              <div className="p-8 rounded-3xl bg-white border-2 border-blue-600 shadow-xl shadow-blue-600/10 flex flex-col justify-between space-y-6 relative">
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-blue-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                  Recommandé pour PME
                </span>

                <div>
                  <span className="text-[10px] font-mono font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    PME CROISSANCE
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Sociétés &amp; SARL</h3>
                  <p className="text-xs text-slate-500 mt-1">Pour les entreprises commerciales et prestataires de services.</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-blue-600">
                      {billingCycle === "yearly" ? "360" : "450"}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">MAD / mois</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {billingCycle === "yearly" ? "Facturé 4 320 MAD par an" : "Facturation mensuelle sans engagement"}
                  </span>

                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span><strong>Factures &amp; Devis illimités</strong></span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>5 Utilisateurs avec droits d&apos;accès</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Gestion des stocks &amp; alertes de réassort</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Conversion 1-clic Devis en Facture</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Export CSV &amp; suivi des encaissements</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/"
                  className="w-full py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold text-center shadow-md shadow-blue-600/20 transition-all block"
                >
                  Accéder à la Démo PME
                </Link>
              </div>

              {/* Entreprise Scale */}
              <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
                <div>
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    SCALE HOLDING
                  </span>
                  <h3 className="text-xl font-bold text-slate-900">Multi-Filiales &amp; Groupes</h3>
                  <p className="text-xs text-slate-500 mt-1">Gestion centralisée multi-entités et volumes importants.</p>

                  <div className="mt-6 flex items-baseline gap-1.5">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {billingCycle === "yearly" ? "710" : "890"}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">MAD / mois</span>
                  </div>
                  <span className="text-[11px] text-slate-400">
                    {billingCycle === "yearly" ? "Facturé 8 520 MAD par an" : "Facturation mensuelle sans engagement"}
                  </span>

                  <ul className="mt-6 space-y-3 text-xs text-slate-600">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Utilisateurs &amp; Filiales illimités</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Multi-devises et TVA paramétrable</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Accès API REST &amp; Webhooks de synchronisation</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Support prioritaire et assistance déploiement</span>
                    </li>
                  </ul>
                </div>

                <Link
                  href="/"
                  className="w-full py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold text-center transition-colors block"
                >
                  Tester la Démo Scale
                </Link>
              </div>
            </div>

            {/* Feature comparison table */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <h2 className="text-lg font-bold text-slate-900">
                Tableau Comparatif des Fonctionnalités
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-y border-slate-200 text-slate-600 font-bold">
                      <th className="py-3 px-4">Fonctionnalité</th>
                      <th className="py-3 px-4 text-center">Starter</th>
                      <th className="py-3 px-4 text-center">PME Croissance</th>
                      <th className="py-3 px-4 text-center">Scale Holding</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="py-3 px-4 font-medium">Factures &amp; Devis</td>
                      <td className="py-3 px-4 text-center">50 / mois</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600">Illimités</td>
                      <td className="py-3 px-4 text-center font-bold text-blue-600">Illimités</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Gestion des Stocks Matériels</td>
                      <td className="py-3 px-4 text-center text-slate-300">—</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Conversion Devis en Facture</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Suivi des Encaissements &amp; Reste Dû</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Export Comptable CSV</td>
                      <td className="py-3 px-4 text-center text-slate-300">—</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4 font-medium">Multi-Entités / Filiales</td>
                      <td className="py-3 px-4 text-center text-slate-300">—</td>
                      <td className="py-3 px-4 text-center text-slate-300">—</td>
                      <td className="py-3 px-4 text-center text-emerald-600 font-bold">Inclus</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>
    </div>
  );
}
