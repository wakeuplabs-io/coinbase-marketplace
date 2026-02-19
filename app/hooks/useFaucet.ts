import { useState, useCallback } from 'react';

export type FaucetToken = 'usdc' | 'cbbtc';
export type FaucetNetwork = 'base-sepolia';

export interface RequestFaucetParams {
  address: string;
  network?: FaucetNetwork;
  token: FaucetToken;
}

export interface FaucetResponse {
  success: boolean;
  transactionHash: string;
  explorerUrl: string;
}

export interface UseFaucetReturn {
  isLoading: boolean;
  error: string | null;
  requestFaucet: (params: RequestFaucetParams) => Promise<FaucetResponse>;
  reset: () => void;
}

export function useFaucet(): UseFaucetReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestFaucet = useCallback(
    async (params: RequestFaucetParams): Promise<FaucetResponse> => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/faucet', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            address: params.address,
            network: params.network || 'base-sepolia',
            token: params.token,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to request faucet');
        }

        const result: FaucetResponse = await response.json();
        return result;
      } catch (err) {
        console.error('Error requesting faucet:', err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Failed to request faucet. Please try again.';
        setError(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const reset = useCallback(() => {
    setError(null);
    setIsLoading(false);
  }, []);

  return {
    isLoading,
    error,
    requestFaucet,
    reset,
  };
}
