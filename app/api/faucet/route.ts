import { NextResponse } from 'next/server';
import { z } from 'zod';
import { FaucetService } from '../infra/coinbase/faucet-service';
import { isAddress } from 'viem';
import { explorerUrls, NetworkId } from '../constants';

const RequestFaucetSchema = z.object({
  address: z.string().refine(isAddress, { message: 'address must be a valid Ethereum address' }),
  network: z.enum(['base-sepolia']).default('base-sepolia'),
  token: z.enum(['usdc']),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const params = RequestFaucetSchema.parse(body);

    const faucetService = new FaucetService();
    const result = await faucetService.requestFaucet({
      address: params.address,
      network: params.network,
      token: params.token,
    });

    return NextResponse.json({
      success: true,
      transactionHash: result.transactionHash,
      explorerUrl: `${explorerUrls[NetworkId.BASE_SEPOLIA]}/tx/${result.transactionHash}`,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Error requesting faucet:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to request faucet' },
      { status: 500 },
    );
  }
}
