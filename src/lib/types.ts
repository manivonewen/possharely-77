export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  inStock: number;
  sku?: string;
  barcode?: string;
  costPrice?: number;
  taxRate?: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
  discount?: number;
  notes?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'other';
  status: 'completed' | 'refunded' | 'voided' | 'archived';
  createdAt: Date;
  customerInfo?: CustomerInfo;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
  id?: string;
}

export interface Category {
  id: string;
  name: string;
  color?: string;
}

export interface DailySales {
  date: string;
  total: number;
  orders: number;
}

export interface User {
  id: string;
  name: string;
  role: 'admin' | 'cashier' | 'manager';
  photoUrl?: string;
  telegramId?: string;
}

export interface SalesSummary {
  totalSales: number;
  totalOrders: number;
  averageOrder: number;
  topProducts: {
    product: string;
    quantity: number;
    revenue: number;
  }[];
  periodComparison: {
    current: number;
    previous: number;
    percentageChange: number;
  };
}

export interface InventoryItem extends Product {
  supplier?: string;
  reorderPoint?: number;
  lastRestocked?: Date;
}

export interface Contact {
  id: string;
  name: string;
  category: string;
}

export interface SavedCart {
  id: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled' | 'new order' | 'processing' | 'completed';
  createdAt: Date;
  customerInfo?: CustomerInfo;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'income' | 'expense';
  contactId?: string;
  contactName?: string;
  description?: string;
  date: Date;
}

export interface StoreSettings {
  profile: {
    name: string;
    storeName: string;
    telephone?: string;
    logo?: string;
  };
  pos: {
    language: 'en' | 'fr' | 'es';
    enableTax: boolean;
    enableDiscount: boolean;
    currency: string;
    currencyRate: number;
    enableDelivery: boolean;
    deliveryFee: number;
    showRiel: boolean;
  };
  interface: {
    advanced: boolean;
    showInventory: boolean;
    showTransactions: boolean;
    showSales: boolean;
    showSettings: boolean;
    primaryColor: 'blue' | 'green' | 'purple' | 'red' | 'orange' | 'teal';
  };
  integrations: {
    telegram: boolean;
    loyverse: boolean;
    googleSheets: boolean;
    api: boolean;
  };
  documentLayout: {
    showHeader: boolean;
    showFooter: boolean;
    showLogo: boolean;
    showTaxDetails: boolean;
    customMessage?: string;
  };
}

export interface PosSettings {
  language: string;
  enableTax: boolean;
  enableDiscount: boolean;
  currency: string;
  currencyRate: number;
  enableDelivery: boolean;
  deliveryFee: number;
  showRiel: boolean;
}
