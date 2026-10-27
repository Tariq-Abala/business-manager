"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import {
  Printer,
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Phone,
  Mail,
  Download,
  CreditCard,
  Edit,
  Trash2,
  FileText,
  ShieldCheck,
  Share2,
} from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import InvoiceModal from "@/components/InvoiceModal";
import PaymentModal from "@/components/PaymentModal";
import ConfirmModal from "@/components/ConfirmModal";

function InvoiceDetailContent() {
  const router = useRouter();
  const routeParams = useParams();
  const invoiceId = routeParams?.id as string;
  const { invoices, companySettings, deleteInvoice, markInvoicePaid } = useBusiness();

  const invoice = invoices.find((i) => i.id === invoiceId);

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);

  if (!invoice) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-12 h-12 text-slate-400 mx-auto" />
          <h2 className="text-xl font-bold text-slate-900">Facture Introuvable</h2>
          <p className="text-xs text-slate-500">
            La facture demandée n&apos;existe pas ou a été supprimée des données locales.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au tableau de bord</span>
          </Link>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleDelete = () => {
    deleteInvoice(invoice.id);
    router.push("/factures");
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 py-6 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Top Action Bar (hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au tableau de bord</span>
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          {invoice.status !== "paid" && (
            <button
              onClick={() => setPaymentModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Enregistrer un Paiement</span>
            </button>
          )}

          <button
            onClick={() => setEditModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Edit className="w-3.5 h-3.5 text-slate-500" />
            <span>Modifier</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimer la Facture</span>
          </button>

          <button
            onClick={() => setConfirmDeleteOpen(true)}
            className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-colors cursor-pointer"
            title="Supprimer la facture"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable Document */}
      <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-sm printable-document space-y-10">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between gap-8 pb-8 border-b border-slate-200">
          {/* Company Details */}
          <div className="space-y-2 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
                BM
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  {companySettings.companyName}
                </h1>
                <p className="text-[10px] text-blue-600 uppercase font-semibold">
                  Prestations Informatiques &amp; Équipements
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {companySettings.address}
              <br />
              {companySettings.postalCode} {companySettings.city}, {companySettings.country}
            </p>

            <div className="pt-1 text-[11px] text-slate-500 space-y-0.5 font-mono">
              <p>ICE: <span className="font-semibold text-slate-800">{companySettings.ice}</span></p>
              <p>IF: {companySettings.ifNum} | RC: {companySettings.rc}</p>
              <p>CNSS: {companySettings.cnss} | Patente: {companySettings.patentNumber}</p>
              <p>Tél: {companySettings.phone}</p>
            </div>
          </div>

          {/* Invoice Meta & Status */}
          <div className="sm:text-right space-y-3">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-bold text-blue-600 block">
                Facture Commerciale
              </span>
              <div className="text-2xl font-mono font-extrabold text-slate-900">
                {invoice.invoiceNumber}
              </div>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <p>
                Date d&apos;émission : <span className="font-bold text-slate-900">{invoice.issueDate}</span>
              </p>
              <p>
                Date d&apos;échéance : <span className="font-bold text-slate-900">{invoice.dueDate}</span>
              </p>
              {invoice.convertedFromQuoteId && (
                <p className="text-[11px] text-teal-600 font-medium">
                  Réf. Devis associé : DEV-2026-VAL
                </p>
              )}
            </div>

            <div className="pt-1">
              {invoice.status === "paid" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>FACTURE ACQUITTÉE / PAYÉE</span>
                </div>
              )}
              {invoice.status === "pending" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  <Clock className="w-3.5 h-3.5" />
                  <span>EN ATTENTE DE RÈGLEMENT</span>
                </div>
              )}
              {invoice.status === "overdue" && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>ÉCHÉANCE DÉPASSÉE</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client Box */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              Facturé à (Client)
            </span>
            <h3 className="font-bold text-sm text-slate-900">{invoice.customerName}</h3>
            <p className="text-xs text-slate-600">{invoice.customerAddress}</p>
            <div className="pt-1 text-[11px] text-slate-500 font-mono">
              <p>ICE : <span className="font-semibold text-slate-800">{invoice.customerICE || "Non renseigné"}</span></p>
              {invoice.customerEmail && <p>Email : {invoice.customerEmail}</p>}
              {invoice.customerPhone && <p>Tél : {invoice.customerPhone}</p>}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-slate-200 space-y-2 text-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Coordonnées de Règlement
            </span>
            <p className="text-slate-700">
              <strong>Banque :</strong> {companySettings.bankName}
            </p>
            <p className="font-mono text-[11px] text-slate-800">
              <strong>RIB (24 chiffres) :</strong> {companySettings.rib}
            </p>
            <p className="text-slate-500 text-[11px]">
              Merci de mentionner le numéro de facture <strong>{invoice.invoiceNumber}</strong> dans le libellé de votre virement.
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="space-y-4">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-900 text-[11px] font-bold uppercase tracking-wider text-slate-900">
                <th className="py-3 px-2">Désignation des Prestations / Articles</th>
                <th className="py-3 px-2 text-right w-16">Qté</th>
                <th className="py-3 px-2 text-right w-28">Prix Unit. HT</th>
                <th className="py-3 px-2 text-center w-20">TVA</th>
                <th className="py-3 px-2 text-right w-28">Total HT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {invoice.items.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="py-3.5 px-2">
                    <span className="font-semibold text-slate-900 block">{item.description}</span>
                    {item.productId && (
                      <span className="text-[10px] text-slate-400 font-mono">Réf: {item.productId}</span>
                    )}
                  </td>
                  <td className="py-3.5 px-2 text-right font-mono text-slate-700">{item.quantity}</td>
                  <td className="py-3.5 px-2 text-right font-mono text-slate-700">
                    {item.unitPriceHT.toLocaleString("fr-FR")} MAD
                  </td>
                  <td className="py-3.5 px-2 text-center font-mono text-slate-600">{item.tvaRate}%</td>
                  <td className="py-3.5 px-2 text-right font-mono font-bold text-slate-900">
                    {item.totalHT.toLocaleString("fr-FR")} MAD
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Summary */}
          <div className="flex justify-end pt-4">
            <div className="w-full sm:w-80 space-y-2 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Total Net HT :</span>
                <span className="font-mono font-semibold">{invoice.subtotalHT.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-slate-600">
                <span>Total TVA (20%) :</span>
                <span className="font-mono font-semibold">{invoice.totalTVA.toLocaleString("fr-FR")} MAD</span>
              </div>
              <div className="flex justify-between py-2 border-b-2 border-slate-900 text-sm font-bold text-slate-900">
                <span>Total TTC :</span>
                <span className="font-mono text-blue-600">{invoice.totalTTC.toLocaleString("fr-FR")} MAD</span>
              </div>

              {invoice.paidAmount > 0 && (
                <div className="flex justify-between py-1 text-emerald-700 font-semibold">
                  <span>Montant Déjà Encaissé :</span>
                  <span className="font-mono">-{invoice.paidAmount.toLocaleString("fr-FR")} MAD</span>
                </div>
              )}

              <div className="flex justify-between py-1 text-xs font-bold text-slate-900 bg-slate-50 p-2 rounded-xl">
                <span>Net à Payer (Solde Restant) :</span>
                <span className="font-mono text-amber-600">{invoice.remainingAmount.toLocaleString("fr-FR")} MAD</span>
              </div>
            </div>
          </div>
        </div>

        {/* Notes & Legal Footer */}
        <div className="pt-8 border-t border-slate-200 text-xs text-slate-500 space-y-3">
          {invoice.notes && (
            <div>
              <strong className="text-slate-800">Conditions de règlement :</strong>
              <p className="mt-0.5 text-slate-600">{invoice.notes}</p>
            </div>
          )}

          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[10px] text-slate-500 leading-tight">
            <strong>Mention Légale de Démonstration :</strong> {companySettings.legalNotice}
          </div>
        </div>
      </div>

      {/* Modals */}
      <InvoiceModal
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        initialInvoice={invoice}
      />

      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        preselectedInvoiceId={invoice.id}
      />

      <ConfirmModal
        isOpen={confirmDeleteOpen}
        title="Supprimer la Facture"
        message={`Voulez-vous supprimer définitivement la facture ${invoice.invoiceNumber} ?`}
        confirmLabel="Supprimer"
        onConfirm={handleDelete}
        onCancel={() => setConfirmDeleteOpen(false)}
      />
    </div>
  );
}

export default function InvoiceDetailPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-4">
          <div className="text-center space-y-2">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-semibold">Chargement de la facture...</p>
          </div>
        </div>
      }
    >
      <InvoiceDetailContent />
    </React.Suspense>
  );
}
