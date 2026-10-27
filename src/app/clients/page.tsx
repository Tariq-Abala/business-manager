"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  Plus,
  Search,
  Building2,
  Phone,
  Mail,
  MapPin,
  Trash2,
  Edit,
  Receipt,
  CreditCard,
  AlertCircle,
  FileText,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import CustomerModal from "@/components/CustomerModal";
import InvoiceModal from "@/components/InvoiceModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Customer } from "@/types/business";

export default function ClientsPage() {
  const { customers, invoices, deleteCustomer } = useBusiness();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [customerModalOpen, setCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Calculate financials per customer
  const customerFinancials = useMemo(() => {
    const map: Record<string, { totalInvoiced: number; totalOutstanding: number; count: number }> = {};
    customers.forEach((c) => {
      map[c.id] = { totalInvoiced: 0, totalOutstanding: 0, count: 0 };
    });

    invoices.forEach((inv) => {
      if (!map[inv.customerId]) {
        map[inv.customerId] = { totalInvoiced: 0, totalOutstanding: 0, count: 0 };
      }
      map[inv.customerId].totalInvoiced += inv.totalTTC;
      map[inv.customerId].totalOutstanding += inv.remainingAmount;
      map[inv.customerId].count += 1;
    });

    return map;
  }, [customers, invoices]);

  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      if (categoryFilter !== "all" && c.category !== categoryFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesPerson = c.contactPerson.toLowerCase().includes(q);
        const matchesIce = c.ice.toLowerCase().includes(q);
        const matchesCity = c.city.toLowerCase().includes(q);
        if (!matchesName && !matchesPerson && !matchesIce && !matchesCity) return false;
      }
      return true;
    });
  }, [customers, categoryFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onOpenMobileMenu={() => setMobileOpen(true)}
            onOpenNewCustomer={() => {
              setEditingCustomer(null);
              setCustomerModalOpen(true);
            }}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Répertoire Clients &amp; Débiteurs
                </h1>
                <p className="text-xs text-slate-500">
                  Fiches comptes, suivi des créances et historique commercial
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingCustomer(null);
                  setCustomerModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Nouveau Client</span>
              </button>
            </div>

            {/* Customers Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Search & Category filter */}
              <div className="p-5 sm:p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {["all", "PME", "Grand Compte", "Indépendant"].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setCategoryFilter(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        categoryFilter === cat
                          ? "bg-indigo-600 text-white shadow-xs"
                          : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                      }`}
                    >
                      {cat === "all" ? "Toutes Catégories" : cat}
                    </button>
                  ))}
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par nom, ville, ICE..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 font-semibold">Raison Sociale</th>
                      <th className="py-3.5 px-4 font-semibold">Interlocuteur</th>
                      <th className="py-3.5 px-4 font-semibold">Contact (Email &amp; Tél)</th>
                      <th className="py-3.5 px-4 font-semibold">Ville</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Total Facturé</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Reste Dû</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredCustomers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-500">
                          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucun client trouvé</p>
                        </td>
                      </tr>
                    ) : (
                      filteredCustomers.map((cust) => {
                        const fin = customerFinancials[cust.id] || { totalInvoiced: 0, totalOutstanding: 0, count: 0 };
                        return (
                          <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                                  {cust.name.slice(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <span className="font-bold text-slate-900 block">{cust.name}</span>
                                  <span className="text-[11px] text-slate-500 font-mono">
                                    ICE: {cust.ice || "Non renseigné"}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-4 px-4 text-slate-700 font-medium">
                              {cust.contactPerson || "—"}
                              <span className="block text-[10px] text-indigo-600">{cust.category}</span>
                            </td>

                            <td className="py-4 px-4 text-slate-600">
                              <p className="text-slate-800">{cust.email}</p>
                              <p className="text-[11px] text-slate-500">{cust.phone}</p>
                            </td>

                            <td className="py-4 px-4 text-slate-600 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1">
                                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                                {cust.city}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right font-mono text-slate-700 whitespace-nowrap">
                              {fin.totalInvoiced.toLocaleString("fr-FR")} MAD
                              <span className="block text-[10px] text-slate-400">({fin.count} factures)</span>
                            </td>

                            <td className="py-4 px-4 text-right font-mono whitespace-nowrap">
                              {fin.totalOutstanding > 0 ? (
                                <span className="font-bold text-amber-600">
                                  {fin.totalOutstanding.toLocaleString("fr-FR")} MAD
                                </span>
                              ) : (
                                <span className="text-emerald-600 font-medium">À jour (0 MAD)</span>
                              )}
                            </td>

                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingCustomer(cust);
                                    setCustomerModalOpen(true);
                                  }}
                                  title="Modifier"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setCustomerToDelete(cust);
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
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </main>

          <Footer />
        </div>
      </div>

      <CustomerModal
        isOpen={customerModalOpen}
        onClose={() => {
          setCustomerModalOpen(false);
          setEditingCustomer(null);
        }}
        initialCustomer={editingCustomer}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Supprimer la Fiche Client"
        message={`Confirmez-vous la suppression du client "${customerToDelete?.name}" ?`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (customerToDelete) {
            deleteCustomer(customerToDelete.id);
            setDeleteConfirmOpen(false);
            setCustomerToDelete(null);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setCustomerToDelete(null);
        }}
      />
    </div>
  );
}
