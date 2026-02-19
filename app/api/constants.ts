import { getEnv } from "./config";

export enum NetworkId {
  BASE = '8453',
  BASE_SEPOLIA = '84532',
}

const tokens = {
  [NetworkId.BASE]: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  [NetworkId.BASE_SEPOLIA]: '0x036CbD53842c5426634e7929541eC2318f3dCF7e',
}

export const explorerUrls = {
  [NetworkId.BASE]: 'https://basescan.org',
  [NetworkId.BASE_SEPOLIA]: 'https://sepolia.basescan.org',
}

// Lazy-load payment config to avoid evaluating env vars at module load time
let _paymentConfig: ReturnType<typeof getPaymentConfig> | null = null;

function getPaymentConfig() {
  const env = getEnv();
  return {
    //baseUrl: 'https://payments.coinbase.com',
    baseUrl: 'https://payments.coinbase.com/sandbox',
    networkId: NetworkId.BASE_SEPOLIA,
    token: tokens[NetworkId.BASE_SEPOLIA],
    receiver: env.COINBASE_PAYMENTS_RECEIVER,
    operator: '0x38Ef039f162274693ca9ff94C8D3A82722bf61B8',
    successRedirectUrl: `${env.COINBASE_PAYMENTS_BASE_REDIRECT_URL}/success`,
    failRedirectUrl: `${env.COINBASE_PAYMENTS_BASE_REDIRECT_URL}/fail`,
    successCallbackUrl: `${env.COINBASE_PAYMENTS_BASE_REDIRECT_URL}/api/payment/success-callback`,
    paymentTokenContractAddress: "0x589d902681335F655E5C47B2B24E15062cC37FfB",
    feeBps: 0,
    feeReceiver: env.COINBASE_PAYMENTS_RECEIVER,
  };
}

export const paymentConfig = new Proxy({} as ReturnType<typeof getPaymentConfig>, {
  get(_target, prop) {
    if (!_paymentConfig) {
      _paymentConfig = getPaymentConfig();
    }
    return _paymentConfig[prop as keyof typeof _paymentConfig];
  }
});
