"use client";

import React, { useState, useEffect } from "react";
import { X, CreditCard, AlertCircle, CheckCircle2 } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { Payment } from "@/types/business";

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  preselectedInvoiceId?: string;
}

export default function PaymentModal({
  isOpen,
  onClose,
  preselectedInvoiceId,
}: PaymentModalProps) {
  const { invoices, addPayment } = useBusiness();

  const [selectedInvoiceId, setSelectedInvoiceId] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [paymentDate, setPaymentDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"virement" | "cheque" | "especes" | "carte">("virement");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const pendingInvoices = invoices.filter((i) => i.status !== "paid" && i.remainingAmount > 0);
  const selectedInvoice = invoices.find((i) => i.id === selectedInvoiceId);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setPaymentDate(today);
    setReference(`REG-${Math.floor(100000 + Math.random() * 900000)}`);
    setNotes("Règlement conforme crédité sur le compte bancaire.");
    setErrorMsg("");

    if (preselectedInvoiceId) {
      setSelectedInvoiceId(preselectedInvoiceId);
      const inv = invoices.find((i) => i.id === preselectedInvoiceId);
      if (inv) setAmount(inv.remainingAmount);
    } else if (pendingInvoices.length > 0) {
      const inv = pendingInvoices[0];
      setSelectedInvoiceId(inv.id);
      setAmount(inv.remainingAmount);
    } else {
      setSelectedInvoiceId("");
      setAmount(0);
    }
  }, [isOpen, preselectedInvoiceId, invoices]);

  if (!isOpen) return null;

  const handleInvoiceChange = (id: string) => {
    setSelectedInvoiceId(id);
    const inv = invoices.find((i) => i.id === id);
    if (inv) {
      setAmount(inv.remainingAmount);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInvoice) {
      setErrorMsg("Veuillez sélectionner une facture à régler.");
      return;
    }
    if (amount <= 0) {
      setErrorMsg("Le montant du règlement doit être supérieur à zéro.");
      return;
    }
    if (amount > selectedInvoice.remainingAmount) {
      setErrorMsg(`Le montant saisi (${amount} MAD) excède le solde restant dû (${selectedInvoice.remainingAmount} MAD).`);
      return;
    }

    addPayment({
      invoiceId: selectedInvoice.id,
      invoiceNumber: selectedInvoice.invoiceNumber,
      customerName: selectedInvoice.customerName,
      amount: Number(amount),
      paymentDate,
      paymentMethod,
      reference: reference || `REG-${Date.now().toString().slice(-6)}`,
      notes,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Enregistrer un Règlement</h2>
              <p className="text-xs text-slate-500">Encaissement et mise à jour du solde dû (Démo)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-semibold text-red-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {pendingInvoices.length === 0 && !selectedInvoice ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <p className="text-sm font-bold text-slate-800">Toutes les factures sont déjà payées !</p>
            <p className="text-xs text-slate-500">Aucune créance en attente de règlement.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Facture Concernée *
              </label>
              <select
                required
                value={selectedInvoiceId}
                onChange={(e) => handleInvoiceChange(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-semibold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                {invoices.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.invoiceNumber} — {inv.customerName} (Reste : {inv.remainingAmount.toLocaleString("fr-FR")} MAD)
                  </option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                <div className="flex justify-between text-slate-600">
                  <span>Client :</span>
                  <span className="font-semibold text-slate-900">{selectedInvoice.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Montant Total TTC :</span>
                  <span className="font-mono font-semibold">{selectedInvoice.totalTTC.toLocaleString("fr-FR")} MAD</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Solde restant dû :</span>
                  <span className="font-mono font-bold text-amber-600">{selectedInvoice.remainingAmount.toLocaleString("fr-FR")} MAD</span>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Montant Encaissé (MAD) *
                </label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  required
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Date du Paiement *
                </label>
                <input
                  type="date"
                  required
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mode de Règlement
                </label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as Payment["paymentMethod"])}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                >
                  <option value="virement">Virement Bancaire</option>
                  <option value="cheque">Chèque Bancaire</option>
                  <option value="carte">Carte Bancaire / TPV</option>
                  <option value="especes">Espèces (Reçu de caisse)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Référence / N° Chèque
                </label>
                <input
                  type="text"
                  placeholder="VIR-123456 ou CHQ-0012"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Notes &amp; Observations
              </label>
              <input
                type="text"
                placeholder="Règlement partiel ou total..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Valider l&apos;Encaissement
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
