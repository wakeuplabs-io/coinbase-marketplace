import { Product } from "../context/CartContext";

export const products: Product[] = [
  {
    id: "1",
    name: "Crypto Hoodie",
    description: "Premium cotton hoodie with logo.",
    price: 0.79,
    image: "/products/hoodie.png",
    badge: "Popular",
  },
  {
    id: "2",
    name: "Hardware Wallet",
    description: "Secure cold storage for crypto.",
    price: 0.14,
    image: "/products/wallet.png",
    badge: "Best Seller",
  },
  {
    id: "3",
    name: "NFT Art Print",
    description: "Limited edition blockchain artwork.",
    price: 0.24,
    image: "/products/art.png",
    badge: "Limited",
  },
  {
    id: "4",
    name: "Crypto Mug",
    description: "Thermal-reactive crypto chart mug.",
    price: 0.20,
    image: "/products/mug.png",
  },
  {
    id: "5",
    name: "Base Cap",
    description: "Adjustable cap with Base logo.",
    price: 0.34,
    image: "/products/cap.png",
    badge: "New",
  },
  {
    id: "6",
    name: "Crypto Socks Pack",
    description: "Set of 3 premium cotton socks.",
    price: 0.19,
    image: "/products/socks.png",
  },
];
