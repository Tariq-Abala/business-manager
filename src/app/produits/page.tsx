"use client";

import React, { useState, useMemo } from "react";
import {
  Package,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Edit,
  ArrowUpDown,
  Layers,
  ShoppingBag,
} from "lucide-react";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import Footer from "@/components/Footer";
import ProductModal from "@/components/ProductModal";
import ConfirmModal from "@/components/ConfirmModal";
import { useBusiness } from "@/context/BusinessContext";
import { Product } from "@/types/business";

export default function ProduitsPage() {
  const { products, deleteProduct, adjustStock } = useBusiness();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | "service" | "product">("all");

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (typeFilter !== "all" && p.type !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesSku && !matchesDesc) return false;
      }
      return true;
    });
  }, [products, typeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <div className="flex flex-1">
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

        <div className="flex-1 flex flex-col min-w-0">
          <TopBar
            onOpenMobileMenu={() => setMobileOpen(true)}
            onOpenNewProduct={() => {
              setEditingProduct(null);
              setProductModalOpen(true);
            }}
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Catalogue Produits &amp; Gestion des Stocks
                </h1>
                <p className="text-xs text-slate-500">
                  Prestations informatiques facturées au forfait/jour et matériels physiques en stock
                </p>
              </div>

              <button
                onClick={() => {
                  setEditingProduct(null);
                  setProductModalOpen(true);
                }}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Ajouter un Article</span>
              </button>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4">
              {/* Filter Row */}
              <div className="p-5 sm:p-6 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => setTypeFilter("all")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      typeFilter === "all"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Tous ({products.length})
                  </button>
                  <button
                    onClick={() => setTypeFilter("service")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      typeFilter === "service"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Services Immatériels ({products.filter((p) => p.type === "service").length})
                  </button>
                  <button
                    onClick={() => setTypeFilter("product")}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                      typeFilter === "product"
                        ? "bg-amber-600 text-white shadow-xs"
                        : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    Matériels en Stock ({products.filter((p) => p.type === "product").length})
                  </button>
                </div>

                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher par référence, libellé..."
                    className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
                  />
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50/70 border-y border-slate-200/80 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-3.5 px-4 font-semibold">SKU / Code</th>
                      <th className="py-3.5 px-4 font-semibold">Désignation</th>
                      <th className="py-3.5 px-4 font-semibold">Type</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Prix Unit. HT</th>
                      <th className="py-3.5 px-4 font-semibold text-center">TVA</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Prix TTC</th>
                      <th className="py-3.5 px-4 font-semibold text-center">Niveau de Stock</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-slate-500">
                          <Package className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                          <p className="font-semibold text-slate-700">Aucun produit ou service trouvé</p>
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((prod) => {
                        const priceTTC = Number((prod.unitPriceHT * (1 + prod.tvaRate / 100)).toFixed(2));
                        const isLowStock = prod.stock !== null && prod.stock <= prod.minStockAlert;

                        return (
                          <tr key={prod.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="py-4 px-4 font-mono font-bold text-slate-800">
                              {prod.sku}
                            </td>

                            <td className="py-4 px-4">
                              <span className="font-bold text-slate-900 block">{prod.name}</span>
                              <span className="text-[11px] text-slate-500 line-clamp-1">
                                {prod.description || `Facturé par ${prod.unit}`}
                              </span>
                            </td>

                            <td className="py-4 px-4 whitespace-nowrap">
                              <span
                                className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                                  prod.type === "service"
                                    ? "bg-blue-50 text-blue-700 border border-blue-200"
                                    : "bg-amber-50 text-amber-700 border border-amber-200"
                                }`}
                              >
                                {prod.type === "service" ? "Service" : "Matériel"}
                              </span>
                            </td>

                            <td className="py-4 px-4 text-right font-mono text-slate-800 whitespace-nowrap">
                              {prod.unitPriceHT.toLocaleString("fr-FR")} MAD
                            </td>

                            <td className="py-4 px-4 text-center font-mono text-slate-600">
                              {prod.tvaRate}%
                            </td>

                            <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 whitespace-nowrap">
                              {priceTTC.toLocaleString("fr-FR")} MAD
                            </td>

                            {/* Stock & Quick Adjust */}
                            <td className="py-4 px-4 text-center whitespace-nowrap">
                              {prod.type === "service" ? (
                                <span className="text-slate-400 text-[11px]">— Illimité —</span>
                              ) : (
                                <div className="inline-flex items-center gap-2">
                                  <span
                                    className={`font-mono font-bold text-xs px-2 py-0.5 rounded-lg border ${
                                      isLowStock
                                        ? "bg-red-50 text-red-700 border-red-200"
                                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                                    }`}
                                  >
                                    {prod.stock} unités
                                  </span>

                                  {/* Quick +/- buttons */}
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      onClick={() => adjustStock(prod.id, -1)}
                                      title="Diminuer stock (-1)"
                                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                                    >
                                      -
                                    </button>
                                    <button
                                      onClick={() => adjustStock(prod.id, 1)}
                                      title="Augmenter stock (+1)"
                                      className="w-5 h-5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center cursor-pointer"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Actions */}
                            <td className="py-4 px-4 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    setEditingProduct(prod);
                                    setProductModalOpen(true);
                                  }}
                                  title="Modifier"
                                  className="p-1.5 rounded-lg text-slate-400 hover:text-amber-600 hover:bg-amber-50 cursor-pointer"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => {
                                    setProductToDelete(prod);
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

      <ProductModal
        isOpen={productModalOpen}
        onClose={() => {
          setProductModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
      />

      <ConfirmModal
        isOpen={deleteConfirmOpen}
        title="Supprimer l'Article"
        message={`Confirmez-vous la suppression de l'article "${productToDelete?.name}" (${productToDelete?.sku}) ?`}
        confirmLabel="Supprimer"
        onConfirm={() => {
          if (productToDelete) {
            deleteProduct(productToDelete.id);
            setDeleteConfirmOpen(false);
            setProductToDelete(null);
          }
        }}
        onCancel={() => {
          setDeleteConfirmOpen(false);
          setProductToDelete(null);
        }}
      />
    </div>
  );
}
