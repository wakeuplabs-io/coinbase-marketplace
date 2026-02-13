import { ReactElement } from "react";

interface ProductIconProps {
  name: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "w-10 h-10",
  md: "w-16 h-16",
  lg: "w-20 h-20",
};

const iconMap: Record<string, (className: string) => ReactElement> = {
  hoodie: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M20 16c0-4 5.4-8 12-8s12 4 12 8" strokeLinecap="round" />
      <path d="M20 16l-10 8v12l8 4v16h28V40l8-4V24l-10-8" />
      <path d="M24 16v8c0 2.2 3.6 4 8 4s8-1.8 8-4v-8" />
      <circle cx="32" cy="20" r="2" fill="currentColor" />
    </svg>
  ),
  wallet: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="8" y="16" width="48" height="36" rx="4" />
      <path d="M8 24h48" />
      <rect
        x="40"
        y="32"
        width="12"
        height="8"
        rx="2"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="46" cy="36" r="2" fill="currentColor" />
      <path d="M16 16V12a4 4 0 014-4h24a4 4 0 014 4v4" />
    </svg>
  ),
  art: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="8" y="8" width="48" height="48" rx="2" />
      <rect x="12" y="12" width="40" height="40" rx="1" />
      <circle cx="24" cy="28" r="6" fill="currentColor" fillOpacity="0.2" />
      <path d="M16 48l12-16 8 10 6-8 10 14" />
    </svg>
  ),
  mug: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M12 20h32v28a4 4 0 01-4 4H16a4 4 0 01-4-4V20z" />
      <path d="M44 24h6a4 4 0 014 4v8a4 4 0 01-4 4h-6" />
      <path d="M20 12c2-4 6-4 8 0" />
      <path d="M28 12c2-4 6-4 8 0" />
      <path d="M20 28v12M28 28v12M36 28v12" strokeOpacity="0.3" />
    </svg>
  ),
  cap: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <ellipse cx="32" cy="40" rx="22" ry="8" />
      <path d="M10 40c0-16 10-24 22-24s22 8 22 24" />
      <path d="M10 40l-4 4h8" />
      <ellipse
        cx="32"
        cy="40"
        rx="10"
        ry="3"
        fill="currentColor"
        fillOpacity="0.2"
      />
      <circle cx="32" cy="16" r="3" fill="currentColor" />
    </svg>
  ),
  socks: (className) => (
    <svg
      viewBox="0 0 64 64"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M16 8v24c0 8 4 16 12 20h8c0-8-4-12-8-16V8" />
      <path d="M36 8v20c4 4 8 8 8 16h8c-8-4-12-12-12-20V8" />
      <path d="M16 16h12M36 16h12" strokeOpacity="0.5" />
      <path d="M16 24h12M36 24h12" strokeOpacity="0.3" />
    </svg>
  ),
};

export default function ProductIcon({
  name,
  className = "",
  size = "md",
}: ProductIconProps) {
  const nameLower = name.toLowerCase();
  const iconKey = Object.keys(iconMap).find((key) =>
    nameLower.includes(key)
  );
  const sizeClass = sizeMap[size];
  const fullClassName = `${sizeClass} text-[#0052ff] ${className}`;

  if (iconKey) {
    return iconMap[iconKey](fullClassName);
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className={fullClassName}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <rect x="12" y="12" width="40" height="40" rx="4" />
      <circle cx="32" cy="32" r="12" fill="currentColor" fillOpacity="0.2" />
    </svg>
  );
}
