import { useState } from "react";
import { X, ShoppingBag, Trash2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { CartItem } from "@/types";
import CheckoutModal from "./CheckoutModal";

interface CartProps {
  items: CartItem[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onClearCart: () => void;
}

export default function Cart({ items, onRemoveItem, onUpdateQuantity, onClearCart }: CartProps) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleQuantityChange = (productId: string, change: number) => {
    const item = items.find(i => i.product.id === productId);
    if (item) {
      const newQuantity = Math.max(1, Math.min(item.quantity + change, item.product.stock));
      onUpdateQuantity(productId, newQuantity);
    }
  };

  if (items.length === 0) {
    return (
      <Card className="p-8 text-center bg-gradient-card shadow-soft">
        <ShoppingBag className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
        <p className="text-muted-foreground">Add some products to get started!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-card shadow-soft border-0">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShoppingBag className="h-5 w-5" />
              Shopping Cart
            </h2>
            <Badge variant="secondary">{items.length} items</Badge>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.map((item) => (
              <div key={item.product.id} className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 p-4 bg-background rounded-lg border">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-16 w-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0 w-full sm:w-auto">
                  <h4 className="font-medium truncate">{item.product.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    ${item.product.price.toFixed(2)} each
                  </p>
                </div>
                
                <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.product.id, -1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(item.product.id, 1)}
                      disabled={item.quantity >= item.product.stock}
                    >
                      +
                    </Button>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="text-right">
                      <p className="font-semibold">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tax (10%):</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span>Total:</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>

          <div className="flex space-x-3 mt-6">
            <Button
              variant="outline"
              onClick={onClearCart}
              className="flex-1"
            >
              Clear Cart
            </Button>
            <Button
              variant="cart"
              onClick={() => setIsCheckoutOpen(true)}
              className="flex-1"
            >
              <CreditCard className="h-4 w-4" />
              Checkout
            </Button>
          </div>
        </div>
      </Card>

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={items}
        total={total}
        onConfirm={onClearCart}
      />
    </div>
  );
}