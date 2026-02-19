import { NextResponse } from 'next/server';
import { getEnv } from '../config';

export async function GET() {
  try {
    // Try to get environment variables
    const env = getEnv();
    
    // Return health status with variable info (without exposing secrets)
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: env.NODE_ENV,
        hasApiKeyId: !!env.COINBASE_API_KEY_ID,
        hasApiKeySecret: !!env.COINBASE_API_KEY_SECRET,
        hasReceiver: !!env.COINBASE_PAYMENTS_RECEIVER,
        hasRedirectUrl: !!env.COINBASE_PAYMENTS_BASE_REDIRECT_URL,
        receiverPreview: env.COINBASE_PAYMENTS_RECEIVER 
          ? `${env.COINBASE_PAYMENTS_RECEIVER.substring(0, 6)}...${env.COINBASE_PAYMENTS_RECEIVER.substring(38)}`
          : 'missing',
        redirectUrl: env.COINBASE_PAYMENTS_BASE_REDIRECT_URL,
        apiKeyIdPreview: env.COINBASE_API_KEY_ID 
          ? `${env.COINBASE_API_KEY_ID.substring(0, 4)}...`
          : 'missing',
      },
    }, { status: 200 });
  } catch (error) {
    // If getEnv() fails, return error details
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    // Log all environment variables that start with COINBASE_ for debugging
    const coinbaseEnvVars = Object.keys(process.env)
      .filter(key => key.startsWith('COINBASE_'))
      .reduce((acc, key) => {
        const value = process.env[key];
        acc[key] = value 
          ? (key.includes('SECRET') || key.includes('KEY') 
              ? `${value.substring(0, 4)}...` 
              : value)
          : 'undefined';
        return acc;
      }, {} as Record<string, string>);
    
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: errorMessage,
      environment: {
        nodeEnv: process.env.NODE_ENV || 'undefined',
        coinbaseEnvVars,
        allProcessEnvKeys: Object.keys(process.env).slice(0, 50), // First 50 keys
      },
      awsContext: {
        lambdaFunctionName: process.env.AWS_LAMBDA_FUNCTION_NAME || 'not-lambda',
        executionEnv: process.env.AWS_EXECUTION_ENV || 'unknown',
        region: process.env.AWS_REGION || 'unknown',
      },
      troubleshooting: {
        message: 'Environment variables are not properly configured',
        steps: [
          '1. Go to AWS Amplify Console → App settings → Environment variables',
          '2. Verify all COINBASE_* variables are set',
          '3. Ensure no spaces before/after = sign',
          '4. Clear cache and redeploy',
        ],
      },
    }, { status: 500 });
  }
}
