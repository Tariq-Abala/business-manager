"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Receipt,
  FileText,
  Users,
  Package,
  CreditCard,
  Settings,
  Sparkles,
  RotateCcw,
  ExternalLink,
  ShieldAlert,
  ChevronRight,
  Menu,
  X,
  Search,
} from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({ mobileOpen, setMobileOpen }: SidebarProps) {
  const pathname = usePathname();
  const { resetToDemoData, metrics } = useBusiness();

  const navItems = [
    {
      label: "Tableau de Bord",
      href: "/",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: "Factures",
      href: "/factures",
      icon: Receipt,
      badge: metrics.invoicesCount.pending > 0 ? `${metrics.invoicesCount.pending}` : null,
      badgeColor: "bg-blue-100 text-blue-700",
    },
    {
      label: "Devis (Quotes)",
      href: "/devis",
      icon: FileText,
      badge: metrics.quotesCount.accepted > 0 ? `${metrics.quotesCount.accepted} validé` : null,
      badgeColor: "bg-teal-100 text-teal-700",
    },
    {
      label: "Clients & Contacts",
      href: "/clients",
      icon: Users,
      badge: `${metrics.totalCustomers}`,
      badgeColor: "bg-slate-100 text-slate-600",
    },
    {
      label: "Produits & Stocks",
      href: "/produits",
      icon: Package,
      badge: metrics.lowStockProductsCount > 0 ? `${metrics.lowStockProductsCount} alerte` : null,
      badgeColor: "bg-amber-100 text-amber-700",
    },
    {
      label: "Encaissements",
      href: "/paiements",
      icon: CreditCard,
      badge: null,
    },
    {
      label: "Paramètres Entreprise",
      href: "/parametres",
      icon: Settings,
      badge: null,
    },
    {
      label: "Tarifs & Formules",
      href: "/tarifs",
      icon: Sparkles,
      badge: "SaaS",
      badgeColor: "bg-indigo-50 text-indigo-600",
    },
  ];

  const handleReset = () => {
    if (window.confirm("Voulez-vous réinitialiser toutes les données de démonstration avec les données par défaut ?")) {
      resetToDemoData();
    }
  };

  const Content = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 text-slate-700 select-none">
      {/* Brand Header matching user image */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
            <LayoutDashboard className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base text-slate-900 tracking-tight leading-none">
                BusinessManager
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 mt-0.5 block">
              Gestion PME • Maroc
            </span>
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          aria-label="Fermer le menu"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
          Menu Principal
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all group ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm shadow-blue-600/25"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-white" : "text-slate-400 group-hover:text-blue-600"
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Demo notice and reset data */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600 space-y-1.5">
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Mode Démonstration</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Données fictives de simulation stockées localement dans votre navigateur.
          </p>
          <button
            onClick={handleReset}
            className="w-full mt-1 py-1.5 px-2.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>Réinitialiser les données</span>
          </button>
        </div>

        {/* User profile avatar footer */}
        <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs flex items-center justify-center">
              TA
            </div>
            <div className="overflow-hidden">
              <span className="text-xs font-bold text-slate-900 block truncate">
                Tariq Abala
              </span>
              <span className="text-[10px] text-slate-400 block truncate">
                Admin Démo PME
              </span>
            </div>
          </div>
          <a
            href="https://tariqabala.com"
            target="_blank"
            rel="noopener noreferrer"
            title="Portfolio Tariq Abala"
            className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {Content}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl">
            {Content}
          </div>
        </div>
      )}
    </>
  );
}
