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
  MoreVertical,
  Receipt,
  FileText,
  Users,
  Package,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  Printer,
  Sparkles,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MetricCards from "@/components/MetricCards";
import Footer from "@/components/Footer";
import InvoiceModal from "@/components/InvoiceModal";
import QuoteModal from "@/components/QuoteModal";
import CustomerModal from "@/components/CustomerModal";
import ProductModal from "@/components/ProductModal";
import PaymentModal from "@/components/PaymentModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Invoice, InvoiceStatus } from "@/types/business";

export default function DashboardPage() {
  const { invoices, customers, deleteInvoice, markInvoicePaid, isHydrated } = useBusiness();

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Modals state
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [preselectedPayInvoiceId, setPreselectedPayInvoiceId] = useState<string | undefined>(undefined);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState<Invoice | null>(null);

  // Filter & Search states matching user image
  const [activeTab, setActiveTab] = useState<"all" | "paid" | "pending" | "overdue">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomerFilter, setSelectedCustomerFilter] = useState("all");

  // Selection state
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);

  // Filtered invoices
  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      // Tab filter
      if (activeTab === "paid" && inv.status !== "paid") return false;
      if (activeTab === "pending" && inv.status !== "pending") return false;
      if (activeTab === "overdue" && inv.status !== "overdue") return false;

      // Customer filter
      if (selectedCustomerFilter !== "all" && inv.customerId !== selectedCustomerFilter) {
        return false;
      }

      // Search query
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

  // Handle Select All Checkbox
  const handleToggleSelectAll = () => {
    if (selectedInvoiceIds.length === filteredInvoices.length) {
      setSelectedInvoiceIds([]);
    } else {
      setSelectedInvoiceIds(filteredInvoices.map((i) => i.id));
    }
  };

  const handleToggleSelectOne = (id: string) => {
    if (selectedInvoiceIds.includes(id)) {
      setSelectedInvoiceIds(selectedInvoiceIds.filter((item) => item !== id));
    } else {
      setSelectedInvoiceIds([...selectedInvoiceIds, id]);
    }
  };

  // CSV Export
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
    link.setAttribute("download", `factures_export_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteClick = (inv: Invoice) => {
    setInvoiceToDelete(inv);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (invoiceToDelete) {
      deleteInvoice(invoiceToDelete.id);
      setDeleteConfirmOpen(false);
      setInvoiceToDelete(null);
    }
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
        {/* Sidebar */}
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <TopBar
            onOpenMobileMenu={() => setMobileOpen(true)}
            onOpenNewInvoice={() => {
              setEditingInvoice(null);
              setInvoiceModalOpen(true);
            }}
            onOpenNewQuote={() => setQuoteModalOpen(true)}
            onOpenNewCustomer={() => setCustomerModalOpen(true)}
            onOpenNewProduct={() => setProductModalOpen(true)}
            onOpenNewPayment={() => {
              setPreselectedPayInvoiceId(undefined);
              setPaymentModalOpen(true);
            }}
          />

          {/* Page Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
            {/* 1. Metric Cards matching user reference image */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                    Vue d&apos;Ensemble Financière
                  </h2>
                  <p className="text-xs text-slate-500">
                    Indicateurs clés d&apos;encaissement et de facturation en Dirhams marocains (MAD)
                  </p>
                </div>
                <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
                  <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                  <span>Exercice Fiscal 2026</span>
                </div>
              </div>

              <MetricCards />
            </section>

            {/* 2. Invoices List Section matching user screenshot */}
            <section className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Top Controls Header */}
              <div className="p-5 sm:p-6 pb-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                      <Receipt className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">
                        Liste des Factures (Invoice List)
                      </h3>
                      <p className="text-xs text-slate-500">
                        Suivi des ventes, échéances et encaissements
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={handleExportCSV}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Exporter CSV</span>
                    </button>

                    <button
                      onClick={() => {
                        setEditingInvoice(null);
                        setInvoiceModalOpen(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Ajouter une Facture</span>
                    </button>
                  </div>
                </div>

                {/* Filter Tabs matching reference image: All / Paid / Unpaid / Overdue */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
                  <div className="inline-flex items-center p-1 rounded-2xl bg-slate-100/80 border border-slate-200/60 text-xs">
                    <button
                      onClick={() => setActiveTab("all")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "all"
                          ? "bg-white text-blue-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Toutes ({invoices.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("paid")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "paid"
                          ? "bg-white text-emerald-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      Payées ({invoices.filter((i) => i.status === "paid").length})
                    </button>
                    <button
                      onClick={() => setActiveTab("pending")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "pending"
                          ? "bg-white text-amber-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      En attente ({invoices.filter((i) => i.status === "pending").length})
                    </button>
                    <button
                      onClick={() => setActiveTab("overdue")}
                      className={`px-4 py-1.5 rounded-xl font-semibold transition-all ${
                        activeTab === "overdue"
                          ? "bg-white text-red-700 shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      En retard ({invoices.filter((i) => i.status === "overdue").length})
                    </button>
                  </div>

                  {/* Search and customer select */}
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="relative flex-1 sm:w-64">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Rechercher facture, client..."
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

              {/* Data Table matching reference layout */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 w-10 text-center">
                        <input
                          type="checkbox"
                          checked={
                            filteredInvoices.length > 0 &&
                            selectedInvoiceIds.length === filteredInvoices.length
                          }
                          onChange={handleToggleSelectAll}
                          className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                        />
                      </th>
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
                        <td colSpan={9} className="py-12 text-center text-slate-500">
                          <Receipt className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucune facture trouvée</p>
                          <p className="text-[11px] text-slate-400 mt-0.5">
                            Modifiez vos critères de recherche ou créez une nouvelle facture.
                          </p>
                          <button
                            onClick={() => {
                              setActiveTab("all");
                              setSearchQuery("");
                              setSelectedCustomerFilter("all");
                            }}
                            className="mt-3 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
                          >
                            Réinitialiser les filtres
                          </button>
                        </td>
                      </tr>
                    ) : (
                      filteredInvoices.map((inv) => {
                        const isSelected = selectedInvoiceIds.includes(inv.id);
                        return (
                          <tr
                            key={inv.id}
                            className={`hover:bg-slate-50/80 transition-colors ${
                              isSelected ? "bg-blue-50/40" : ""
                            }`}
                          >
                            {/* Checkbox */}
                            <td className="py-4 px-4 text-center">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectOne(inv.id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                              />
                            </td>

                            {/* Invoice ID */}
                            <td className="py-4 px-4 font-mono font-bold text-slate-900">
                              <Link
                                href={`/factures/${inv.id}`}
                                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-1"
                              >
                                {inv.invoiceNumber}
                              </Link>
                              {inv.convertedFromQuoteId && (
                                <span className="block text-[10px] text-teal-600 font-sans font-medium">
                                  Convertie du devis
                                </span>
                              )}
                            </td>

                            {/* Client Info with Avatar */}
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

                            {/* Create Date */}
                            <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                              {inv.issueDate}
                            </td>

                            {/* Due Date */}
                            <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                              <span
                                className={
                                  inv.status === "overdue"
                                    ? "font-bold text-red-600"
                                    : "text-slate-600"
                                }
                              >
                                {inv.dueDate}
                              </span>
                            </td>

                            {/* Quantity / Items */}
                            <td className="py-4 px-4 text-right font-mono text-slate-600">
                              {inv.items.reduce((acc, i) => acc + i.quantity, 0)}
                            </td>

                            {/* Montant TTC */}
                            <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                              {inv.totalTTC.toLocaleString("fr-FR")} MAD
                              {inv.status !== "paid" && inv.remainingAmount < inv.totalTTC && (
                                <span className="block text-[10px] font-normal text-amber-600">
                                  Reste : {inv.remainingAmount.toLocaleString("fr-FR")} MAD
                                </span>
                              )}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {getStatusBadge(inv.status)}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1">
                                <Link
                                  href={`/factures/${inv.id}`}
                                  title="Consulter et Imprimer"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
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
                                    className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
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
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => handleDeleteClick(inv)}
                                  title="Supprimer la facture"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Table Footer with pagination info */}
              <div className="p-4 sm:px-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                <div>
                  Affichage de <span className="font-semibold text-slate-800">{filteredInvoices.length}</span> sur{" "}
                  <span className="font-semibold text-slate-800">{invoices.length}</span> factures enregistrées
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    disabled
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="px-3 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                    1
                  </span>
                  <button
                    disabled
                    className="p-1.5 rounded-lg border border-slate-200 text-slate-300 cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </section>

            {/* 3. Quick module navigation shortcuts */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Link
                href="/devis"
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-teal-300 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Module Devis &amp; Chiffrages</h4>
                    <p className="text-xs text-slate-500">Conversion 1-clic en facture</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors" />
              </Link>

              <Link
                href="/clients"
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-indigo-300 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Répertoire Clients</h4>
                    <p className="text-xs text-slate-500">Comptes, ICE et soldes débiteurs</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </Link>

              <Link
                href="/produits"
                className="p-5 rounded-3xl bg-white border border-slate-200/80 shadow-2xs hover:border-amber-300 transition-colors flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Package className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Produits &amp; Stocks</h4>
                    <p className="text-xs text-slate-500">Catalogue de services et alertes stock</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
              </Link>
            </section>
          </main>

          {/* Footer */}
          <Footer />
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={invoiceModalOpen}
        onClose={() => {
          setInvoiceModalOpen(false);
          setEditingInvoice(null);
        }}
        initialInvoice={editingInvoice}
      />

      <QuoteModal
        isOpen={quoteModalOpen}
        onClose={() => setQuoteModalOpen(false)}
      />

      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => setCustomerModalOpen(false)}
      />

      <ProductModal
        isOpen={productModalOpen}
        onClose={() => setProductModalOpen(false)}
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
        message={`Êtes-vous sûr de vouloir supprimer définitivement la facture ${invoiceToDelete?.invoiceNumber} pour le client "${invoiceToDelete?.customerName}" ? Cette action est irréversible dans la démo.`}
        confirmLabel="Supprimer Définitivement"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setInvoiceToDelete(null);
        }}
      />
    </div>
  );
}
