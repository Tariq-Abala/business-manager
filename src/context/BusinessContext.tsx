"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import {
  CompanySettings,
  Customer,
  Product,
  Invoice,
  Quote,
  Payment,
  DashboardMetrics,
  InvoiceItemLine,
} from "@/types/business";
import {
  INITIAL_COMPANY_SETTINGS,
  INITIAL_CUSTOMERS,
  INITIAL_PRODUCTS,
  INITIAL_INVOICES,
  INITIAL_QUOTES,
  INITIAL_PAYMENTS,
} from "@/data/mockData";

interface BusinessContextType {
  isHydrated: boolean;
  companySettings: CompanySettings;
  customers: Customer[];
  products: Product[];
  invoices: Invoice[];
  quotes: Quote[];
  payments: Payment[];
  metrics: DashboardMetrics;

  // Invoices Actions
  addInvoice: (invoice: Omit<Invoice, "id" | "createdAt">) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  markInvoicePaid: (id: string, paymentMethod?: string, reference?: string) => void;

  // Quotes Actions
  addQuote: (quote: Omit<Quote, "id" | "createdAt">) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice | null;

  // Customers Actions
  addCustomer: (customer: Omit<Customer, "id" | "createdAt">) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;

  // Products Actions
  addProduct: (product: Omit<Product, "id">) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  adjustStock: (productId: string, quantityDelta: number) => void;

  // Payments Actions
  addPayment: (payment: Omit<Payment, "id" | "createdAt">) => Payment;
  deletePayment: (id: string) => void;

  // Settings & Reset
  updateSettings: (settings: Partial<CompanySettings>) => void;
  resetToDemoData: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SETTINGS: "bm_demo_settings_v1",
  CUSTOMERS: "bm_demo_customers_v1",
  PRODUCTS: "bm_demo_products_v1",
  INVOICES: "bm_demo_invoices_v1",
  QUOTES: "bm_demo_quotes_v1",
  PAYMENTS: "bm_demo_payments_v1",
};

