import { Product, Order } from "@/types";

import WirelessHeadphoneImage from "../assets/images/wireless-headphone.jpg";
import AppleSeriesImage from "../assets/images/apple-series.webp";
import PowerBankImage from "../assets/images/powerbank.webp";
import UsbTypeCImage from "../assets/images/usb-type-c.jpg";
import WirelessChargingPadImage from "../assets/images/wireless-charging-pad.webp";
import WaterproofBluetoothImage from "../assets/images/waterproof-bluetooth.jpg";

export const mockProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    price: 79.99,
    image: WirelessHeadphoneImage,
    stock: 25,
    description: "Premium wireless headphones with noise cancellation",
  },
  {
    id: "2",
    name: "Smart Watch Series 5",
    price: 299.99,
    image: AppleSeriesImage,
    stock: 12,
    description: "Advanced fitness tracking and health monitoring",
  },
  {
    id: "3",
    name: "Portable Power Bank",
    price: 39.99,
    image: PowerBankImage,
    stock: 45,
    description: "20,000mAh fast charging power bank",
  },
  {
    id: "4",
    name: "USB-C Hub Adapter",
    price: 49.99,
    image: UsbTypeCImage,
    stock: 8,
    description: "Multi-port USB-C hub with HDMI and ethernet",
  },
  {
    id: "5",
    name: "Wireless Charging Pad",
    price: 24.99,
    image: WirelessChargingPadImage,
    stock: 33,
    description: "15W fast wireless charging pad",
  },
  {
    id: "6",
    name: "Bluetooth Speaker",
    price: 89.99,
    image: WaterproofBluetoothImage,
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
