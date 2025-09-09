import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product, CartItem } from "@/types";
import { toast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product;
  onAddToCart: (item: CartItem) => void;
}

export default function ProductCard({
  product,
  onAddToCart,
}: ProductCardProps) {
  const [quantity, setQuantity] = useState(1);

  console.log(`ProductCard: ${product.name} stock is ${product.stock}`);

  const handleAddToCart = () => {
    if (quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive",
      });
      return;
    }

    onAddToCart({ product, quantity });
    toast({
      title: "Added to Cart",
      description: `${quantity}x ${product.name}`,
    });
    setQuantity(1);
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <Card className="group overflow-hidden bg-gradient-card border-0 shadow-soft hover:shadow-medium transition-all duration-300 hover:-translate-y-1">
      {/* Product Image */}
      <div className="aspect-video bg-muted overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      {/* Product Info */}
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg leading-tight">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-sm text-muted-foreground line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <Badge
            variant={product.stock < 10 ? "destructive" : "secondary"}
            className="ml-2 shrink-0"
          >
            {product.stock} left
          </Badge>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </span>
        </div>

        {/* Quantity Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={incrementQuantity}
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Button
            variant="cart"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 ml-4"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>

        {product.stock === 0 && (
          <Badge variant="destructive" className="w-full justify-center">
            Out of Stock
          </Badge>
        )}
      </div>
    </Card>
  );
}
