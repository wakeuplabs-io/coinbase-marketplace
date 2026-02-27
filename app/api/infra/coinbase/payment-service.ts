import { CoinbaseClient } from './base-client';

export interface CreatePaymentLinkParams {
  maxAmount: string;
  networkId?: string;
  receiver: string;
  operator: string;
  token?: string;
  successRedirectUrl?: string;
  failRedirectUrl?: string;
  successCallbackUrl?: string;
  merchant?: {
    name?: string;
    identifier?: string;
  };
  customer?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  fiat?: {
    amount: string;
    currency: string;
  };
}

export interface PaymentLink {
  id: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  status: string;
  amount?: string;
  currency?: string;
  transactionHash?: string;
  settlement?: {
    totalAmount?: string;
    feeAmount?: string;
    netAmount?: string;
  };
}

export interface CreatePaymentLinkResult {
  payment: PaymentLink;
}

export class PaymentService extends CoinbaseClient {
  constructor() {
    super();
  }

  async createPaymentLink(params: CreatePaymentLinkParams): Promise<CreatePaymentLinkResult> {
    try {
      const response = await super.makeRequest<CreatePaymentLinkResult>('POST',
        '/api/v1/payments',
        params
      );

      return response;
    } catch (error) {
      throw new Error(
        `Failed to create payment link: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPaymentLink(paymentLinkId: string): Promise<PaymentLink & Record<string, unknown>> {
    try {
      const response = await super.makeRequest('GET', `/api/v1/payments/${paymentLinkId}`);

      const payment =
        (response as { data?: unknown }).data ??
        (response as { payment?: unknown }).payment ??
        response;
      return payment as PaymentLink & Record<string, unknown>;
    } catch (error) {
      console.error('Failed to get payment link:', error);
      throw new Error(
        `Failed to get payment link: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
