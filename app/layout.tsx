import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProviderWrapper } from "./components/CartProviderWrapper";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Coinbase Marketplace | Payments Demo",
  description:
    "A demo showcasing Coinbase Payments APIs — enabling easy checkout for both crypto and non-crypto users.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <CartProviderWrapper>
          {children}
        </CartProviderWrapper>
      </body>
    </html>
  );
}
