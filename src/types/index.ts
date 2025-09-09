export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
  description?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  date: string;
  paymentMethod: string;
  customerName?: string;
  customerEmail?: string;
}

export interface StockUpdate {
  id: string;
  productId: string;
  productName: string;
  currentBalance: number;
  updateQuantity: number;
  newBalance: number;
  reason: "loadout" | "return" | "damage" | "adjustment" | "closing-balance";
  date: string;
  shift: string;
  updatedBy?: string;
  updatedAt?: string;
}

export interface PaymentInfo {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}
