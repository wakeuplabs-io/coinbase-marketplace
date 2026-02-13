import { useState, useCallback } from 'react';

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
  paymentData: PaymentResponse | null;
  isLoading: boolean;
  error: string | null;
  createPayment: (params: CreatePaymentParams) => Promise<PaymentResponse>;
  reset: () => void;
}

export function usePayment(): UsePaymentReturn {
  const [paymentData, setPaymentData] = useState<PaymentResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPayment = useCallback(
    async (params: CreatePaymentParams): Promise<PaymentResponse> => {
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

        if (!result.link) {
          throw new Error('Payment link not found in response');
        }

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
    paymentData,
    isLoading,
    error,
    createPayment,
    reset,
  };
}