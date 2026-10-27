"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  Download,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertCircle,
  Trash2,
  Edit,
  Receipt,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import InvoiceModal from "@/components/InvoiceModal";
import PaymentModal from "@/components/PaymentModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Invoice, InvoiceStatus } from "@/types/business";

export default function FacturesPage() {
  const { invoices, customers, deleteInvoice } = useBusiness();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [preselectedPayInvoiceId, setPreselectedPayInvoiceId] = useState<string | undefined>(undefined);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState("all");

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (activeTab === "paid" && inv.status !== "paid") return false;
      if (activeTab === "pending" && inv.status !== "pending") return false;
      if (activeTab === "overdue" && inv.status !== "overdue") return false;

      if (selectedCustomerFilter !== "all" && inv.customerId !== selectedCustomerFilter) {
        return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNum = inv.invoiceNumber.toLowerCase().includes(q);
        const matchesClient = inv.customerName.toLowerCase().includes(q);
        const matchesEmail = inv.customerEmail.toLowerCase().includes(q);
        const matchesIce = inv.customerICE.toLowerCase().includes(q);
        if (!matchesNum && !matchesClient && !matchesEmail && !matchesIce) return false;
      }

      return true;
    });
  }, [invoices, activeTab, selectedCustomerFilter, searchQuery]);

  const handleExportCSV = () => {
    if (filteredInvoices.length === 0) {
      alert("Aucune facture à exporter.");
      return;
    }

    const headers = [
      "Numéro Facture",
      "Client",
      "ICE Client",
      "Date Émission",
      "Date Échéance",
      "Total HT (MAD)",
      "TVA (MAD)",
      "Total TTC (MAD)",
      "Reste Dû (MAD)",
      "Statut",
    ];

    const rows = filteredInvoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.customerName.replace(/"/g, '""')}"`,
      inv.customerICE,
      inv.issueDate,
      inv.dueDate,
      inv.subtotalHT.toFixed(2),
      inv.totalTVA.toFixed(2),
      inv.totalTTC.toFixed(2),
      inv.remainingAmount.toFixed(2),
      inv.status,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `factures_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getStatusBadge = (status: InvoiceStatus) => {
    switch (status) {
      case "paid":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Payée</span>
          </span>
        );
      case "pending":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-600" />
            <span>En attente</span>
          </span>
        );
      case "overdue":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-red-50 text-red-700 border border-red-200">
            <AlertCircle className="w-3 h-3 text-red-600" />
            <span>En retard</span>
          </span>
        );
      case "draft":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <span>Brouillon</span>
          </span>
        );
      case "canceled":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-500 line-through">
            <span>Annulée</span>
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
            onOpenNewInvoice={() => {
              setEditingInvoice(null);
              setInvoiceModalOpen(true);
            }}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Gestion des Factures
                </h1>
                <p className="text-xs text-slate-500">
                  Édition, validation, suivi des créances et impression des factures de vente
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={handleExportCSV}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-white hover:bg-slate-50 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Exporter CSV</span>
                </button>

                <button
                  onClick={() => {
                    setEditingInvoice(null);
                    setInvoiceModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Créer une Facture</span>
                </button>
              </div>
            </div>

            {/* Invoices Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Filter Row */}
              <div className="p-5 sm:p-6 pb-2 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "all" ? "bg-white text-blue-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Toutes ({invoices.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("paid")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "paid" ? "bg-white text-emerald-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      Payées ({invoices.filter((i) => i.status === "paid").length})
                    </button>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "pending" ? "bg-white text-amber-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      En attente ({invoices.filter((i) => i.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setActiveTab("overdue")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "overdue" ? "bg-white text-red-700 shadow-xs" : "text-slate-600"
                      }`}
                    >
                      En retard ({invoices.filter((i) => i.status === "overdue").length})
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher facture ou client..."
                        className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                      />
                    </div>

                    {customers.length > 0 && (
                      <select
                        value={selectedCustomerFilter}
                        onChange={(e) => setSelectedCustomerFilter(e.target.value)}
                        className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-medium"
                      >
                        <option value="all">Tous les clients</option>
                        {customers.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 font-semibold">N° Facture</th>
                      <th className="py-3.5 px-4 font-semibold">Client &amp; Contact</th>
                      <th className="py-3.5 px-4 font-semibold">Date Émission</th>
                      <th className="py-3.5 px-4 font-semibold">Échéance</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Lignes</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Montant TTC</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Statut</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredInvoices.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucune facture trouvée</p>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => (
                        <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-900">
                            <Link
                              href={`/factures/${inv.id}`}
                              className="text-blue-600 hover:text-blue-800 hover:underline"
                            >
                              {inv.invoiceNumber}
                            </Link>
                          </td>

                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-bold text-xs shrink-0">
                                {inv.customerName.slice(0, 2).toUpperCase()}
                              </div>
                              <div className="overflow-hidden">
                                <span className="font-bold text-slate-900 block truncate">
                                  {inv.customerName}
                                </span>
                                <span className="text-[11px] text-slate-500 block truncate">
                                  ICE: {inv.customerICE || "Non renseigné"}
                                </span>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">{inv.issueDate}</td>
                          <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                            <span className={inv.status === "overdue" ? "font-bold text-red-600" : ""}>
                              {inv.dueDate}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-right font-mono text-slate-600">
                            {inv.items.reduce((acc, i) => acc + i.quantity, 0)}
                          </td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                            {inv.totalTTC.toLocaleString("fr-FR")} MAD
                          </td>
                          <td className="py-4 px-4 text-center whitespace-nowrap">
                            {getStatusBadge(inv.status)}
                          </td>
                          <td className="py-4 px-4 text-right whitespace-nowrap">
                            <div className="inline-flex items-center gap-1">
                              <Link
                                href={`/factures/${inv.id}`}
                                title="Voir & Imprimer"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50"
                              >
                                <Eye className="w-4 h-4" />
                              </Link>
                              {inv.status !== "paid" && (
                                <button
                                  onClick={() => {
                                    setPreselectedPayInvoiceId(inv.id);
                                    setPaymentModalOpen(true);
                                  }}
                                  title="Enregistrer un paiement"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 cursor-pointer"
                                >
                                  <CreditCard className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  setEditingInvoice(inv);
                                  setInvoiceModalOpen(true);
                                }}
                                title="Modifier"
                                className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setInvoiceToDelete(inv);
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

      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => {
          setInvoiceModalOpen(false);
          setEditingInvoice(null);
        }}
        initialInvoice={editingInvoice}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setPreselectedPayInvoiceId(undefined);
        }}
        preselectedInvoiceId={preselectedPayInvoiceId}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Supprimer la Facture"
        message={`Confirmez-vous la suppression de la facture ${invoiceToDelete?.invoiceNumber} ?`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (invoiceToDelete) {
            deleteInvoice(invoiceToDelete.id);
            setDeleteConfirmOpen(false);
            setInvoiceToDelete(null);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setInvoiceToDelete(null);
        }}
      />
    </div>
  );
}
