interface CoinbaseLogoProps {
  className?: string;
  size?: number;
}

export default function CoinbaseLogo({
  className = "",
  size = 28,
}: CoinbaseLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 1024 1024"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
    >
      <rect width="1024" height="1024" rx="512" fill="#0052FF" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M512 784C661.127 784 784 661.127 784 512C784 362.873 661.127 240 512 240C362.873 240 240 362.873 240 512C240 661.127 362.873 784 512 784ZM416.2 393.6C404.438 393.6 394.8 403.238 394.8 415V609C394.8 620.762 404.438 630.4 416.2 630.4H608.2C619.962 630.4 629.6 620.762 629.6 609V415C629.6 403.238 619.962 393.6 608.2 393.6H416.2Z"
        fill="white"
      />
    </svg>
  );
}
