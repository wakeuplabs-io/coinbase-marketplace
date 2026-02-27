import { NextResponse } from "next/server";
import { PaymentService } from "../../infra/coinbase/payment-service";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ paymentId: string }> }
) {
  try {
    const { paymentId } = await params;
    if (!paymentId) {
      return NextResponse.json(
        { error: "Payment ID is required" },
        { status: 400 }
      );
    }

    const paymentService = new PaymentService();
    const payment = await paymentService.getPaymentLink(paymentId);

    return NextResponse.json(payment);
  } catch (error) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to fetch payment",
      },
      { status: 500 }
    );
  }
}
