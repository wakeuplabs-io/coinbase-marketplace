import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    console.log('Success callback received:', body);

    return NextResponse.json({
      success: true,
      message: 'Callback received successfully',
    }, { status: 200 });
  } catch (error) {
    console.error('Error processing success callback:', error);
    return NextResponse.json(
      { error: 'Error processing callback' },
      { status: 200 },
    );
  }
}
