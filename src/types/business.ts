export interface CompanySettings {
  companyName: string;
  ice: string; // Identifiant Commun de l'Entreprise (15 chiffres fictifs)
  ifNum: string; // Identifiant Fiscal
  rc: string; // Registre du Commerce
  cnss: string;
  patentNumber: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  rib: string; // Relevé d'Identité Bancaire (24 chiffres fictifs)
  bankName: string;
  currency: string;
  defaultTva: number; // e.g. 20
  legalNotice: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  ice: string;
  address: string;
  city: string;
  category: "PME" | "Grand Compte" | "Indépendant" | "Administration";
  createdAt: string;
  notes?: string;
}

export interface Product {
  id: string;
  name: string;
  type: "service" | "product";
  sku: string;
  unitPriceHT: number;
  tvaRate: number; // 20, 14, 10, 7, 0
  stock: number | null; // null for services
  minStockAlert: number;
  unit: string; // "unité", "jour/homme", "heure", "mois", "forfait"
  description: string;
}

export interface InvoiceItemLine {
  id: string;
  productId?: string;
  description: string;
  quantity: number;
  unitPriceHT: number;
  tvaRate: number;
  totalHT: number; // quantity * unitPriceHT
  totalTVA: number; // totalHT * (tvaRate / 100)
  totalTTC: number; // totalHT + totalTVA
}

export type InvoiceStatus = "paid" | "pending" | "overdue" | "draft" | "canceled";

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g., "FAC-2026-0042"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerICE: string;
  customerAddress: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  status: InvoiceStatus;
  items: InvoiceItemLine[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  paidAmount: number;
  remainingAmount: number;
  paymentMethod?: string;
  notes: string;
  convertedFromQuoteId?: string;
  createdAt: string;
}

export type QuoteStatus = "draft" | "sent" | "accepted" | "rejected" | "converted";

export interface Quote {
  id: string;
  quoteNumber: string; // e.g., "DEV-2026-0089"
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerICE: string;
  customerAddress: string;
  issueDate: string;
  validUntil: string;
  status: QuoteStatus;
  items: InvoiceItemLine[];
  subtotalHT: number;
  totalTVA: number;
  totalTTC: number;
  notes: string;
  convertedInvoiceId?: string;
  createdAt: string;
}

export interface Payment {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  customerName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: "virement" | "cheque" | "especes" | "carte";
  reference: string;
  notes?: string;
  createdAt: string;
}

export interface DashboardMetrics {
  totalReceivables: number; // Somme des impayés (pending + overdue)
  paidReceivables: number; // Somme des factures payées
  unpaidReceivables: number; // Somme des factures en attente non échues
  overdueReceivables: number; // Somme des factures en retard
  totalInvoicedTTC: number;
  totalInvoicedHT: number;
  totalTvaCollected: number;
  invoicesCount: {
    total: number;
    paid: number;
    pending: number;
    overdue: number;
    draft: number;
    canceled: number;
  };
  quotesCount: {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    converted: number;
  };
  lowStockProductsCount: number;
  totalCustomers: number;
}
