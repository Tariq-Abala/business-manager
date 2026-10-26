"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  FileCheck2,
  Receipt,
  TrendingUp,
  CreditCard,
  Building2,
  Users,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Download,
  Plus,
  Trash2,
  FileText,
  DollarSign,
  BarChart3,
  Layers,
  Sparkles,
  Zap,
} from "lucide-react";

interface InvoiceLine {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export default function BusinessManagerPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("yearly");
  const [dashboardPeriod, setDashboardPeriod] = useState<"mois" | "trimestre" | "annee">("mois");

  // Interactive Invoice Builder State
  const [clientCompany, setClientCompany] = useState("Société Atlas Logistique SARL");
  const [clientICE, setClientICE] = useState("002345678000045");
  const [invoiceNumber, setInvoiceNumber] = useState("FAC-2026-0842");
  const [invoiceDate, setInvoiceDate] = useState("2026-11-01");
  const [invoiceItems, setInvoiceItems] = useState<InvoiceLine[]>([
    {
      id: "1",
      description: "Prestation de Conseil en Optimisation des Flux (Jours/Homme)",
      quantity: 5,
      unitPrice: 4500,
    },
    {
      id: "2",
      description: "Déploiement & Configuration Plateforme Cloud ERP",
      quantity: 1,
      unitPrice: 12000,
    },
    {
      id: "3",
      description: "Support Technique & Maintenance Garantie (Trimestre 1)",
      quantity: 1,
      unitPrice: 6500,
    },
  ]);

  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Calculations
  const subtotalHT = invoiceItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const tvaRate = 0.20; // 20% Moroccan standard TVA
  const tvaAmount = subtotalHT * tvaRate;
  const totalTTC = subtotalHT + tvaAmount;

