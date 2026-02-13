export function CreditCardLogos() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/payment-icons/cards/visa.sxIq5Dot.svg"
        alt="Visa"
        className="h-4 w-auto"
      />
      <img
        src="/payment-icons/cards/mastercard.1c4_lyMp.svg"
        alt="Mastercard"
        className="h-4 w-auto"
      />
      <img
        src="/payment-icons/cards/amex.Csr7hRoy.svg"
        alt="American Express"
        className="h-4 w-auto"
      />
      <span className="text-xs text-[#4a5568]">+5</span>
    </div>
  );
}

export function ShopPayLogo() {
  return (
    <div
      className="text-[#5a31f4] font-bold text-lg tracking-tight"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
    >
      shop
    </div>
  );
}

export function CryptoWalletIcons() {
  return (
    <div className="flex items-center gap-2">
      <img
        src="/payment-icons/crypto/basepay.6xyjPudB.svg"
        alt="Base Pay"
        className="h-6 w-auto"
      />
      <img
        src="/payment-icons/crypto/metamask.B4X8-Ekf.svg"
        alt="MetaMask"
        className="h-6 w-auto"
      />
      <img
        src="/payment-icons/crypto/rainbow.CI6ZIIhA.svg"
        alt="Rainbow"
        className="h-6 w-auto"
      />
      <span className="text-xs text-[#4a5568]">+480</span>
    </div>
  );
}
