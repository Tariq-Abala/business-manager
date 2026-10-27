"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Menu,
  Search,
  Bell,
  Plus,
  RotateCcw,
  Sparkles,
  Receipt,
  FileText,
  Users,
  Package,
  CreditCard,
  ChevronDown,
  Info,
} from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";

interface TopBarProps {
  onOpenMobileMenu: () => void;
  onOpenNewInvoice?: () => void;
  onOpenNewQuote?: () => void;
  onOpenNewCustomer?: () => void;
  onOpenNewProduct?: () => void;
  onOpenNewPayment?: () => void;
}

export default function TopBar({
  onOpenMobileMenu,
  onOpenNewInvoice,
  onOpenNewQuote,
  onOpenNewCustomer,
  onOpenNewProduct,
  onOpenNewPayment,
}: TopBarProps) {
  const { resetToDemoData } = useBusiness();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleReset = () => {
    if (window.confirm("Réinitialiser les données de démonstration vers leur état initial ?")) {
      resetToDemoData();
    }
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Greeting */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
          aria-label="Ouvrir le menu de navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-none">
            Bonjour, Tariq <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-[11px] text-slate-500 mt-0.5 hidden sm:block">
            Espace de gestion commerciale PME • Démonstration Portfolio
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Reset Demo Button */}
        <button
          onClick={handleReset}
          title="Réinitialiser toutes les données de démonstration"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Réinitialiser Démo</span>
        </button>

        {/* Global Create Button with dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nouveau Document</span>
            <ChevronDown className="w-3.5 h-3.5 text-blue-200" />
          </button>

          {dropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-2xl bg-white border border-slate-200 shadow-xl z-50 p-1.5 text-xs space-y-0.5 animate-in fade-in zoom-in-95">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenNewInvoice) onOpenNewInvoice();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <span>Nouvelle Facture</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenNewQuote) onOpenNewQuote();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>Nouveau Devis</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenNewCustomer) onOpenNewCustomer();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Users className="w-4 h-4 text-indigo-600" />
                  <span>Nouveau Client</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenNewProduct) onOpenNewProduct();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <Package className="w-4 h-4 text-amber-600" />
                  <span>Nouveau Produit / Service</span>
                </button>

                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    if (onOpenNewPayment) onOpenNewPayment();
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 flex items-center gap-2.5 transition-colors cursor-pointer"
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Enregistrer Règlement</span>
                </button>
              </div>
            </>
          )}
        </div>

        {/* User avatar indicator */}
        <div className="w-9 h-9 rounded-full bg-blue-50 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center">
          TA
        </div>
      </div>
    </header>
  );
}
