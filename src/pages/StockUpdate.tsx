import { useState } from "react";
import { BarChart3, Save, Upload, AlertTriangle, CheckCircle, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { toast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import { StockUpdate as StockUpdateType } from "@/types";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const reasonOptions = [
  { value: "loadout", label: "Loadout" },
  { value: "return", label: "Return" },
  { value: "damage", label: "Damage" },
  { value: "adjustment", label: "Adjustment" },
  { value: "closing-balance", label: "Closing Balance" }
];

export default function StockUpdate() {
  const [selectedProductId, setSelectedProductId] = useState("");
  const [updateQuantity, setUpdateQuantity] = useState("");
  const [reason, setReason] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [shift, setShift] = useState("day");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingUpdate, setPendingUpdate] = useState<StockUpdateType | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { products, currentUser, updateProductStock, addStockUpdate } = useAppContext();
  const selectedProduct = products.find(p => p.id === selectedProductId);
  const currentBalance = selectedProduct?.stock || 0;
  const updateQty = parseInt(updateQuantity) || 0;
  const newBalance = currentBalance + updateQty;

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!selectedProductId) {
      newErrors.product = "Please select a product";
    }

    if (!updateQuantity) {
      newErrors.quantity = "Please enter update quantity";
    } else if (isNaN(parseInt(updateQuantity))) {
      newErrors.quantity = "Please enter a valid number";
    } else if (newBalance < 0) {
      newErrors.quantity = "Update would result in negative stock balance";
    }

    if (!reason) {
      newErrors.reason = "Please select a reason";
    }

    if (!selectedDate) {
      newErrors.date = "Please select a date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors and try again",
        variant: "destructive"
      });
      return;
    }

    const update: StockUpdateType = {
      id: `STK-${Date.now()}`,
      productId: selectedProductId,
      productName: selectedProduct?.name || "",
      currentBalance,
      updateQuantity: updateQty,
      newBalance,
      reason: reason as any,
      date: selectedDate.toISOString().split('T')[0],
      shift,
      updatedBy: currentUser.name,
      updatedAt: new Date().toISOString()
    };

    setPendingUpdate(update);
    setShowConfirmation(true);
  };

  const handleConfirmUpdate = () => {
    if (!pendingUpdate) return;
    
    // Update product stock in global state
    updateProductStock(pendingUpdate.productId, pendingUpdate.newBalance);
    
    // Add stock update record
    addStockUpdate(pendingUpdate);
    
    // Simulate API call
    setTimeout(() => {
      setShowConfirmation(false);
      setPendingUpdate(null);
      
      // Reset form
      setSelectedProductId("");
      setUpdateQuantity("");
      setReason("");
      setSelectedDate(new Date());
      setShift("day");
      setErrors({});

      toast({
        title: "Stock Updated Successfully",
        description: `${selectedProduct?.name} stock updated to ${pendingUpdate.newBalance} units`,
      });
    }, 1500);
  };

  const getCurrentDateTime = () => {
    return new Date().toLocaleString();
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8 max-w-4xl">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <BarChart3 className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Stock Update</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Update inventory levels and track stock movements with detailed logging and validation.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 bg-gradient-card shadow-soft border-0">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Update Stock</h2>
                  <Badge variant="secondary">{getCurrentDateTime()}</Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Selection */}
                  <div className="md:col-span-2 space-y-2">
                    <Label htmlFor="product">Product *</Label>
                    <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                      <SelectTrigger className={errors.product ? "border-destructive" : ""}>
                        <SelectValue placeholder="Search and select a product..." />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            <div className="flex items-center justify-between w-full">
                              <span>{product.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {product.stock} in stock
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.product && (
                      <p className="text-sm text-destructive">{errors.product}</p>
                    )}
                  </div>

                  {/* Current Balance */}
                  <div className="space-y-2">
                    <Label>Current Balance</Label>
                    <Input
                      value={currentBalance.toString()}
                      disabled
                      className="bg-muted"
                    />
                  </div>

                  {/* Update Quantity */}
                  <div className="space-y-2">
                    <Label htmlFor="updateQuantity">Update Quantity *</Label>
                    <Input
                      id="updateQuantity"
                      type="number"
                      placeholder="Enter +/- quantity"
                      value={updateQuantity}
                      onChange={(e) => setUpdateQuantity(e.target.value)}
                      className={errors.quantity ? "border-destructive" : ""}
                    />
                    {errors.quantity && (
                      <p className="text-sm text-destructive">{errors.quantity}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Use positive numbers to add stock, negative to reduce
                    </p>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason/Category *</Label>
                    <Select value={reason} onValueChange={setReason}>
                      <SelectTrigger className={errors.reason ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select a reason..." />
                      </SelectTrigger>
                      <SelectContent>
                        {reasonOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.reason && (
                      <p className="text-sm text-destructive">{errors.reason}</p>
                    )}
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">Date *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !selectedDate && "text-muted-foreground",
                            errors.date ? "border-destructive" : ""
                          )}
                        >
                          {selectedDate ? format(selectedDate, "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={(date) => date && setSelectedDate(date)}
                          initialFocus
                          className={cn("p-3 pointer-events-auto")}
                        />
                      </PopoverContent>
                    </Popover>
                    {errors.date && (
                      <p className="text-sm text-destructive">{errors.date}</p>
                    )}
                  </div>

                  {/* Shift */}
                  <div className="space-y-2">
                    <Label htmlFor="shift">Shift</Label>
                    <Select value={shift} onValueChange={setShift}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="day">Day Shift</SelectItem>
                        <SelectItem value="night">Night Shift</SelectItem>
                        <SelectItem value="weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    onClick={handleSubmit}
                    variant="default"
                    className="flex-1"
                    disabled={!selectedProductId || !updateQuantity || !reason}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Update Stock
                  </Button>
                </div>
              </div>
            </Card>

            {/* Bulk Upload Section */}
            <Card className="p-6 mt-6 bg-gradient-card shadow-soft border-0">
              <div className="flex items-center gap-3 mb-4">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <h3 className="text-lg font-semibold">Bulk Upload</h3>
                <Badge variant="outline">Coming Soon</Badge>
              </div>
              <p className="text-muted-foreground mb-4">
                Upload multiple stock updates via CSV or Excel file for faster processing.
              </p>
              <Button variant="outline" disabled>
                <Upload className="h-4 w-4 mr-2" />
                Upload File
              </Button>
            </Card>
          </div>

          {/* Preview Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card className="p-6 bg-gradient-card shadow-soft border-0">
                <h3 className="text-lg font-semibold mb-4">Stock Preview</h3>
                
                {selectedProduct && updateQuantity ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Product</label>
                      <p className="text-sm font-medium">{selectedProduct.name}</p>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Current:</span>
                        <span className="font-medium">{currentBalance}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Change:</span>
                        <span className={`font-medium ${updateQty >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {updateQty >= 0 ? '+' : ''}{updateQty}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">New Balance:</span>
                        <Badge variant={newBalance < 0 ? "destructive" : "secondary"}>
                          {newBalance}
                        </Badge>
                      </div>
                    </div>

                    {newBalance < 0 && (
                      <div className="flex items-start gap-2 p-3 bg-destructive/10 text-destructive rounded-lg">
                        <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" />
                        <div className="text-xs">
                          <p className="font-medium">Warning!</p>
                          <p>This update will result in negative stock balance.</p>
                        </div>
                      </div>
                    )}

                    <div className="text-xs text-muted-foreground">
                      <p><strong>Reason:</strong> {reason ? reasonOptions.find(r => r.value === reason)?.label : 'Not selected'}</p>
                      <p><strong>Date:</strong> {selectedDate ? format(selectedDate, "PPP") : 'Not selected'}</p>
                      <p><strong>Shift:</strong> {shift.charAt(0).toUpperCase() + shift.slice(1)}</p>
                      <p><strong>Updated by:</strong> {currentUser.name}</p>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground">
                      Select a product and enter update quantity to see preview
                    </p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-success" />
                Confirm Stock Update
              </DialogTitle>
            </DialogHeader>

            {pendingUpdate && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-muted-foreground mb-4">
                    You are about to update stock for:
                  </p>
                  <div className="bg-muted p-4 rounded-lg space-y-2">
                    <p className="font-semibold">{pendingUpdate.productName}</p>
                    <div className="flex items-center justify-center gap-2 text-lg">
                      <span>{pendingUpdate.currentBalance}</span>
                      <span className="text-muted-foreground">→</span>
                      <span className="font-bold text-primary">{pendingUpdate.newBalance}</span>
                      <span className="text-sm text-muted-foreground">units</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Change: {pendingUpdate.updateQuantity >= 0 ? '+' : ''}{pendingUpdate.updateQuantity}
                    </p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowConfirmation(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="success"
                    onClick={handleConfirmUpdate}
                    className="flex-1"
                  >
                    Confirm Update
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}