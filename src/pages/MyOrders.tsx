import { useState } from "react";
import { Package, Search, Calendar, Filter, Eye, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Order } from "@/types";
import { useAppContext } from "@/context/AppContext";

export default function MyOrders() {
  const { orders } = useAppContext();
  const [filteredOrders, setFilteredOrders] = useState<Order[]>(orders);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    filterOrders(value, statusFilter);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    filterOrders(searchTerm, value);
  };

  const filterOrders = (search: string, status: string) => {
    let filtered = orders;

    if (search) {
      filtered = filtered.filter(
        (order) =>
          order.id.toLowerCase().includes(search.toLowerCase()) ||
          order.items.some((item) =>
            item.product.name.toLowerCase().includes(search.toLowerCase()),
          ),
      );
    }

    if (status !== "all") {
      filtered = filtered.filter((order) => order.status === status);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "success";
      case "processing":
        return "default";
      case "pending":
        return "warning";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-primary rounded-2xl mb-6">
            <Package className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">My Orders</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Track and manage all your orders in one place. View order details,
            status updates, and delivery information.
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-8 bg-gradient-card shadow-soft border-0">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by order ID or product name..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-card shadow-soft border-0">
              <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground">
                {searchTerm || statusFilter !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "You haven't placed any orders yet"}
              </p>
            </Card>
          ) : (
            filteredOrders.map((order) => (
              <Card
                key={order.id}
                className="p-6 bg-gradient-card shadow-soft border-0 hover:shadow-medium transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold">{order.id}</h3>
                      <Badge variant={getStatusColor(order.status) as any}>
                        {order.status.charAt(0).toUpperCase() +
                          order.status.slice(1)}
                      </Badge>
                    </div>

                    {order.customerName && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <User className="h-4 w-4 mr-1" />
                        <span>Customer: {order.customerName}</span>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {formatDate(order.date)}
                      </div>
                      <div>
                        {order.items.length} item
                        {order.items.length !== 1 ? "s" : ""}
                      </div>
                      <div>Payment: {order.paymentMethod}</div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {order.items
                        .slice(0, 2)
                        .map((item) => item.product.name)
                        .join(", ")}
                      {order.items.length > 2 &&
                        ` +${order.items.length - 2} more`}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-primary">
                        ${order.total.toFixed(2)}
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedOrder(order)}
                      className="shrink-0"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Order Details Modal */}
        <Dialog
          open={!!selectedOrder}
          onOpenChange={() => setSelectedOrder(null)}
        >
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Order Details - {selectedOrder?.id}
              </DialogTitle>
            </DialogHeader>

            {selectedOrder && (
              <div className="space-y-6">
                {/* Order Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Order Date
                    </label>
                    <p className="text-sm">{formatDate(selectedOrder.date)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Status
                    </label>
                    <div className="mt-1">
                      <Badge
                        variant={getStatusColor(selectedOrder.status) as any}
                      >
                        {selectedOrder.status.charAt(0).toUpperCase() +
                          selectedOrder.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Payment Method
                    </label>
                    <p className="text-sm">{selectedOrder.paymentMethod}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Total Amount
                    </label>
                    <p className="text-sm font-semibold">
                      ${selectedOrder.total.toFixed(2)}
                    </p>
                  </div>
                  {selectedOrder.customerName && (
                    <>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Customer Name
                        </label>
                        <p className="text-sm">{selectedOrder.customerName}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Customer Email
                        </label>
                        <p className="text-sm">{selectedOrder.customerEmail}</p>
                      </div>
                    </>
                  )}
                </div>

                <Separator />

                {/* Order Items */}
                <div>
                  <h3 className="font-semibold mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex items-center space-x-4 p-4 bg-muted rounded-lg"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 object-cover rounded-md"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{item.product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            ${item.product.price.toFixed(2)} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Total */}
                <div className="bg-muted p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold">Total Amount</span>
                    <span className="text-2xl font-bold text-primary">
                      ${selectedOrder.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
