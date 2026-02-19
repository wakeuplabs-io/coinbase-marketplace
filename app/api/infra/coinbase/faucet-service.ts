import "server-only";

/**
 * Coinbase CDP SDK Faucet Service
 * Handles faucet requests for test tokens on Base Sepolia
 */
import { CdpClient } from "@coinbase/cdp-sdk";
import { getEnv } from "../../config";

export interface RequestFaucetParams {
  address: string;
  network: "base-sepolia";
  token: "usdc";
}

export interface FaucetResponse {
  transactionHash: string;
}

export class FaucetService {
  private cdp: CdpClient;

  constructor() {
    this.cdp = new CdpClient({
      apiKeyId: getEnv().COINBASE_API_KEY_ID ?? "",
      apiKeySecret: getEnv().COINBASE_API_KEY_SECRET ?? "",
    });
  }

  async requestFaucet(params: RequestFaucetParams): Promise<FaucetResponse> {
    try {
      const response = await this.cdp.evm.requestFaucet({
        address: params.address,
        network: params.network,
        token: params.token,
      });

      return {
        transactionHash: response.transactionHash,
      };
    } catch (error) {
      throw new Error(
        `Failed to request faucet: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }
}
