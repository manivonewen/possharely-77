
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
  status: 'completed' | 'refunded' | 'voided';
  createdAt: Date;
  customerInfo?: CustomerInfo;
}

export interface CustomerInfo {
  name?: string;
  email?: string;
  phone?: string;
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
