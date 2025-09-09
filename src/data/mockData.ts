import { Product, Order } from "@/types";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop",
    stock: 25,
    description: "Premium wireless headphones with noise cancellation",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    price: 299.99,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop",
    stock: 12,
    description: "Advanced fitness tracking and health monitoring",
  },
  {
    id: "3",
    name: "Portable Power Bank",
    price: 39.99,
    image:
      "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400&h=300&fit=crop",
    stock: 45,
    description: "20,000mAh fast charging power bank",
  },
  {
    id: "4",
    name: "USB-C Hub Adapter",
    price: 49.99,
    image:
      "https://images.unsplash.com/photo-1625842268584-8f3296236761?w=400&h=300&fit=crop",
    stock: 8,
    description: "Multi-port USB-C hub with HDMI and ethernet",
  },
  {
    id: "5",
    name: "Wireless Charging Pad",
    price: 24.99,
    image:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop",
    stock: 33,
    description: "15W fast wireless charging pad",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 89.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop",
    stock: 19,
    description: "Waterproof portable bluetooth speaker",
  },
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    items: [
      { product: mockProducts[0], quantity: 2 },
      { product: mockProducts[2], quantity: 1 },
    ],
    total: 199.97,
    status: "completed",
    date: "2024-03-15",
    paymentMethod: "**** 1234",
  },
  {
    id: "ORD-002",
    items: [{ product: mockProducts[1], quantity: 1 }],
    total: 299.99,
    status: "processing",
    date: "2024-03-20",
    paymentMethod: "**** 5678",
  },
  {
    id: "ORD-003",
    items: [
      { product: mockProducts[3], quantity: 1 },
      { product: mockProducts[4], quantity: 2 },
    ],
    total: 99.97,
    status: "pending",
    date: "2024-03-22",
    paymentMethod: "**** 9012",
  },
];
