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
}

export interface CreatePaymentLinkResult {
  link: PaymentLink;
}

export class PaymentService extends CoinbaseClient {
  constructor() {
    super();
  }

  async createPaymentLink(params: CreatePaymentLinkParams): Promise<CreatePaymentLinkResult> {
    try {
      const response = await super.makeRequest<{ payment: CreatePaymentLinkResult }>('POST',
        '/api/v1/payments',
        params
      );

      console.log('response', response);
      return response.payment;
    } catch (error) {
      throw new Error(
        `Failed to create payment link: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  async getPaymentLink(paymentLinkId: string): Promise<PaymentLink> {
    try {
      const response = await super.makeRequest<{ data: PaymentLink }>('GET',
        `/api/v1/payments/${paymentLinkId}`,
      );

      return response.data;
    } catch (error) {
      console.error('Failed to get payment link:', error);
      throw new Error(
        `Failed to get payment link: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
