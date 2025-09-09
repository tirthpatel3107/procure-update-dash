import { createContext, useContext, useState, ReactNode } from 'react';
import { Product, CartItem, Order, StockUpdate } from '@/types';
import { mockProducts, mockOrders } from '@/data/mockData';

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
  name: "John Doe",
  email: "john.doe@storepro.com",
  avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
  role: "Store Manager"
};

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [stockUpdates, setStockUpdates] = useState<StockUpdate[]>([]);
  const [currentUser] = useState<User>(defaultUser);

  const updateProductStock = (productId: string, newStock: number) => {
    setProducts(prev => 
      prev.map(product => 
        product.id === productId 
          ? { ...product, stock: newStock }
          : product
      )
    );
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [order, ...prev]);
  };

  const addStockUpdate = (update: StockUpdate) => {
    setStockUpdates(prev => [update, ...prev]);
  };

  return (
    <AppContext.Provider value={{
      products,
      orders,
      stockUpdates,
      currentUser,
      updateProductStock,
      addOrder,
      addStockUpdate
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}