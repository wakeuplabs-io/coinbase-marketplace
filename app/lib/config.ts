export const config = {
  baseAppUrl:
    process.env.NEXT_PUBLIC_BASE_APP_URL ||
    "https://www.coinbase.com/wallet/downloads",
  baseAppIosUrl:
    process.env.NEXT_PUBLIC_BASE_APP_IOS_URL ||
    "https://apps.apple.com/us/app/base-formerly-coinbase-wallet/id1278383455",
  baseAppAndroidUrl:
    process.env.NEXT_PUBLIC_BASE_APP_ANDROID_URL ||
    "https://play.google.com/store/apps/details?id=org.toshi",
  marketplaceUrl:
    process.env.NEXT_PUBLIC_MARKETPLACE_URL || "/marketplace",
} as const;