  const handleAddItem = () => {
    const newItem: InvoiceLine = {
      id: Date.now().toString(),
      description: "Nouvelle prestation de service ou fourniture",
      quantity: 1,
      unitPrice: 1500,
    };
    setInvoiceItems([...invoiceItems, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (invoiceItems.length > 1) {
      setInvoiceItems(invoiceItems.filter((i) => i.id !== id));
    }
  };

  const handleUpdateItem = (id: string, field: keyof InvoiceLine, val: string | number) => {
    setInvoiceItems(
      invoiceItems.map((item) => {
        if (item.id === id) {
          return { ...item, [field]: val };
        }
        return item;
      })
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-[#F9FAFB] selection:bg-[#6366F1]/30 selection:text-white">
      {/* Top Banner Notice */}
      <div className="bg-[#111827] border-b border-[#6366F1]/20 py-2.5 px-4 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-[#9CA3AF]">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="text-[#F9FAFB] font-semibold">BusinessManager SaaS V3.4</span>
            <span className="hidden sm:inline text-slate-700">|</span>
            <span className="hidden sm:inline text-indigo-400">
              100% Conforme aux Normes Fiscales Marocaines (ICE, IF, RC, Loi de Finances 2026)
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="text-emerald-400 font-medium">Essai Gratuit 14 Jours Sans CB</span>
            <span className="text-slate-700 hidden sm:inline">|</span>
            <span className="text-slate-400 hidden sm:inline">Support Basé à Casablanca</span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="sticky top-0 z-40 backdrop-blur-md bg-[#0B0F19]/95 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-[#F9FAFB]">
                  BusinessManager
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                  ERP CLOUD
                </span>
              </div>
              <p className="text-[11px] text-[#9CA3AF]">Facturation & Gestion PME Maroc</p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm text-[#9CA3AF]">
            <a href="#simulateur" className="hover:text-indigo-400 transition-colors">Démo Interactive</a>
            <a href="#features" className="hover:text-indigo-400 transition-colors">Fonctionnalités</a>
            <a href="#conformite" className="hover:text-indigo-400 transition-colors">Normes DGI</a>
            <a href="#tarifs" className="hover:text-indigo-400 transition-colors">Tarifs</a>
            <a href="#temoignages" className="hover:text-indigo-400 transition-colors">Avis PME</a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="#simulateur"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 text-xs font-semibold hover:bg-slate-800 transition-all"
            >
              <span>Se Connecter</span>
            </a>
            <a
              href="#tarifs"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-xs font-bold shadow-md shadow-indigo-500/25 hover:brightness-110 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Démarrer l’Essai</span>
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111827] border border-indigo-500/30 text-xs font-mono text-indigo-400 mb-6">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span>Plateforme Tout-en-Un de Gestion Commerciale</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F9FAFB] leading-tight sm:leading-tight">
              Pilotez Votre Entreprise, <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                De la Facturation au Bilan.
              </span>
            </h1>

            <p className="mt-6 text-base sm:text-lg text-[#9CA3AF] leading-relaxed">
              Créez des factures et devis conformes aux normes DGI marocaines en 30 secondes, suivez vos créances impayées, gérez vos stocks multi-dépôts et exportez vos journaux comptables en un clic.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#simulateur"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold text-sm shadow-xl shadow-indigo-500/25 hover:scale-[1.02] transition-transform"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Tester le Générateur de Facture</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <a
                href="#tarifs"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#111827] border border-slate-800 text-[#F9FAFB] font-semibold text-sm hover:bg-slate-800 transition-all"
              >
                <CreditCard className="w-4 h-4 text-indigo-400" />
                <span>Voir les Formules d’Abonnement</span>
              </a>
            </div>

            {/* Metrics */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-slate-800">
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">1 400+</div>
                <div className="text-xs text-[#9CA3AF] mt-1">PME & Startups au Maroc</div>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">450 M+</div>
                <div className="text-xs text-[#9CA3AF] mt-1">MAD de factures générées</div>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">99.9%</div>
                <div className="text-xs text-[#9CA3AF] mt-1">Disponibilité garantie SLA</div>
              </div>
              <div className="p-4 rounded-xl bg-[#111827] border border-slate-800">
                <div className="text-2xl sm:text-3xl font-extrabold text-indigo-400">DGI 2026</div>
                <div className="text-xs text-[#9CA3AF] mt-1">Mentions Légales Intégrées</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Interactive Invoice Generator & Dashboard Demo */}
      <section id="simulateur" className="py-20 bg-[#0E1322] border-y border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-950 text-xs font-mono text-indigo-400 mb-3 border border-indigo-800/40">
              <Receipt className="w-3.5 h-3.5" />
              <span>DÉMO LIVE INTERACTIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB]">
              Essayez le Générateur de Facture Conforme
            </h2>
            <p className="text-[#9CA3AF] text-xs sm:text-sm mt-2">
              Modifiez le client, ajustez les lignes de service ou les quantités ci-dessous pour voir le calcul automatique en temps réel.
            </p>
          </div>

          {/* Simulated Financial KPIs Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Chiffre d’Affaires HT</span>
                <span className="text-emerald-400 font-mono text-[11px]">+18.4%</span>
              </div>
              <div className="text-2xl font-bold text-white mt-2">284 500 MAD</div>
              <div className="text-[11px] text-slate-500 mt-1">Encaissements validés du mois</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Créances en Attente</span>
                <span className="text-amber-400 font-mono text-[11px]">4 Factures</span>
              </div>
              <div className="text-2xl font-bold text-amber-300 mt-2">86 400 MAD</div>
              <div className="text-[11px] text-slate-500 mt-1">Relances automatiques actives</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>TVA à Déclarer (20%)</span>
                <span className="text-indigo-400 font-mono text-[11px]">Trimestre en cours</span>
              </div>
              <div className="text-2xl font-bold text-indigo-300 mt-2">56 900 MAD</div>
              <div className="text-[11px] text-slate-500 mt-1">Télétransmission EDI DGI prête</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#111827] border border-slate-800">
              <div className="flex items-center justify-between text-xs text-[#9CA3AF]">
                <span>Devis en Négociation</span>
                <span className="text-sky-400 font-mono text-[11px]">Taux signature 68%</span>
              </div>
              <div className="text-2xl font-bold text-sky-300 mt-2">142 000 MAD</div>
              <div className="text-[11px] text-slate-500 mt-1">6 opportunités en pipeline</div>
            </div>
          </div>

          {/* Interactive Invoice Card */}
          <div className="rounded-2xl bg-[#111827] border border-indigo-500/30 p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-white">Facture Commerciale</span>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                    Conforme ICE & DGI
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Émise par : <strong>BusinessManager Demo SARL</strong> — ICE : 001984251000088 • IF : 45892147 • RC : Casablanca 341209
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadSuccess(true);
                    setTimeout(() => setDownloadSuccess(false), 3000);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>{downloadSuccess ? "Téléchargé avec succès !" : "Télécharger PDF"}</span>
                </button>
              </div>
            </div>

            {/* Invoice Meta Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 py-6 border-b border-slate-800 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Raison Sociale Client :</label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">ICE Client (Maroc) :</label>
                <input
                  type="text"
                  value={clientICE}
                  onChange={(e) => setClientICE(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Numéro de Facture :</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  onChange={(e) => setInvoiceNumber(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Date d’Émission :</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Line Items Table */}
            <div className="py-6 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 uppercase font-mono text-[10px]">
                    <th className="py-2.5 px-3">Description de la prestation / produit</th>
                    <th className="py-2.5 px-3 w-24">Quantité</th>
                    <th className="py-2.5 px-3 w-32">Prix Unitaire HT</th>
                    <th className="py-2.5 px-3 w-32 text-right">Total HT</th>
                    <th className="py-2.5 px-2 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoiceItems.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/30">
                      <td className="py-2 px-3">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, "description", e.target.value)}
                          className="w-full px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, "quantity", Math.max(1, parseInt(e.target.value) || 1))}
                          className="w-full px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono text-center"
                        />
                      </td>
                      <td className="py-2 px-3">
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, "unitPrice", Math.max(0, parseFloat(e.target.value) || 0))}
                          className="w-full px-2 py-1 rounded bg-[#0B0F19] border border-slate-800 text-white focus:outline-none focus:border-indigo-500 font-mono"
                        />
                      </td>
                      <td className="py-2 px-3 text-right font-mono font-semibold text-slate-200">
                        {(item.quantity * item.unitPrice).toLocaleString("fr-FR")} MAD
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-indigo-400 text-xs border border-slate-800 transition-all font-medium"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Ajouter une Ligne</span>
                </button>
              </div>
            </div>

