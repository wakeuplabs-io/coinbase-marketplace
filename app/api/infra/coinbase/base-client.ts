import "server-only";
/**
 * Coinbase Payments SDK wrapper
 * Provides a clean interface for all Coinbase Payments operations
 *
 * Architecture: This is infrastructure layer - never accessed directly from controllers
 * All Coinbase Payments interactions go through this adapter
 */
import { generateJwt } from "@coinbase/cdp-sdk/auth";

import { getEnv } from "../../config";
import { paymentConfig } from "../../constants";

/**
 * Coinbase Payments client wrapper
 * Handles all Coinbase Payments API interactions
 */
export class CoinbaseClient {
  private apiKeyId: string;
  private apiKeySecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKeyId = getEnv().COINBASE_API_KEY_ID ?? "";
    this.apiKeySecret = getEnv().COINBASE_API_KEY_SECRET ?? "";
    this.baseUrl = paymentConfig.baseUrl;
  }

  protected authenticate(method: string, path: string): Promise<string> {
    const requestHost = this.baseUrl.replace(/^https?:\/\//, '');
    
    return generateJwt({
      apiKeyId: this.apiKeyId,
      apiKeySecret: this.apiKeySecret,
      requestMethod: method,
      requestHost: requestHost,
      requestPath: path,
    });
  }


  public async makeRequest<T>(
    method: string,
    path: string,
    body?: unknown,
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${path}`;
      const jwt = await this.authenticate(method, path);
      const idempotencyKey = crypto.randomUUID();

      const fetchOptions: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`,
          'x-idempotency-key': idempotencyKey,
        },
      };

      if (body) {
        fetchOptions.body = JSON.stringify(body);
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }

        throw new Error(
          `Coinbase API error (${response.status}): ${JSON.stringify(errorData)}`,
        );
      }

      return await response.json();
    } catch (error) {
      throw new Error(`Request failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}
