"use client";

import React from "react";
import Link from "next/link";
import { LayoutDashboard, ExternalLink, ShieldCheck, HeartHandshake } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-xs text-slate-500 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold text-sm text-slate-900 block">
                BusinessManager Cloud • Démonstration SaaS
              </span>
              <p className="text-[11px] text-slate-400">
                Application de gestion commerciale, facturation et suivi des encaissements pour PME au Maroc
              </p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-[11px] text-slate-600 max-w-md">
            <span className="font-semibold text-slate-800">Transparence Démonstration :</span> Ce projet est une
            réalisation de portfolio technique. Il ne constitue pas un progiciel comptable certifié DGI.
            Les données et identifiants fiscaux (ICE, IF, RC) sont des exemples générés à titre illustratif.
          </div>
        </div>

        {/* Developer Attribution & Copyright Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pt-2">
          <div className="space-y-1">
            <p className="font-semibold text-slate-900 flex items-center gap-1.5">
              <span>Développé par</span>
              <a
                href="https://tariqabala.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 font-bold underline decoration-blue-300 hover:decoration-blue-600 transition-colors inline-flex items-center gap-1"
              >
                Tariq Abala <ExternalLink className="w-3 h-3" />
              </a>
            </p>
            <p className="text-[11px] font-medium text-slate-700">
              Web Development &amp; Digital Solutions
            </p>
            <p className="text-[10px] text-slate-400 font-mono">
              Professional Websites • Business Applications • Custom Admin Panels
            </p>
          </div>

          <div className="flex flex-col md:items-end gap-1.5 text-[11px]">
            <div className="flex flex-wrap items-center gap-2 text-slate-700">
              <span className="font-semibold">© 2026 TARIQ ABALA. Tous droits réservés.</span>
              <span className="text-slate-300">•</span>
              <span>BusinessManager SaaS Maroc</span>
            </div>
            <div className="flex items-center gap-3 text-slate-500">
              <Link href="/factures" className="hover:text-blue-600 transition-colors">
                Factures
              </Link>
              <span>•</span>
              <Link href="/devis" className="hover:text-blue-600 transition-colors">
                Devis
              </Link>
              <span>•</span>
              <Link href="/clients" className="hover:text-blue-600 transition-colors">
                Clients
              </Link>
              <span>•</span>
              <Link href="/produits" className="hover:text-blue-600 transition-colors">
                Stocks
              </Link>
              <span>•</span>
              <Link href="/tarifs" className="hover:text-blue-600 transition-colors">
                Tarifs SaaS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
