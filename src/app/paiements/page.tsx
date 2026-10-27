"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  CreditCard,
  Plus,
  Search,
  CheckCircle2,
  Receipt,
  Trash2,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import PaymentModal from "@/components/PaymentModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Payment } from "@/types/business";

export default function PaiementsPage() {
  const { payments, metrics, deletePayment } = useBusiness();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState<Payment | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState("all");

  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      if (methodFilter !== "all" && p.paymentMethod !== methodFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesRef = p.reference.toLowerCase().includes(q);
        const matchesClient = p.customerName.toLowerCase().includes(q);
        const matchesInv = p.invoiceNumber.toLowerCase().includes(q);
        if (!matchesRef && !matchesClient && !matchesInv) return false;
      }
      return true;
    });
  }, [payments, methodFilter, searchQuery]);

  const getMethodBadge = (method: Payment["paymentMethod"]) => {
    switch (method) {
      case "virement":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            Virement Bancaire
          </span>
        );
      case "cheque":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            Chèque de Banque
          </span>
        );
      case "carte":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Carte / TPV
          </span>
        );
      case "especes":
        return (
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Espèces (Reçu)
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onOpenMobileMenu={() => setMobileOpen(true)}
            onOpenNewPayment={() => setPaymentModalOpen(true)}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Suivi des Encaissements &amp; Règlements
                </h1>
                <p className="text-xs text-slate-500">
                  Journal des encaissements bancaires, chèques et rapprochement des factures
                </p>
              </div>

              <button
                onClick={() => setPaymentModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Enregistrer un Règlement</span>
              </button>
            </div>

            {/* Financial KPI Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Total des Encaissements Réglés</span>
                <div className="text-2xl font-bold text-emerald-600">
                  {metrics.paidReceivables.toLocaleString("fr-FR")} MAD
                </div>
                <p className="text-[11px] text-slate-400">Somme des factures payées</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Créances Restantes à Encaisser</span>
                <div className="text-2xl font-bold text-amber-600">
                  {metrics.totalReceivables.toLocaleString("fr-FR")} MAD
                </div>
                <p className="text-[11px] text-slate-400">Factures en attente + factures en retard</p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-1">
                <span className="text-xs text-slate-500 font-medium">Règlements Comptabilisés</span>
                <div className="text-2xl font-bold text-slate-900">
                  {payments.length} opérations
                </div>
                <p className="text-[11px] text-slate-400">Journal de caisse et banque</p>
              </div>
            </div>

            {/* Payments Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Filter Row */}
              <div className="p-5 sm:p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {["all", "virement", "cheque", "carte", "especes"].map((m) => (
                    <button
                      key={m}
                      onClick={() => setMethodFilter(m)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                        methodFilter === m
                          ? "bg-emerald-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {m === "all"
                        ? "Tous modes"
                        : m === "virement"
                        ? "Virements"
                        : m === "cheque"
                        ? "Chèques"
                        : m === "carte"
                        ? "Cartes"
                        : "Espèces"}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par référence, client..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 font-semibold">Référence</th>
                      <th className="py-3.5 px-4 font-semibold">Date Règlement</th>
                      <th className="py-3.5 px-4 font-semibold">Facture Associée</th>
                      <th className="py-3.5 px-4 font-semibold">Client</th>
                      <th className="py-3.5 px-4 font-semibold">Mode</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Montant Encaissé</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <CreditCard className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucun règlement enregistré</p>
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((pay) => (
                        <tr key={pay.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            {pay.reference}
                          </td>

                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                            {pay.paymentDate}
                          </td>

                          <td className="py-4 px-4 font-mono font-semibold">
                            <Link
                              href={`/factures/${pay.invoiceId}`}
                              className="text-blue-600 hover:underline"
                            >
                              {pay.invoiceNumber}
                            </Link>
                          </td>

                          <td className="py-4 px-4 font-medium text-slate-900">
                            {pay.customerName}
                          </td>

                          <td className="py-4 px-4 whitespace-nowrap">
                            {getMethodBadge(pay.paymentMethod)}
                          </td>

                          <td className="py-4 px-4 text-right font-mono font-bold text-emerald-700 whitespace-nowrap">
                            +{pay.amount.toLocaleString("fr-FR")} MAD
                          </td>

                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => {
                                setPaymentToDelete(pay);
                                setDeleteConfirmOpen(true);
                              }}
                              title="Annuler ce règlement"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Annuler le Règlement"
        message={`Confirmez-vous l'annulation du règlement ${paymentToDelete?.reference} d'un montant de ${paymentToDelete?.amount} MAD ? Le solde de la facture sera réajusté.`}
        confirmLabel="Annuler le Paiement"
        onConfirm={() => {
          if (paymentToDelete) {
            deletePayment(paymentToDelete.id);
            setDeleteConfirmOpen(false);
            setPaymentToDelete(null);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setPaymentToDelete(null);
        }}
      />
    </div>
  );
}