export const BusinessProvider = ({ children }: { children: ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [companySettings, setCompanySettings] = useState<CompanySettings>(INITIAL_COMPANY_SETTINGS);
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [invoices, setInvoices] = useState<Invoice[]>(INITIAL_INVOICES);
  const [quotes, setQuotes] = useState<Quote[]>(INITIAL_QUOTES);
  const [payments, setPayments] = useState<Payment[]>(INITIAL_PAYMENTS);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) setCompanySettings(JSON.parse(savedSettings));

      const savedCustomers = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
      if (savedCustomers) setCustomers(JSON.parse(savedCustomers));

      const savedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
      if (savedProducts) setProducts(JSON.parse(savedProducts));

      const savedInvoices = localStorage.getItem(STORAGE_KEYS.INVOICES);
      if (savedInvoices) setInvoices(JSON.parse(savedInvoices));

      const savedQuotes = localStorage.getItem(STORAGE_KEYS.QUOTES);
      if (savedQuotes) setQuotes(JSON.parse(savedQuotes));

      const savedPayments = localStorage.getItem(STORAGE_KEYS.PAYMENTS);
      if (savedPayments) setPayments(JSON.parse(savedPayments));
    } catch (err) {
      console.warn("Could not load from localStorage, falling back to initial data", err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save to LocalStorage helper
  const persist = (key: string, data: unknown) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error("Storage save error", e);
    }
  };

  // Compute metrics dynamically from the live data
  const metrics: DashboardMetrics = useMemo(() => {
    let totalReceivables = 0; // pending + overdue
    let paidReceivables = 0;
    let unpaidReceivables = 0;
    let overdueReceivables = 0;
    let totalInvoicedTTC = 0;
    let totalInvoicedHT = 0;
    let totalTvaCollected = 0;

    const invoicesCount = {
      total: invoices.length,
      paid: 0,
      pending: 0,
      overdue: 0,
      draft: 0,
      canceled: 0,
    };

    invoices.forEach((inv) => {
      totalInvoicedTTC += inv.totalTTC;
      totalInvoicedHT += inv.subtotalHT;
      totalTvaCollected += inv.totalTVA;

      invoicesCount[inv.status] = (invoicesCount[inv.status] || 0) + 1;

      if (inv.status === "paid") {
        paidReceivables += inv.totalTTC;
      } else if (inv.status === "pending") {
        unpaidReceivables += inv.remainingAmount;
        totalReceivables += inv.remainingAmount;
      } else if (inv.status === "overdue") {
        overdueReceivables += inv.remainingAmount;
        totalReceivables += inv.remainingAmount;
      }
    });

    const quotesCount = {
      total: quotes.length,
      draft: 0,
      sent: 0,
      accepted: 0,
      rejected: 0,
      converted: 0,
    };

    quotes.forEach((q) => {
      quotesCount[q.status] = (quotesCount[q.status] || 0) + 1;
    });

    const lowStockProductsCount = products.filter(
      (p) => p.stock !== null && p.stock <= p.minStockAlert
    ).length;

    return {
      totalReceivables,
      paidReceivables,
      unpaidReceivables,
      overdueReceivables,
      totalInvoicedTTC,
      totalInvoicedHT,
      totalTvaCollected,
      invoicesCount,
      quotesCount,
      lowStockProductsCount,
      totalCustomers: customers.length,
    };
  }, [invoices, quotes, products, customers]);

  // Recalculate invoice totals from items
  const recalculateItems = (items: InvoiceItemLine[]) => {
    const updatedItems = items.map((item) => {
      const totalHT = Number((item.quantity * item.unitPriceHT).toFixed(2));
      const totalTVA = Number((totalHT * (item.tvaRate / 100)).toFixed(2));
      const totalTTC = Number((totalHT + totalTVA).toFixed(2));
      return { ...item, totalHT, totalTVA, totalTTC };
    });

    const subtotalHT = Number(
      updatedItems.reduce((acc, curr) => acc + curr.totalHT, 0).toFixed(2)
    );
    const totalTVA = Number(
      updatedItems.reduce((acc, curr) => acc + curr.totalTVA, 0).toFixed(2)
    );
    const totalTTC = Number((subtotalHT + totalTVA).toFixed(2));

    return { items: updatedItems, subtotalHT, totalTVA, totalTTC };
  };

  // 1. Invoices
  const addInvoice = (invoiceData: Omit<Invoice, "id" | "createdAt">): Invoice => {
    const { items, subtotalHT, totalTVA, totalTTC } = recalculateItems(invoiceData.items);
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      items,
      subtotalHT,
      totalTVA,
      totalTTC,
      paidAmount: invoiceData.status === "paid" ? totalTTC : invoiceData.paidAmount || 0,
      remainingAmount: invoiceData.status === "paid" ? 0 : totalTTC - (invoiceData.paidAmount || 0),
      createdAt: new Date().toISOString(),
    };

    // Decrease stock for physical products
    items.forEach((item) => {
      if (item.productId) {
        adjustStock(item.productId, -item.quantity);
      }
    });

    const nextInvoices = [newInvoice, ...invoices];
    setInvoices(nextInvoices);
    persist(STORAGE_KEYS.INVOICES, nextInvoices);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const nextInvoices = invoices.map((inv) => {
      if (inv.id !== id) return inv;
      let items = updates.items || inv.items;
      let subtotalHT = inv.subtotalHT;
      let totalTVA = inv.totalTVA;
      let totalTTC = inv.totalTTC;

      if (updates.items) {
        const recalc = recalculateItems(updates.items);
        items = recalc.items;
        subtotalHT = recalc.subtotalHT;
        totalTVA = recalc.totalTVA;
        totalTTC = recalc.totalTTC;
      }

      const status = updates.status || inv.status;
      const paidAmount =
        status === "paid"
          ? totalTTC
          : updates.paidAmount !== undefined
          ? updates.paidAmount
          : inv.paidAmount;
      const remainingAmount = totalTTC - paidAmount;

      return {
        ...inv,
        ...updates,
        items,
        subtotalHT,
        totalTVA,
        totalTTC,
        status,
        paidAmount,
        remainingAmount: remainingAmount < 0 ? 0 : remainingAmount,
      };
    });

    setInvoices(nextInvoices);
    persist(STORAGE_KEYS.INVOICES, nextInvoices);
  };

  const deleteInvoice = (id: string) => {
    const nextInvoices = invoices.filter((i) => i.id !== id);
    setInvoices(nextInvoices);
    persist(STORAGE_KEYS.INVOICES, nextInvoices);

    // Also remove associated payments
    const nextPayments = payments.filter((p) => p.invoiceId !== id);
    setPayments(nextPayments);
    persist(STORAGE_KEYS.PAYMENTS, nextPayments);
  };

  const markInvoicePaid = (id: string, paymentMethod = "Virement bancaire", reference = `REG-${Date.now().toString().slice(-6)}`) => {
    const target = invoices.find((i) => i.id === id);
    if (!target) return;

    const remaining = target.remainingAmount;
    if (remaining > 0) {
      addPayment({
        invoiceId: target.id,
        invoiceNumber: target.invoiceNumber,
        customerName: target.customerName,
        amount: remaining,
        paymentDate: new Date().toISOString().split("T")[0],
        paymentMethod: paymentMethod.toLowerCase().includes("chèque") ? "cheque" : "virement",
        reference,
        notes: "Règlement complet enregistré depuis la liste des factures.",
      });
    }

    updateInvoice(id, {
      status: "paid",
      paidAmount: target.totalTTC,
      remainingAmount: 0,
      paymentMethod,
    });
  };

  // 2. Quotes
  const addQuote = (quoteData: Omit<Quote, "id" | "createdAt">): Quote => {
    const { items, subtotalHT, totalTVA, totalTTC } = recalculateItems(quoteData.items);
    const newQuote: Quote = {
      ...quoteData,
      id: `quote-${Date.now()}`,
      items,
      subtotalHT,
      totalTVA,
      totalTTC,
      createdAt: new Date().toISOString(),
    };

    const nextQuotes = [newQuote, ...quotes];
    setQuotes(nextQuotes);
    persist(STORAGE_KEYS.QUOTES, nextQuotes);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    const nextQuotes = quotes.map((q) => {
      if (q.id !== id) return q;
      let items = updates.items || q.items;
      let subtotalHT = q.subtotalHT;
      let totalTVA = q.totalTVA;
      let totalTTC = q.totalTTC;

      if (updates.items) {
        const recalc = recalculateItems(updates.items);
        items = recalc.items;
        subtotalHT = recalc.subtotalHT;
        totalTVA = recalc.totalTVA;
        totalTTC = recalc.totalTTC;
      }

      return {
        ...q,
        ...updates,
        items,
        subtotalHT,
        totalTVA,
        totalTTC,
      };
    });

    setQuotes(nextQuotes);
    persist(STORAGE_KEYS.QUOTES, nextQuotes);
  };

  const deleteQuote = (id: string) => {
    const nextQuotes = quotes.filter((q) => q.id !== id);
    setQuotes(nextQuotes);
    persist(STORAGE_KEYS.QUOTES, nextQuotes);
  };

  const convertQuoteToInvoice = (quoteId: string): Invoice | null => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) return null;

    // Generate consecutive invoice number
    const nextNum = invoices.length + 311;
    const invoiceNumber = `FAC-2026-0${nextNum}`;

    const todayStr = new Date().toISOString().split("T")[0];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);
    const dueDateStr = dueDate.toISOString().split("T")[0];

    const newInvoice = addInvoice({
      invoiceNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      customerEmail: quote.customerEmail,
      customerPhone: quote.customerPhone,
      customerICE: quote.customerICE,
      customerAddress: quote.customerAddress,
      issueDate: todayStr,
      dueDate: dueDateStr,
      status: "pending",
      items: quote.items,
      subtotalHT: quote.subtotalHT,
      totalTVA: quote.totalTVA,
      totalTTC: quote.totalTTC,
      paidAmount: 0,
      remainingAmount: quote.totalTTC,
      notes: `Facture émise suite à l'acceptation du devis n° ${quote.quoteNumber}.`,
      convertedFromQuoteId: quote.id,
    });

    // Mark quote as converted
    updateQuote(quoteId, {
      status: "converted",
      convertedInvoiceId: newInvoice.id,
    });

    return newInvoice;
  };

  // 3. Customers
  const addCustomer = (customerData: Omit<Customer, "id" | "createdAt">): Customer => {
    const newCustomer: Customer = {
      ...customerData,
      id: `cust-${Date.now()}`,
      createdAt: new Date().toISOString().split("T")[0],
    };
    const next = [newCustomer, ...customers];
    setCustomers(next);
    persist(STORAGE_KEYS.CUSTOMERS, next);
    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    const next = customers.map((c) => (c.id === id ? { ...c, ...updates } : c));
    setCustomers(next);
    persist(STORAGE_KEYS.CUSTOMERS, next);
  };

  const deleteCustomer = (id: string) => {
    const next = customers.filter((c) => c.id !== id);
    setCustomers(next);
    persist(STORAGE_KEYS.CUSTOMERS, next);
  };

  // 4. Products
  const addProduct = (productData: Omit<Product, "id">): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
    };
    const next = [newProduct, ...products];
    setProducts(next);
    persist(STORAGE_KEYS.PRODUCTS, next);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const next = products.map((p) => (p.id === id ? { ...p, ...updates } : p));
    setProducts(next);
    persist(STORAGE_KEYS.PRODUCTS, next);
  };

  const deleteProduct = (id: string) => {
    const next = products.filter((p) => p.id !== id);
    setProducts(next);
    persist(STORAGE_KEYS.PRODUCTS, next);
  };

  const adjustStock = (productId: string, delta: number) => {
    setProducts((prev) => {
      const next = prev.map((p) => {
        if (p.id === productId && p.stock !== null) {
          const updatedStock = Math.max(0, p.stock + delta);
          return { ...p, stock: updatedStock };
        }
        return p;
      });
      persist(STORAGE_KEYS.PRODUCTS, next);
      return next;
    });
  };

  // 5. Payments
  const addPayment = (paymentData: Omit<Payment, "id" | "createdAt">): Payment => {
    const newPayment: Payment = {
      ...paymentData,
      id: `pay-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    // Update the invoice's paid and remaining amounts
    setInvoices((prev) => {
      const next = prev.map((inv) => {
        if (inv.id === paymentData.invoiceId) {
          const newPaid = Number((inv.paidAmount + paymentData.amount).toFixed(2));
          const newRemaining = Math.max(0, Number((inv.totalTTC - newPaid).toFixed(2)));
          const newStatus = newRemaining === 0 ? "paid" : inv.status;
          return {
            ...inv,
            paidAmount: newPaid,
            remainingAmount: newRemaining,
            status: newStatus,
          };
        }
        return inv;
      });
      persist(STORAGE_KEYS.INVOICES, next);
      return next;
    });

    const nextPayments = [newPayment, ...payments];
    setPayments(nextPayments);
    persist(STORAGE_KEYS.PAYMENTS, nextPayments);
    return newPayment;
  };

  const deletePayment = (id: string) => {
    const target = payments.find((p) => p.id === id);
    if (target) {
      // Revert payment amount on invoice
      setInvoices((prev) => {
        const next = prev.map((inv) => {
          if (inv.id === target.invoiceId) {
            const newPaid = Math.max(0, Number((inv.paidAmount - target.amount).toFixed(2)));
            const newRemaining = Number((inv.totalTTC - newPaid).toFixed(2));
            const newStatus = newRemaining > 0 ? "pending" : inv.status;
            return {
              ...inv,
              paidAmount: newPaid,
              remainingAmount: newRemaining,
              status: newStatus,
            };
          }
          return inv;
        });
        persist(STORAGE_KEYS.INVOICES, next);
        return next;
      });
    }

    const nextPayments = payments.filter((p) => p.id !== id);
    setPayments(nextPayments);
    persist(STORAGE_KEYS.PAYMENTS, nextPayments);
  };

  // 6. Settings & Reset
  const updateSettings = (updates: Partial<CompanySettings>) => {
    const next = { ...companySettings, ...updates };
    setCompanySettings(next);
    persist(STORAGE_KEYS.SETTINGS, next);
  };

  const resetToDemoData = () => {
    setCompanySettings(INITIAL_COMPANY_SETTINGS);
    setCustomers(INITIAL_CUSTOMERS);
    setProducts(INITIAL_PRODUCTS);
    setInvoices(INITIAL_INVOICES);
    setQuotes(INITIAL_QUOTES);
    setPayments(INITIAL_PAYMENTS);

    localStorage.removeItem(STORAGE_KEYS.SETTINGS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.PRODUCTS);
    localStorage.removeItem(STORAGE_KEYS.INVOICES);
    localStorage.removeItem(STORAGE_KEYS.QUOTES);
    localStorage.removeItem(STORAGE_KEYS.PAYMENTS);
  };

  return (
    <BusinessContext.Provider
      value={{
        isHydrated,
        companySettings,
        customers,
        products,
        invoices,
        quotes,
        payments,
        metrics,
        addInvoice,
        updateInvoice,
        deleteInvoice,
        markInvoicePaid,
        addQuote,
        updateQuote,
        deleteQuote,
        convertQuoteToInvoice,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addProduct,
        updateProduct,
        deleteProduct,
        adjustStock,
        addPayment,
        deletePayment,
        updateSettings,
        resetToDemoData,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = () => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error("useBusiness must be used within a BusinessProvider");
  }
  return context;
};
