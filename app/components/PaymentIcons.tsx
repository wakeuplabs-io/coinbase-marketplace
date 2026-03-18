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

export function PayPalLogo() {
  return (
    <img
      src="/paypal-logo.svg"
      alt="PayPal"
      className="h-6 w-auto"
    />
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

export function StablecoinLogos({
  onClick,
  className = "",
}: {
  onClick?: () => void;
  className?: string;
}) {
  const content = (
    <div className="flex items-center gap-2">
      <img
        src="/usdc-logo.svg"
        alt="USDC"
        className="h-6 w-6 rounded-full"
      />
      <img
        src="/usdt-logo.svg"
        alt="USDT"
        className="h-6 w-6 rounded-full"
      />
    </div>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onClick();
        }}
        className={`flex items-center gap-2 rounded-lg p-1 -m-1 hover:bg-[#0052ff]/5 transition-colors ${className}`}
        aria-label="Connect wallet"
      >
        {content}
      </button>
    );
  }

  return <div className={className}>{content}</div>;
}
