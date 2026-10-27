"use client";

import React, { useState, useEffect } from "react";
import { X, Users, AlertCircle } from "lucide-react";
import { useBusiness } from "@/context/BusinessContext";
import { Customer } from "@/types/business";

interface CustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCustomer?: Customer | null;
}

export default function CustomerModal({
  isOpen,
  onClose,
  initialCustomer,
}: CustomerModalProps) {
  const { addCustomer, updateCustomer } = useBusiness();

  const [name, setName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [ice, setIce] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("Casablanca");
  const [category, setCategory] = useState<Customer["category"]>("PME");
  const [notes, setNotes] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (initialCustomer) {
      setName(initialCustomer.name);
      setContactPerson(initialCustomer.contactPerson);
      setEmail(initialCustomer.email);
      setPhone(initialCustomer.phone);
      setIce(initialCustomer.ice);
      setAddress(initialCustomer.address);
      setCity(initialCustomer.city);
      setCategory(initialCustomer.category);
      setNotes(initialCustomer.notes || "");
    } else {
      setName("");
      setContactPerson("");
      setEmail("");
      setPhone("");
      setIce("");
      setAddress("");
      setCity("Casablanca");
      setCategory("PME");
      setNotes("");
    }
    setErrorMsg("");
  }, [isOpen, initialCustomer]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg("La raison sociale ou nom du client est requis.");
      return;
    }

    if (initialCustomer) {
      updateCustomer(initialCustomer.id, {
        name,
        contactPerson,
        email,
        phone,
        ice,
        address,
        city,
        category,
        notes,
      });
    } else {
      addCustomer({
        name,
        contactPerson,
        email,
        phone,
        ice,
        address,
        city,
        category,
        notes,
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                {initialCustomer ? "Modifier la Fiche Client" : "Nouveau Client & Contact"}
              </h2>
              <p className="text-xs text-slate-500">Répertoire des comptes et débiteurs (Démo)</p>
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
              Raison Sociale / Nom Entreprise *
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Atlas Logistique SARL"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Interlocuteur Principal
              </label>
              <input
                type="text"
                placeholder="Ex: Mohamed Kabbaj"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                ICE (15 chiffres fictifs)
              </label>
              <input
                type="text"
                placeholder="002847192000045"
                value={ice}
                onChange={(e) => setIce(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs font-mono focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Email Professionnel
              </label>
              <input
                type="email"
                placeholder="contact@client.ma"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Téléphone
              </label>
              <input
                type="text"
                placeholder="06 XX XX XX XX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Adresse
              </label>
              <input
                type="text"
                placeholder="Boulevard, Immeuble..."
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Ville
              </label>
              <input
                type="text"
                placeholder="Casablanca"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Catégorie Client
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Customer["category"])}
              className="w-full px-3 py-2 rounded-xl bg-[#F8FAFC] border border-slate-200 text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
            >
              <option value="PME">PME / Société</option>
              <option value="Grand Compte">Grand Compte / Holding</option>
              <option value="Indépendant">Indépendant / Auto-entrepreneur</option>
              <option value="Administration">Administration / Établissement Public</option>
            </select>
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
              Enregistrer le Client
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
