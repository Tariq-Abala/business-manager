"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Plus,
  Trash2,
  Receipt,
  Building2,
  Calendar,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { Invoice, InvoiceItemLine, InvoiceStatus } from "@/types/business";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialInvoice?: Invoice | null;
}

export default function InvoiceModal({
  isOpen,
  onClose,
  initialInvoice,
}: InvoiceModalProps) {
  const { customers, products, companySettings, addInvoice, updateInvoice, invoices } =
    useBusiness();

  // Form State
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerICE, setCustomerICE] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [invoiceNumber, setInvoiceNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState<InvoiceStatus>("pending");
  const [notes, setNotes] = useState("");

  const [items, setItems] = useState<
    Array<{
      id: string;
      productId?: string;
      description: string;
      quantity: number;
      unitPriceHT: number;
      tvaRate: number;
    }>
  >([]);

  const [errorMsg, setErrorMsg] = useState("");

  // Initialize form when opening or editing
  useEffect(() => {
    if (initialInvoice) {
      setSelectedCustomerId(initialInvoice.customerId);
      setCustomerName(initialInvoice.customerName);
      setCustomerICE(initialInvoice.customerICE);
      setCustomerEmail(initialInvoice.customerEmail);
      setCustomerPhone(initialInvoice.customerPhone);
      setCustomerAddress(initialInvoice.customerAddress);
      setInvoiceNumber(initialInvoice.invoiceNumber);
      setIssueDate(initialInvoice.issueDate);
      setDueDate(initialInvoice.dueDate);
      setStatus(initialInvoice.status);
      setNotes(initialInvoice.notes || "");
      setItems(
        initialInvoice.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          description: i.description,
          quantity: i.quantity,
          unitPriceHT: i.unitPriceHT,
          tvaRate: i.tvaRate,
        }))
      );
    } else {
      // Default New Invoice
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const due = new Date();
      due.setDate(due.getDate() + 30);
      const dueStr = due.toISOString().split("T")[0];

      const nextNum = invoices.length + 312;
      setInvoiceNumber(`FAC-2026-0${nextNum}`);
      setIssueDate(todayStr);
      setDueDate(dueStr);
      setStatus("pending");
      setNotes("Règlement par virement bancaire sous 30 jours.");
      setErrorMsg("");

      // Default customer if exists
      if (customers.length > 0) {
        const c = customers[0];
        setSelectedCustomerId(c.id);
        setCustomerName(c.name);
        setCustomerICE(c.ice);
        setCustomerEmail(c.email);
        setCustomerPhone(c.phone);
        setCustomerAddress(`${c.address}, ${c.city}`);
      }

      // Default single item
      setItems([
        {
          id: `item-${Date.now()}`,
          description: "Prestation de service de gestion commerciale",
          quantity: 1,
          unitPriceHT: 2500,
          tvaRate: companySettings.defaultTva || 20,
        },
      ]);
    }
  }, [isOpen, initialInvoice, customers, companySettings, invoices.length]);

  if (!isOpen) return null;

  // Handle Customer Selection
  const handleSelectCustomer = (cId: string) => {
    setSelectedCustomerId(cId);
    const found = customers.find((c) => c.id === cId);
    if (found) {
      setCustomerName(found.name);
      setCustomerICE(found.ice);
      setCustomerEmail(found.email);
      setCustomerPhone(found.phone);
      setCustomerAddress(`${found.address}, ${found.city}`);
    }
  };

  // Handle Line Items
  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPriceHT: 1000,
        tvaRate: companySettings.defaultTva || 20,
      },
    ]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((i) => i.id !== id));
    }
  };

  const handleProductSelect = (index: number, pId: string) => {
    const prod = products.find((p) => p.id === pId);
    if (!prod) return;

    const next = [...items];
    next[index] = {
      ...next[index],
      productId: prod.id,
      description: prod.name,
      unitPriceHT: prod.unitPriceHT,
      tvaRate: prod.tvaRate,
    };
    setItems(next);
  };

  const handleUpdateItem = (
    index: number,
    field: "description" | "quantity" | "unitPriceHT" | "tvaRate",
    value: string | number
  ) => {
    const next = [...items];
    next[index] = { ...next[index], [field]: value };
    setItems(next);
  };

  // Live Totals Calculations
  const subtotalHT = Number(
    items.reduce((acc, curr) => acc + (Number(curr.quantity) || 0) * (Number(curr.unitPriceHT) || 0), 0).toFixed(2)
  );

  const totalTVA = Number(
    items
      .reduce((acc, curr) => {
        const lineHT = (Number(curr.quantity) || 0) * (Number(curr.unitPriceHT) || 0);
        return acc + lineHT * ((Number(curr.tvaRate) || 0) / 100);
      }, 0)
      .toFixed(2)
  );

  const totalTTC = Number((subtotalHT + totalTVA).toFixed(2));

  // Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("Veuillez renseigner le nom du client ou de la société.");
      return;
    }
    if (!invoiceNumber.trim()) {
      setErrorMsg("Le numéro de facture est obligatoire.");
      return;
    }
    if (items.some((i) => !i.description.trim() || i.quantity <= 0 || i.unitPriceHT < 0)) {
      setErrorMsg("Chaque ligne doit comporter une description, une quantité positive et un prix unitaire valide.");
      return;
    }

    const formattedItems: InvoiceItemLine[] = items.map((item) => {
      const lineHT = Number((item.quantity * item.unitPriceHT).toFixed(2));
      const lineTVA = Number((lineHT * (item.tvaRate / 100)).toFixed(2));
      const lineTTC = Number((lineHT + lineTVA).toFixed(2));
      return {
        id: item.id,
        productId: item.productId,
        description: item.description,
        quantity: Number(item.quantity),
        unitPriceHT: Number(item.unitPriceHT),
        tvaRate: Number(item.tvaRate),
        totalHT: lineHT,
        totalTVA: lineTVA,
        totalTTC: lineTTC,
      };
    });

    if (initialInvoice) {
      updateInvoice(initialInvoice.id, {
        customerId: selectedCustomerId || "cust-custom",
        customerName,
        customerICE,
        customerEmail,
        customerPhone,
        customerAddress,
        invoiceNumber,
        issueDate,
        dueDate,
        status,
        notes,
        items: formattedItems,
      });
    } else {
      addInvoice({
        customerId: selectedCustomerId || "cust-custom",
        customerName,
        customerICE,
        customerEmail,
        customerPhone,
        customerAddress,
        invoiceNumber,
        issueDate,
        dueDate,
        status,
        notes,
        items: formattedItems,
        subtotalHT,
        totalTVA,
        totalTTC,
        paidAmount: status === "paid" ? totalTTC : 0,
        remainingAmount: status === "paid" ? 0 : totalTTC,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 flex flex-col overflow-hidden animate-in zoom-in-95">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialInvoice ? "Modifier la Facture" : "Créer une Nouvelle Facture"}
              </h2>
              <p className="text-xs text-slate-500">
                Calcul automatique HT, TVA marocaine et TTC en MAD (Données démo)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Invoice metadata & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                N° de Facture *
              </label>
              <input
                type="text"
                required
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="FAC-2026-XXXX"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Date d&apos;Émission *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Date d&apos;Échéance *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Statut Initial
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="pending">En attente (Unpaid)</option>
                <option value="paid">Payée (Paid)</option>
                <option value="overdue">En retard (Overdue)</option>
                <option value="draft">Brouillon (Draft)</option>
                <option value="canceled">Annulée (Canceled)</option>
              </select>
            </div>
          </div>

          {/* Row 2: Customer Information */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                Informations du Client (Destinataire)
              </label>
              {customers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Sélectionner existant :</span>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 font-medium"
                  >
                    <option value="">-- Choisir un client --</option>
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Raison Sociale / Nom *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Société Marocaine SARL"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">ICE (15 chiffres fictifs)</label>
                <input
                  type="text"
                  value={customerICE}
                  onChange={(e) => setCustomerICE(e.target.value)}
                  placeholder="001928475000032"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Email de Facturation</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="compta@client.ma"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[11px] text-slate-600 block mb-1">Adresse Complète</label>
                <input
                  type="text"
                  value={customerAddress}
                  onChange={(e) => setCustomerAddress(e.target.value)}
                  placeholder="Boulevard, Étage, Ville"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Téléphone</label>
                <input
                  type="text"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="06 XX XX XX XX"
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">
                Prestations &amp; Articles Facturés
              </label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une Ligne</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 text-[11px] font-bold text-slate-600 grid grid-cols-12 gap-2 border-b border-slate-200">
                <div className="col-span-5">Description / Article</div>
                <div className="col-span-2 text-right">Qté</div>
                <div className="col-span-2 text-right">Prix Unit. HT</div>
                <div className="col-span-1 text-center">TVA</div>
                <div className="col-span-2 text-right">Total HT</div>
              </div>

              <div className="divide-y divide-slate-100 p-2 space-y-2">
                {items.map((item, idx) => {
                  const lineTotalHT = (Number(item.quantity) || 0) * (Number(item.unitPriceHT) || 0);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-xs pt-1">
                      {/* Product select & Description */}
                      <div className="col-span-5 space-y-1">
                        {products.length > 0 && (
                          <select
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            value={item.productId || ""}
                            className="w-full text-[10px] py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600"
                          >
                            <option value="">Sélectionner un produit du catalogue...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.unitPriceHT} MAD HT)
                              </option>
                            ))}
                          </select>
                        )}
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                          placeholder="Désignation de la prestation..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>

                      {/* Quantity */}
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          step="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-right rounded-lg border border-slate-200 text-xs font-mono"
                        />
                      </div>

                      {/* Unit Price HT */}
                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          step="10"
                          required
                          value={item.unitPriceHT}
                          onChange={(e) => handleUpdateItem(idx, "unitPriceHT", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-right rounded-lg border border-slate-200 text-xs font-mono"
                        />
                      </div>

                      {/* TVA rate */}
                      <div className="col-span-1">
                        <select
                          value={item.tvaRate}
                          onChange={(e) => handleUpdateItem(idx, "tvaRate", Number(e.target.value))}
                          className="w-full px-1.5 py-1.5 text-center rounded-lg border border-slate-200 text-[11px]"
                        >
                          <option value={20}>20%</option>
                          <option value={14}>14%</option>
                          <option value={10}>10%</option>
                          <option value={7}>7%</option>
                          <option value={0}>0%</option>
                        </select>
                      </div>

                      {/* Line Total HT & Delete action */}
                      <div className="col-span-2 flex items-center justify-end gap-2 font-mono font-bold text-slate-800">
                        <span>{lineTotalHT.toLocaleString("fr-FR")} MAD</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600 transition-colors"
                            title="Supprimer la ligne"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Row 4: Notes and Financial Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            <div className="sm:col-span-7 space-y-1.5">
              <label className="text-xs font-bold text-slate-700">
                Notes &amp; Conditions de Paiement
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Ex: Règlement par virement bancaire sur compte Attijariwafa Bank..."
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
              />
            </div>

            {/* Total Summary Box */}
            <div className="sm:col-span-5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Net HT :</span>
                <span className="font-mono font-semibold">{subtotalHT.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA Collectée :</span>
                <span className="font-mono font-semibold">{totalTVA.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total TTC :</span>
                <span className="font-mono text-blue-600">{totalTTC.toLocaleString("fr-FR")} MAD</span>
              </div>
            </div>
          </div>

          {/* Footer Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-600/20 transition-all cursor-pointer"
            >
              {initialInvoice ? "Mettre à Jour la Facture" : "Enregistrer la Facture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
