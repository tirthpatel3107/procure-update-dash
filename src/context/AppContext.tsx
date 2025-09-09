import { createContext, useContext, useState, ReactNode } from "react";
import { Product, CartItem, Order, StockUpdate } from "@/types";
import { mockProducts, mockOrders } from "@/data/mockData";

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

interface AppContextType {
  products: Product[];
  orders: Order[];
  stockUpdates: StockUpdate[];
  currentUser: User;
  updateProductStock: (productId: string, newStock: number) => void;
  addOrder: (order: Order) => void;
  addStockUpdate: (update: StockUpdate) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultUser: User = {
  id: "user-1",
  name: "Vimarsh C",
  email: "vimarsh.ead@gmail.com",
  avatar: null,
  role: "Store Manager",
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  const [currentUser] = useState<User>(defaultUser);

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts((prev) => {
      const updated = prev.map((product) =>
        product.id === productId ? { ...product, stock: newStock } : product
      );

      const updatedProduct = updated.find((p) => p.id === productId);
      console.log(
        `Context: Updated ${updatedProduct?.name} stock to ${newStock}`
      );
      return updated;
    });
  };

  const addOrder = (order: Order) => {
    setOrders((prev) => [order, ...prev]);
  };

  const addStockUpdate = (update: StockUpdate) => {
    setStockUpdates((prev) => [update, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        products,
        orders,
        stockUpdates,
        currentUser,
        updateProductStock,
        addOrder,
        addStockUpdate,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
}
