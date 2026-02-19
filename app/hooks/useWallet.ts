import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi';
import { formatUnits } from 'viem';
import { erc20Abi } from 'viem';

// USDC contract address on Base Sepolia
const USDC_ADDRESS = '0x036CbD53842c5426634e7929541eC2318f3dCF7e' as const;

export interface UseWalletReturn {
  address: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
  usdcBalance: number;
  isLoadingBalance: boolean;
  connect: () => void;
  disconnect: () => void;
}

export function useWallet(): UseWalletReturn {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending, error: connectError } = useConnect();
  const { disconnect } = useDisconnect();

  // Get USDC balance
  const { data: usdcBalance, isLoading: isLoadingUsdc } = useReadContract({
    address: USDC_ADDRESS,
    abi: erc20Abi,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  const handleConnect = () => {
    // Try to connect with the first available connector
    if (connectors.length > 0) {
      connect({ connector: connectors[0] });
    }
  };

  // Convert USDC balance to number (USDC has 6 decimals)
  const usdcBalanceNumber = usdcBalance
    ? parseFloat(formatUnits(usdcBalance, 6))
    : 0;

  return {
    address: address || null,
    isConnected,
    isLoading: isPending,
    error: connectError?.message || null,
    usdcBalance: usdcBalanceNumber,
    isLoadingBalance: isLoadingUsdc,
    connect: handleConnect,
    disconnect,
  };
}
