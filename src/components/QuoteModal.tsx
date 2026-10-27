"use client";

import React, { useState, useEffect } from "react";
import { X, Plus, Trash2, FileText, Building2, AlertCircle } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { Quote, InvoiceItemLine, QuoteStatus } from "@/types/business";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuote?: Quote | null;
}

export default function QuoteModal({
  isOpen,
  onClose,
  initialQuote,
}: QuoteModalProps) {
  const { customers, products, companySettings, addQuote, updateQuote, quotes } =
    useBusiness();

  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerICE, setCustomerICE] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const [quoteNumber, setQuoteNumber] = useState("");
  const [issueDate, setIssueDate] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [status, setStatus] = useState<QuoteStatus>("draft");
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

  useEffect(() => {
    if (initialQuote) {
      setSelectedCustomerId(initialQuote.customerId);
      setCustomerName(initialQuote.customerName);
      setCustomerICE(initialQuote.customerICE);
      setCustomerEmail(initialQuote.customerEmail);
      setCustomerPhone(initialQuote.customerPhone);
      setCustomerAddress(initialQuote.customerAddress);
      setQuoteNumber(initialQuote.quoteNumber);
      setIssueDate(initialQuote.issueDate);
      setValidUntil(initialQuote.validUntil);
      setStatus(initialQuote.status);
      setNotes(initialQuote.notes || "");
      setItems(
        initialQuote.items.map((i) => ({
          id: i.id,
          productId: i.productId,
          description: i.description,
          quantity: i.quantity,
          unitPriceHT: i.unitPriceHT,
          tvaRate: i.tvaRate,
        }))
      );
    } else {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];
      const valid = new Date();
      valid.setDate(valid.getDate() + 30);
      const validStr = valid.toISOString().split("T")[0];

      const nextNum = quotes.length + 95;
      setQuoteNumber(`DEV-2026-00${nextNum}`);
      setIssueDate(todayStr);
      setValidUntil(validStr);
      setStatus("draft");
      setNotes("Validité de l'offre : 30 jours à compter de la date d'émission.");
      setErrorMsg("");

      if (customers.length > 0) {
        const c = customers[0];
        setSelectedCustomerId(c.id);
        setCustomerName(c.name);
        setCustomerICE(c.ice);
        setCustomerEmail(c.email);
        setCustomerPhone(c.phone);
        setCustomerAddress(`${c.address}, ${c.city}`);
      }

      setItems([
        {
          id: `qitem-${Date.now()}`,
          description: "Prestation d'ingénierie logicielle ou fourniture",
          quantity: 1,
          unitPriceHT: 3500,
          tvaRate: companySettings.defaultTva || 20,
        },
      ]);
    }
  }, [isOpen, initialQuote, customers, companySettings, quotes.length]);

  if (!isOpen) return null;

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

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `qitem-${Date.now()}`,
        description: "",
        quantity: 1,
        unitPriceHT: 1200,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim()) {
      setErrorMsg("Veuillez renseigner le nom du client.");
      return;
    }
    if (!quoteNumber.trim()) {
      setErrorMsg("Le numéro de devis est obligatoire.");
      return;
    }
    if (items.some((i) => !i.description.trim() || i.quantity <= 0 || i.unitPriceHT < 0)) {
      setErrorMsg("Chaque ligne de devis doit comporter une désignation valide.");
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

    if (initialQuote) {
      updateQuote(initialQuote.id, {
        customerId: selectedCustomerId || "cust-custom",
        customerName,
        customerICE,
        customerEmail,
        customerPhone,
        customerAddress,
        quoteNumber,
        issueDate,
        validUntil,
        status,
        notes,
        items: formattedItems,
      });
    } else {
      addQuote({
        customerId: selectedCustomerId || "cust-custom",
        customerName,
        customerICE,
        customerEmail,
        customerPhone,
        customerAddress,
        quoteNumber,
        issueDate,
        validUntil,
        status,
        notes,
        items: formattedItems,
        subtotalHT,
        totalTVA,
        totalTTC,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 z-10 flex flex-col overflow-hidden animate-in zoom-in-95">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                {initialQuote ? "Modifier le Devis" : "Créer un Nouveau Devis"}
              </h2>
              <p className="text-xs text-slate-500">Proposition commerciale et chiffrage (Démo)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Row 1: Quote metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200/80">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">N° de Devis *</label>
              <input
                type="text"
                required
                value={quoteNumber}
                onChange={(e) => setQuoteNumber(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-mono font-semibold"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Date d&apos;Émission *</label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Date de Validité *</label>
              <input
                type="date"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Statut</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as QuoteStatus)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold"
              >
                <option value="draft">Brouillon (Draft)</option>
                <option value="sent">Envoyé au client</option>
                <option value="accepted">Accepté / Validé</option>
                <option value="rejected">Refusé</option>
                <option value="converted">Converti en facture</option>
              </select>
            </div>
          </div>

          {/* Row 2: Customer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                Destinataire du Devis
              </label>
              {customers.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500">Choisir :</span>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleSelectCustomer(e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg bg-white border border-slate-200"
                  >
                    <option value="">-- Sélectionner un client --</option>
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
                <label className="text-[11px] text-slate-600 block mb-1">Raison Sociale *</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">ICE</label>
                <input
                  type="text"
                  value={customerICE}
                  onChange={(e) => setCustomerICE(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-600 block mb-1">Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs"
                />
              </div>
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-900">Articles &amp; Prestations Chiffrées</label>
              <button
                type="button"
                onClick={handleAddItem}
                className="px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold flex items-center gap-1.5 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Ajouter une Ligne</span>
              </button>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <div className="bg-slate-50 px-4 py-2.5 text-[11px] font-bold text-slate-600 grid grid-cols-12 gap-2 border-b border-slate-200">
                <div className="col-span-5">Désignation</div>
                <div className="col-span-2 text-right">Qté</div>
                <div className="col-span-2 text-right">Prix HT (MAD)</div>
                <div className="col-span-1 text-center">TVA</div>
                <div className="col-span-2 text-right">Total HT</div>
              </div>

              <div className="divide-y divide-slate-100 p-2 space-y-2">
                {items.map((item, idx) => {
                  const lineTotalHT = (Number(item.quantity) || 0) * (Number(item.unitPriceHT) || 0);
                  return (
                    <div key={item.id} className="grid grid-cols-12 gap-2 items-center text-xs pt-1">
                      <div className="col-span-5 space-y-1">
                        {products.length > 0 && (
                          <select
                            onChange={(e) => handleProductSelect(idx, e.target.value)}
                            value={item.productId || ""}
                            className="w-full text-[10px] py-1 px-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600"
                          >
                            <option value="">Sélectionner depuis le catalogue...</option>
                            {products.map((p) => (
                              <option key={p.id} value={p.id}>
                                {p.name} ({p.unitPriceHT} MAD)
                              </option>
                            ))}
                          </select>
                        )}
                        <input
                          type="text"
                          required
                          value={item.description}
                          onChange={(e) => handleUpdateItem(idx, "description", e.target.value)}
                          placeholder="Description de la prestation..."
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="1"
                          required
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(idx, "quantity", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-right rounded-lg border border-slate-200 text-xs font-mono"
                        />
                      </div>

                      <div className="col-span-2">
                        <input
                          type="number"
                          min="0"
                          required
                          value={item.unitPriceHT}
                          onChange={(e) => handleUpdateItem(idx, "unitPriceHT", Number(e.target.value))}
                          className="w-full px-2.5 py-1.5 text-right rounded-lg border border-slate-200 text-xs font-mono"
                        />
                      </div>

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

                      <div className="col-span-2 flex items-center justify-end gap-2 font-mono font-bold text-slate-800">
                        <span>{lineTotalHT.toLocaleString("fr-FR")} MAD</span>
                        {items.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
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

          {/* Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 pt-2">
            <div className="sm:col-span-7">
              <label className="text-xs font-bold text-slate-700 block mb-1">Notes du Devis</label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs resize-none"
              />
            </div>

            <div className="sm:col-span-5 p-4 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Total Net HT :</span>
                <span className="font-mono font-semibold">{subtotalHT.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>TVA (20%) :</span>
                <span className="font-mono font-semibold">{totalTVA.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-bold text-slate-900">
                <span>Total TTC :</span>
                <span className="font-mono text-teal-700">{totalTTC.toLocaleString("fr-FR")} MAD</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition-all"
            >
              {initialQuote ? "Mettre à Jour le Devis" : "Enregistrer le Devis"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