            {/* Total Summary */}
            <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="text-xs text-slate-400 space-y-1">
                <p>• Paiement exigible à 30 jours fin de mois par virement bancaire.</p>
                <p>• RIB : 011 780 0000 123456789012 34 (BMCE Bank of Africa)</p>
                <p>• Pénalités de retard : Taux légal en vigueur selon la loi 49-15 sur les délais de paiement.</p>
              </div>

              <div className="w-full md:w-80 p-4 rounded-xl bg-[#0B0F19] border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Sous-Total HT :</span>
                  <span className="font-mono text-white">{subtotalHT.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>TVA Légale (20%) :</span>
                  <span className="font-mono text-indigo-400">{tvaAmount.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 font-bold text-sm text-white">
                  <span>Total Net TTC :</span>
                  <span className="font-mono text-emerald-400 text-base">
                    {totalTTC.toLocaleString("fr-FR")} MAD
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modules ERP Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F9FAFB]">
              Tous les Outils Nécessaires à Votre PME
            </h2>
            <p className="text-[#9CA3AF] text-xs sm:text-sm mt-3">
              Fini les feuilles Excel dispersées et les erreurs de saisie. BusinessManager unifie votre flux commercial.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-7 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-indigo-950 text-indigo-400 flex items-center justify-center mb-5">
                <Receipt className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F9FAFB] mb-2">Facturation & Devis Instantanés</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Transformation de devis en facture en un clic. Gestion des acomptes, des avoirs et des relances automatiques par email et WhatsApp.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-purple-950 text-purple-400 flex items-center justify-center mb-5">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F9FAFB] mb-2">Gestion des Stocks Multi-Dépôts</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Suivi précis des entrées/sorties en temps réel, calcul du Coût Moyen Unitaire Pondéré (CMUP) et alertes automatiques de stock critique.
              </p>
            </div>

            <div className="p-7 rounded-2xl bg-[#111827] border border-slate-800 hover:border-indigo-500/50 transition-all">
              <div className="w-12 h-12 rounded-xl bg-emerald-950 text-emerald-400 flex items-center justify-center mb-5">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-[#F9FAFB] mb-2">Rapprochement Bancaire & Trésorerie</h3>
              <p className="text-xs text-[#9CA3AF] leading-relaxed">
                Importation des relevés bancaires (Attijariwafa, BCP, BMCE, CIH). Association automatique des paiements reçus avec les factures émises.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="tarifs" className="py-20 bg-[#0E1322] border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-950 text-xs font-mono text-indigo-400 mb-3 border border-indigo-800/40">
              <DollarSign className="w-3.5 h-3.5" />
              <span>TARIFICATION TRANSPARENTE</span>
            </div>
            <h2 className="text-3xl font-extrabold text-[#F9FAFB]">
              Des Formules Adaptées à Votre Taille
            </h2>
            <p className="text-[#9CA3AF] text-xs sm:text-sm mt-2">
              Sans engagement. Changement de formule à tout moment. 14 jours d’essai offerts.
            </p>

            {/* Cycle Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl bg-[#111827] border border-slate-800 mt-6 text-xs">
              <button
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  billingCycle === "monthly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-1.5 rounded-lg font-medium transition-all ${
                  billingCycle === "yearly" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
                }`}
              >
                Annuel (-20% Offert)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {/* Starter */}
            <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">STARTER</span>
                <h3 className="text-xl font-bold text-white mt-1">Freelance & Auto-Entrepreneur</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {billingCycle === "yearly" ? "150" : "190"} MAD
                  </span>
                  <span className="text-xs text-slate-400">/ mois</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Jusqu’à 50 factures & devis / mois</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>1 Utilisateur unique</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Mentions DGI (ICE, IF, RC) conformes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Génération PDF & envoi par email</span>
                  </li>
                </ul>
              </div>

              <button className="w-full mt-8 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
                Démarrer Gratuitement
              </button>
            </div>

            {/* Pro */}
            <div className="p-8 rounded-2xl bg-[#141B2D] border-2 border-indigo-500 relative flex flex-col justify-between shadow-2xl shadow-indigo-500/20">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] font-mono px-3 py-0.5 rounded-full bg-indigo-600 text-white font-bold uppercase tracking-wider">
                Le Plus Populaire
              </span>
              <div>
                <span className="text-xs font-mono text-indigo-400">PME CROISSANCE</span>
                <h3 className="text-xl font-bold text-white mt-1">Sociétés & SARL</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {billingCycle === "yearly" ? "360" : "450"} MAD
                  </span>
                  <span className="text-xs text-slate-400">/ mois</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Facturation & Devis illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>5 Utilisateurs avec gestion de rôles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gestion des stocks & alertes</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Rapprochement bancaire manuel & EDI</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export comptable en 1 clic</span>
                  </li>
                </ul>
              </div>

              <button className="w-full mt-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:brightness-110 text-white text-xs font-bold shadow-lg shadow-indigo-500/25">
                Essai Gratuit 14 Jours
              </button>
            </div>

            {/* Scale */}
            <div className="p-8 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between">
              <div>
                <span className="text-xs font-mono text-slate-400">ENTREPRISE SCALE</span>
                <h3 className="text-xl font-bold text-white mt-1">Multi-Sociétés & Holdings</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-3xl font-bold text-white">
                    {billingCycle === "yearly" ? "710" : "890"} MAD
                  </span>
                  <span className="text-xs text-slate-400">/ mois</span>
                </div>
                <ul className="mt-6 space-y-2.5 text-xs text-slate-300">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Utilisateurs & Filiales illimités</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Synchronisation bancaire temps réel</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Accès API REST complet & Webhooks</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Gestionnaire de compte dédié Casablanca</span>
                  </li>
                </ul>
              </div>

              <button className="w-full mt-8 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold">
                Contacter l’Équipe
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#070A11] border-t border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-lg font-bold text-[#F9FAFB]">BusinessManager Cloud</span>
                <p className="text-[11px] text-[#9CA3AF]">ERP & Facturation pour PME au Maroc</p>
              </div>
            </div>

            <div className="text-xs text-[#9CA3AF] text-center md:text-right">
              <p>Développé par Tariq Abala d&apos;une manière professionnelle</p>
              <p className="mt-1 text-slate-500 font-mono text-[10px]">
                Stack : Next.js 16 • React 19 • Tailwind CSS • TypeScript
              </p>
            </div>
          </div>

          <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© 2026 BusinessManager. Tous droits réservés.</p>
            <div className="flex gap-6">
              <a href="#simulateur" className="hover:text-slate-400">Générateur</a>
              <a href="#features" className="hover:text-slate-400">Modules</a>
              <a href="#tarifs" className="hover:text-slate-400">Tarifs</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
