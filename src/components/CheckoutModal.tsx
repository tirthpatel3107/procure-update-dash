import { useState } from "react";
import { CreditCard, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CartItem, PaymentInfo } from "@/types";
import { toast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onConfirm: () => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  items, 
  total, 
  onConfirm 
}: CheckoutModalProps) {
  const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>({
    cardholderName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleInputChange = (field: keyof PaymentInfo, value: string) => {
    setPaymentInfo(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { cardholderName, cardNumber, expiryDate, cvv } = paymentInfo;
    
    if (!cardholderName.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter cardholder name",
        variant: "destructive"
      });
      return false;
    }
    
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      toast({
        title: "Invalid Input", 
        description: "Please enter a valid 16-digit card number",
        variant: "destructive"
      });
      return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      toast({
        title: "Invalid Input",
        description: "Please enter expiry date in MM/YY format",
        variant: "destructive"
      });
      return false;
    }
    
    if (cvv.length !== 3) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid 3-digit CVV",
        variant: "destructive"
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setShowConfirmation(true);
  };

  const handleConfirmOrder = async () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsProcessing(false);
    setShowConfirmation(false);
    onConfirm();
    onClose();
    
    toast({
      title: "Order Placed Successfully!",
      description: "You will receive a confirmation email shortly.",
    });
    
    // Reset form
    setPaymentInfo({
      cardholderName: "",
      cardNumber: "",
      expiryDate: "",
      cvv: ""
    });
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return v;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {showConfirmation ? "Confirm Order" : "Checkout"}
          </DialogTitle>
        </DialogHeader>

        {!showConfirmation ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="space-y-3">
              <h3 className="font-semibold">Order Summary</h3>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Form */}
            <div className="space-y-4">
              <h3 className="font-semibold">Payment Details</h3>
              
              <div className="space-y-2">
                <Label htmlFor="cardholderName">Cardholder Name</Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={paymentInfo.cardholderName}
                  onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={paymentInfo.cardNumber}
                  onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                  maxLength={19}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={paymentInfo.expiryDate}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.length >= 2) {
                        value = value.substring(0, 2) + "/" + value.substring(2, 4);
                      }
                      handleInputChange("expiryDate", value);
                    }}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input
                    id="cvv"
                    placeholder="123"
                    value={paymentInfo.cvv}
                    onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, ""))}
                    maxLength={3}
                  />
                </div>
              </div>
            </div>

            <Button 
              onClick={handleSubmit}
              className="w-full"
              variant="cart"
            >
              Review Order
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <CheckCircle className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Confirm Your Order</h3>
              <p className="text-muted-foreground">
                Please review your order details before confirming payment.
              </p>
            </div>

            {/* Final Order Summary */}
            <div className="bg-muted p-4 rounded-lg space-y-3">
              <div className="space-y-2">
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-sm">
                    <span>{item.quantity}x {item.product.name}</span>
                    <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Payment: **** {paymentInfo.cardNumber.slice(-4)}
              </div>
            </div>

            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                onClick={() => setShowConfirmation(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Back
              </Button>
              <Button 
                onClick={handleConfirmOrder}
                className="flex-1"
                variant="success"
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Confirm & Pay"}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}