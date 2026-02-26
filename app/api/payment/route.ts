import { NextResponse } from 'next/server';
import { z } from 'zod';
import { PaymentService } from '../infra/coinbase/payment-service';
import { paymentConfig } from '../constants';

const CreatePaymentLinkParamsSchema = z.object({
  maxAmount: z.string().optional(),
  merchant: z.object({
    name: z.string().optional(),
    identifier: z.string().optional(),
  }).optional(),
  customer: z.object({
    name: z.string().optional(),
    email: z.string().optional(),
    phone: z.string().optional(),
  }).optional(),
  fiat: z.object({
    amount: z.string().optional(),
    currency: z.string().optional(),
  }).optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const createPaymentLinkParams = CreatePaymentLinkParamsSchema.parse(body);
    console.log('createPaymentLinkParams', createPaymentLinkParams);

    const paymentServiceInstance = new PaymentService();


    const result = await paymentServiceInstance.createPaymentLink({
      ...createPaymentLinkParams,
      merchant: createPaymentLinkParams.merchant?.name
        ? createPaymentLinkParams.merchant
        : { name: paymentConfig.merchantName },
      networkId: paymentConfig.networkId,
      receiver: paymentConfig.receiver,
      token: paymentConfig.token,
      operator: paymentConfig.operator,
      successRedirectUrl: paymentConfig.successRedirectUrl,
      failRedirectUrl: paymentConfig.failRedirectUrl,
      successCallbackUrl: paymentConfig.successCallbackUrl,
      autoAuthorize: true,
      autoCapture: false,
    } as Parameters<PaymentService['createPaymentLink']>[0]);

    console.log('result', result);

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }
    console.error('Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 },
    );
  }
}
