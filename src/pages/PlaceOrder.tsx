import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { CartItem } from "@/types";
import { useAppContext } from "@/context/AppContext";

export default function PlaceOrder() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { products } = useAppContext();

  const addToCart = (newItem: CartItem) => {
    setCartItems((prev) => {
      const existingItem = prev.find(
        (item) => item.product.id === newItem.product.id,
      );

      if (existingItem) {
        return prev.map((item) =>
          item.product.id === newItem.product.id
            ? {
                ...item,
                quantity: Math.min(
                  item.quantity + newItem.quantity,
                  item.product.stock,
                ),
              }
            : item,
        );
      }

      return [...prev, newItem];
    });
  };

  const removeFromCart = (productId: string) => {
    setCartItems((prev) =>
      prev.filter((item) => item.product.id !== productId),
    );
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Sync cart items with current product stock
  useEffect(() => {
    setCartItems((prev) =>
      prev
        .map((cartItem) => {
          const currentProduct = products.find(
            (p) => p.id === cartItem.product.id,
          );
          if (currentProduct) {
            return {
              ...cartItem,
              product: currentProduct,
              quantity: Math.min(cartItem.quantity, currentProduct.stock),
            };
          }
          return cartItem;
        })
        .filter((cartItem) => {
          const currentProduct = products.find(
            (p) => p.id === cartItem.product.id,
          );
          return currentProduct && currentProduct.stock > 0;
        }),
    );
  }, [products]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <ShoppingBag className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Place Your Order</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our premium collection of tech products and add them to your
            cart for a seamless shopping experience.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Products Grid */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Featured Products</h2>
              <p className="text-muted-foreground">
                Discover our latest tech essentials with competitive pricing
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Stock levels are updated in real-time from inventory management
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={addToCart}
                />
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Cart
                items={cartItems}
                onRemoveItem={removeFromCart}
                onUpdateQuantity={updateQuantity}
                onClearCart={clearCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
