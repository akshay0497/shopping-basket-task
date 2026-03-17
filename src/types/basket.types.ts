export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface BasketItem extends Product {
  quantity: number;
}

export interface BasketState {
  items: BasketItem[];
  loading: boolean;
  error: string | null;
}

export interface Order {
  items: BasketItem[];
  subtotal: number;
  savings: number;
  total: number;
  createdAt?: Date;
}

export interface Totals {
  subtotal: number;
  savings: number;
  total: number;
  offerBreakdown: string[];
}