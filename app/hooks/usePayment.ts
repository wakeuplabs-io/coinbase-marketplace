import { useState, useCallback } from 'react';
import { CreatePaymentLinkResult } from '../api/infra/coinbase/payment-service';

interface PaymentLink {
  id: string;
  url: string;
  createdAt: string;
  expiresAt?: string;
  status: string;
}

export interface PaymentResponse {
  link: PaymentLink;
  [key: string]: unknown;
}

export interface CreatePaymentParams {
  maxAmount: string;
  customer: {
    name: string;
    email: string;
  };
}

export interface UsePaymentReturn {
  payment: PaymentLink | null;
  isLoading: boolean;
  error: string | null;
  createPayment: (params: CreatePaymentParams) => Promise<{payment: PaymentResponse }>;
  reset: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [paymentData, setPaymentData] = useState<CreatePaymentLinkResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(
    async (params: CreatePaymentParams): Promise<{payment: PaymentResponse}> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create payment');
        }

        const result = await response.json();
        console.log('result', result);

        setPaymentData(result);
        return result;
      } catch (err) {
        console.error('Error creating payment:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to create payment. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setPaymentData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    payment: paymentData?.payment ?? null,
    isLoading,
    error,
    createPayment,
    reset,
  };
}