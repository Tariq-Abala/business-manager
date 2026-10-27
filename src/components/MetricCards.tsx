"use client";

import React from "react";
import {
  TrendingUp,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";

export default function MetricCards() {
  const { metrics } = useBusiness();

  // Percentage calculations
  const totalBilled = metrics.totalReceivables + metrics.paidReceivables;
  const paidPercent =
    totalBilled > 0 ? Math.round((metrics.paidReceivables / totalBilled) * 100) : 0;
  const unpaidPercent =
    totalBilled > 0 ? Math.round((metrics.unpaidReceivables / totalBilled) * 100) : 0;
  const overduePercent =
    totalBilled > 0 ? Math.round((metrics.overdueReceivables / totalBilled) * 100) : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Total Receivables Card (with gradient/progress bar matching user image) */}
      <div className="rounded-3xl p-5 bg-gradient-to-br from-blue-600 via-indigo-600 to-indigo-700 text-white shadow-sm flex flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center justify-between text-xs text-blue-100 mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/15 backdrop-blur-xs flex items-center justify-center text-white">
                <Receipt className="w-4 h-4" />
              </div>
              <span className="font-semibold">Créances Totales</span>
            </div>
            <span className="text-[11px] bg-white/20 px-2 py-0.5 rounded-full font-mono">
              En cours
            </span>
          </div>

          <div className="space-y-1 mt-2">
            <span className="text-xs text-blue-200">Reste à encaisser</span>
            <div className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {metrics.totalReceivables.toLocaleString("fr-FR")} MAD
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 mt-5 pt-3 border-t border-white/15">
          <div className="flex justify-between text-[11px] text-blue-100 mb-1.5 font-medium">
            <span>Taux d&apos;encaissement</span>
            <span className="font-bold">{paidPercent}% Réglé</span>
          </div>
          <div className="w-full h-2 rounded-full bg-black/20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-300 to-emerald-300 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.max(5, paidPercent))}%` }}
            />
          </div>
        </div>

        {/* Subtle decorative circles */}
        <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* 2. Paid Card */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
              <ArrowUpRight className="w-3 h-3" />
              <span>{paidPercent}%</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            Factures Payées
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {metrics.paidReceivables.toLocaleString("fr-FR")} MAD
          </div>
        </div>

        {/* Mini bar visual matching reference image */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end gap-1.5 h-8">
          {[40, 65, 50, 85, 70, 95, 80, 100].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-indigo-100 hover:bg-indigo-300 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>

      {/* 3. Unpaid Card (En Attente) */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full">
              <span>{metrics.invoicesCount.pending} factures</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            En Attente d&apos;Échéance
          </span>
          <div className="text-2xl font-bold text-slate-900 mt-1">
            {metrics.unpaidReceivables.toLocaleString("fr-FR")} MAD
          </div>
        </div>

        {/* Mini wave indicator matching reference image */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="text-[11px] text-teal-700 font-medium">Délais normaux (30j)</span>
          <div className="flex items-end gap-1 h-6">
            {[30, 45, 60, 40, 75, 55, 65].map((h, i) => (
              <div
                key={i}
                className="w-1.5 rounded-full bg-teal-200"
                style={{ height: `${h}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 4. Overdue Card (En Retard) */}
      <div className="rounded-3xl p-5 bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between hover:border-slate-300 transition-colors">
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">
              <span>{metrics.invoicesCount.overdue} en retard</span>
            </div>
          </div>
          <span className="text-xs text-slate-500 font-medium block">
            Échéance Dépassée
          </span>
          <div className="text-2xl font-bold text-amber-600 mt-1">
            {metrics.overdueReceivables.toLocaleString("fr-FR")} MAD
          </div>
        </div>

        {/* Mini bars alert matching reference image */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-end gap-1.5 h-8">
          {[20, 40, 35, 60, 45, 80, 65, 90].map((h, i) => (
            <div
              key={i}
              className="flex-1 rounded-sm bg-amber-100 hover:bg-amber-300 transition-colors"
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
