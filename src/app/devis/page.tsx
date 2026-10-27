"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FileText,
  Plus,
  Search,
  CheckCircle2,
  Clock,
  ArrowRight,
  Trash2,
  Edit,
  Receipt,
  Download,
  AlertCircle,
  Building2,
  Send,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import QuoteModal from "@/components/QuoteModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Quote, QuoteStatus } from "@/types/business";

export default function DevisPage() {
  const { quotes, customers, deleteQuote, convertQuoteToInvoice } = useBusiness();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quoteToDelete, setQuoteToDelete] = useState<Quote | null>(null);

  const [conversionSuccessMsg, setConversionSuccessMsg] = useState<{
    invoiceId: string;
    invoiceNum: string;
  } | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filteredQuotes = useMemo(() => {
    return quotes.filter((q) => {
      if (statusFilter !== "all" && q.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesNum = q.quoteNumber.toLowerCase().includes(query);
        const matchesClient = q.customerName.toLowerCase().includes(query);
        const matchesIce = q.customerICE.toLowerCase().includes(query);
        if (!matchesNum && !matchesClient && !matchesIce) return false;
      }
      return true;
    });
  }, [quotes, statusFilter, searchQuery]);

  const handleConvert = (quote: Quote) => {
    if (
      window.confirm(
        `Convertir le devis ${quote.quoteNumber} en facture définitive ? Une nouvelle facture sera automatiquement créée et le stock ajusté.`
      )
    ) {
      const newInv = convertQuoteToInvoice(quote.id);
      if (newInv) {
        setConversionSuccessMsg({
          invoiceId: newInv.id,
          invoiceNum: newInv.invoiceNumber,
        });
      }
    }
  };

  const getStatusBadge = (status: QuoteStatus) => {
    switch (status) {
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
            <CheckCircle2 className="w-3 h-3 text-teal-600" />
            <span>Accepté</span>
          </span>
        );
      case "sent":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            <Send className="w-3 h-3 text-blue-600" />
            <span>Envoyé</span>
          </span>
        );
      case "converted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <Receipt className="w-3 h-3 text-indigo-600" />
            <span>Converti en Facture</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Brouillon</span>
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <span>Refusé</span>
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
            onOpenNewQuote={() => {
              setEditingQuote(null);
              setQuoteModalOpen(true);
            }}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Devis &amp; Propositions Commerciales
                </h1>
                <p className="text-xs text-slate-500">
                  Création de devis chiffrés, suivi de validation et conversion directe en facture
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingQuote(null);
                  setQuoteModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Devis</span>
              </button>
            </div>

            {/* Conversion Success Notification */}
            {conversionSuccessMsg && (
              <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-900 flex items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
                  <div>
                    <span className="font-bold">Conversion réussie !</span> La facture{" "}
                    <strong>{conversionSuccessMsg.invoiceNum}</strong> a été créée avec succès à partir du devis.
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link
                    href={`/factures/${conversionSuccessMsg.invoiceId}`}
                    className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold transition-colors inline-flex items-center gap-1"
                  >
                    Voir la facture <ArrowRight className="w-3 h-3" />
                  </Link>
                  <button
                    onClick={() => setConversionSuccessMsg(null)}
                    className="text-slate-400 hover:text-slate-600 font-bold px-2 py-1"
                  >
                    ×
                  </button>
                </div>
              </div>
            )}

            {/* Main Table Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Search & Status Filters */}
              <div className="p-5 sm:p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {["all", "accepted", "sent", "converted", "draft"].map((status) => (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all ${
                        statusFilter === status
                          ? "bg-teal-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {status === "all"
                        ? "Tous les devis"
                        : status === "accepted"
                        ? "Acceptés"
                        : status === "sent"
                        ? "Envoyés"
                        : status === "converted"
                        ? "Convertis"
                        : "Brouillons"}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par devis ou client..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 font-semibold">N° Devis</th>
                      <th className="py-3.5 px-4 font-semibold">Client</th>
                      <th className="py-3.5 px-4 font-semibold">Date Émission</th>
                      <th className="py-3.5 px-4 font-semibold">Validité</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Montant HT</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Montant TTC</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Statut</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredQuotes.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucun devis trouvé</p>
                        </td>
                      </tr>
                    ) : (
                      filteredQuotes.map((quote) => (
                        <tr key={quote.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            {quote.quoteNumber}
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {quote.customerName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-bold text-slate-900 block truncate">
                                  {quote.customerName}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  ICE: {quote.customerICE || "Non renseigné"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{quote.issueDate}</td>
                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{quote.validUntil}</td>
                          <td className="py-4 px-4 text-right font-mono text-slate-700 whitespace-nowrap">
                            {quote.subtotalHT.toLocaleString("fr-FR")} MAD
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {quote.totalTTC.toLocaleString("fr-FR")} MAD
                          </td>
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {getStatusBadge(quote.status)}
                          </td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1.5">
                              {quote.status !== "converted" ? (
                                <button
                                  onClick={() => handleConvert(quote)}
                                  className="px-2.5 py-1 rounded-lg bg-teal-50 hover:bg-teal-100 text-teal-700 font-bold text-[11px] inline-flex items-center gap-1 transition-colors cursor-pointer"
                                  title="Transformer ce devis en facture"
                                >
                                  <Receipt className="w-3.5 h-3.5" />
                                  <span>Convertir en Facture</span>
                                </button>
                              ) : (
                                quote.convertedInvoiceId && (
                                  <Link
                                    href={`/factures/${quote.convertedInvoiceId}`}
                                    className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-[11px] inline-flex items-center gap-1"
                                  >
                                    <span>Voir Facture</span>
                                  </Link>
                                )
                              )}

                              <button
                                onClick={() => {
                                  setEditingQuote(quote);
                                  setQuoteModalOpen(true);
                                }}
                                title="Modifier"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>

                              <button
                                onClick={() => {
                                  setQuoteToDelete(quote);
                                  setDeleteConfirmOpen(true);
                                }}
                                title="Supprimer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
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

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => {
          setQuoteModalOpen(false);
          setEditingQuote(null);
        }}
        initialQuote={editingQuote}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Supprimer le Devis"
        message={`Confirmez-vous la suppression du devis ${quoteToDelete?.quoteNumber} ?`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (quoteToDelete) {
            deleteQuote(quoteToDelete.id);
            setDeleteConfirmOpen(false);
            setQuoteToDelete(null);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setQuoteToDelete(null);
        }}
      />
    </div>
  );
}
