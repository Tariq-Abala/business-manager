"use client";

import React, { useState } from "react";
import {
  Settings,
  Building2,
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  CreditCard,
  FileText,
  Info,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { CompanySettings } from "@/types/business";

export default function ParametresPage() {
  const { companySettings, updateSettings, resetToDemoData } = useBusiness();
  const [mobileOpen, setMobileOpen] = useState(false);

  const [formData, setFormData] = useState<CompanySettings>(companySettings);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleChange = (field: keyof CompanySettings, val: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: val }));
    setSaveSuccess(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleConfirmReset = () => {
    resetToDemoData();
    setResetConfirmOpen(false);
    setFormData(companySettings);
    alert("Toutes les données de démonstration ont été réinitialisées avec succès !");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar onOpenMobileMenu={() => setMobileOpen(true)} />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-4xl mx-auto w-full">
            {/* Header */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                Paramètres de l&apos;Entreprise &amp; Configuration
              </h1>
              <p className="text-xs text-slate-500">
                Coordonnées de facturation, identifiants administratifs et gestion des données locales
              </p>
            </div>

            {/* Notification notice */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1.5">
                <Info className="w-4 h-4 text-amber-700" />
                <span>Notice Importante — Données Fictives de Démonstration</span>
              </div>
              <p className="text-amber-800 leading-relaxed">
                Ce projet est une réalisation de portfolio. Il n&apos;est pas connecté à un serveur de télé-déclaration DGI et ne constitue pas un système comptable certifié. Les mentions ci-dessous sont enregistrées dans votre navigateur local (localStorage).
              </p>
            </div>

            {saveSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Paramètres enregistrés avec succès dans votre stockage local !</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-6">
              {/* Identity & Legal Moroccan identifiers */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-900">
                      Identité de l&apos;Entreprise Émettrice
                    </h2>
                    <p className="text-xs text-slate-500">Mentions obligatoires sur les factures et devis</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Raison Sociale / Nom Commercial *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.companyName}
                      onChange={(e) => handleChange("companyName", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      ICE (Identifiant Commun de l&apos;Entreprise)
                    </label>
                    <input
                      type="text"
                      value={formData.ice}
                      onChange={(e) => handleChange("ice", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Identifiant Fiscal (IF)
                    </label>
                    <input
                      type="text"
                      value={formData.ifNum}
                      onChange={(e) => handleChange("ifNum", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Registre du Commerce (RC)
                    </label>
                    <input
                      type="text"
                      value={formData.rc}
                      onChange={(e) => handleChange("rc", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Numéro d&apos;Affiliation CNSS
                    </label>
                    <input
                      type="text"
                      value={formData.cnss}
                      onChange={(e) => handleChange("cnss", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Address & Contact */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900">Coordonnées de Contact &amp; Siège</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs font-bold text-slate-700 block mb-1">Adresse Siège Social</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Ville</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Code Postal</label>
                    <input
                      type="text"
                      value={formData.postalCode}
                      onChange={(e) => handleChange("postalCode", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Téléphone Commercial</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Email Facturation</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>
                </div>
              </div>

              {/* Banking & Defaults */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                <h3 className="text-sm font-bold text-slate-900">Coordonnées Bancaires &amp; TVA par Défaut</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Nom de la Banque</label>
                    <input
                      type="text"
                      value={formData.bankName}
                      onChange={(e) => handleChange("bankName", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">RIB (24 chiffres)</label>
                    <input
                      type="text"
                      value={formData.rib}
                      onChange={(e) => handleChange("rib", e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Taux TVA par Défaut (%)</label>
                    <select
                      value={formData.defaultTva}
                      onChange={(e) => handleChange("defaultTva", Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                    >
                      <option value={20}>20% (Taux normal standard)</option>
                      <option value={14}>14% (Prestations particulières)</option>
                      <option value={10}>10% (Hôtellerie/Restauration)</option>
                      <option value={7}>7% (Biens de première nécessité)</option>
                      <option value={0}>0% (Exonération)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">Devise de Tenue</label>
                    <input
                      type="text"
                      disabled
                      value="MAD (Dirham Marocain)"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    Mention Légale imprimée au bas des factures
                  </label>
                  <textarea
                    rows={2}
                    value={formData.legalNotice}
                    onChange={(e) => handleChange("legalNotice", e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setResetConfirmOpen(true)}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Réinitialiser les Données de Démonstration</span>
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Enregistrer les Modifications</span>
                </button>
              </div>
            </form>
          </main>

          <Footer />
        </div>
      </div>

      <ConfirmModal
        isOpen={resetConfirmOpen}
        title="Réinitialiser Toutes les Données Démo ?"
        message="Cette action effacera les factures, devis, clients et articles que vous avez ajoutés ou modifiés et restaurera l'état de démonstration initial. Voulez-vous continuer ?"
        confirmLabel="Oui, Réinitialiser"
        onConfirm={handleConfirmReset}
        onCancel={() => setResetConfirmOpen(false)}
      />
    </div>
  );
}
