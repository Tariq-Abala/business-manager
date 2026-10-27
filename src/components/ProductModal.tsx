"use client";

import React, { useState, useEffect } from "react";
import { X, Package, AlertCircle } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { Product } from "@/types/business";

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialProduct?: Product | null;
}

export default function ProductModal({
  isOpen,
  onClose,
  initialProduct,
}: ProductModalProps) {
  const { addProduct, updateProduct, companySettings } = useBusiness();

  const [name, setName] = useState("");
  const [type, setType] = useState<"service" | "product">("service");
  const [sku, setSku] = useState("");
  const [unitPriceHT, setUnitPriceHT] = useState<number>(1000);
  const [tvaRate, setTvaRate] = useState<number>(companySettings.defaultTva || 20);
  const [stock, setStock] = useState<number | null>(null);
  const [minStockAlert, setMinStockAlert] = useState<number>(5);
  const [unit, setUnit] = useState("unité");
  const [description, setDescription] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialProduct) {
      setName(initialProduct.name);
      setType(initialProduct.type);
      setSku(initialProduct.sku);
      setUnitPriceHT(initialProduct.unitPriceHT);
      setTvaRate(initialProduct.tvaRate);
      setStock(initialProduct.stock);
      setMinStockAlert(initialProduct.minStockAlert);
      setUnit(initialProduct.unit);
      setDescription(initialProduct.description);
    } else {
      setName("");
      setType("service");
      setSku(`ART-${Math.floor(100 + Math.random() * 900)}`);
      setUnitPriceHT(1500);
      setTvaRate(companySettings.defaultTva || 20);
      setStock(null);
      setMinStockAlert(5);
      setUnit("forfait");
      setDescription("");
    }
    setErrorMsg("");
  }, [isOpen, initialProduct, companySettings]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("La désignation du produit ou service est obligatoire.");
      return;
    }

    if (initialProduct) {
      updateProduct(initialProduct.id, {
        name,
        type,
        sku,
        unitPriceHT: Number(unitPriceHT),
        tvaRate: Number(tvaRate),
        stock: type === "product" ? Number(stock || 0) : null,
        minStockAlert: Number(minStockAlert),
        unit,
        description,
      });
    } else {
      addProduct({
        name,
        type,
        sku,
        unitPriceHT: Number(unitPriceHT),
        tvaRate: Number(tvaRate),
        stock: type === "product" ? Number(stock || 0) : null,
        minStockAlert: Number(minStockAlert),
        unit,
        description,
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

      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 shadow-2xl border border-slate-200 z-10 space-y-5 animate-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialProduct ? "Modifier l'Article" : "Ajouter un Article au Catalogue"}
              </h2>
              <p className="text-xs text-slate-500">Service immatériel ou produit avec gestion de stock</p>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Désignation du Service ou Produit *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Abonnement Licence Cloud ERP"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Type d&apos;Élément
              </label>
              <select
                value={type}
                onChange={(e) => {
                  const t = e.target.value as "service" | "product";
                  setType(t);
                  if (t === "product" && stock === null) setStock(10);
                  if (t === "service") setStock(null);
                }}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value="service">Prestation de Service</option>
                <option value="product">Matériel / Produit physique</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Code SKU / Référence
              </label>
              <input
                type="text"
                placeholder="SRV-01"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Prix Unitaire HT (MAD) *
              </label>
              <input
                type="number"
                min="0"
                step="10"
                required
                value={unitPriceHT}
                onChange={(e) => setUnitPriceHT(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Taux TVA
              </label>
              <select
                value={tvaRate}
                onChange={(e) => setTvaRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              >
                <option value={20}>20% (Normal)</option>
                <option value={14}>14% (Prestations)</option>
                <option value={10}>10% (Restauration/Tourisme)</option>
                <option value={7}>7% (Produits de base)</option>
                <option value={0}>0% (Exonéré)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Unité de Facturation
              </label>
              <input
                type="text"
                placeholder="forfait, jour, unité"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          {/* Stock fields if physical product */}
          {type === "product" && (
            <div className="p-3 rounded-2xl bg-amber-50/60 border border-amber-200/70 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Quantité en Stock Réel
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stock ?? 0}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-mono font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-amber-900 block mb-1">
                  Seuil d&apos;Alerte Stock Bas
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={minStockAlert}
                  onChange={(e) => setMinStockAlert(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-white border border-amber-200 text-xs font-mono text-slate-900"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Description / Fiche Technique
            </label>
            <textarea
              rows={2}
              placeholder="Détails du produit ou service pour devis et factures..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 resize-none"
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
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Enregistrer l&apos;Article
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
