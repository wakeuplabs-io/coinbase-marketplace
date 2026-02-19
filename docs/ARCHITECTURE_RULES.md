# Project Architecture Rules

## General Rules

- **Keep it simple**: Maintain the solution as simple as possible without covering many edge cases unless explicitly requested in the prompt
- **Minimal comments**: Do NOT add comments unless absolutely necessary. Code should be self-readable
- **JSDoc in API routes and services**: All API route handlers and service methods must have simple and concise JSDoc comments that add information beyond the method name
- **English naming**: All names and comments must be in English

## Backend Architecture Overview

This project follows a clean but simple architecture with clear separation of concerns:

- **API Route Handlers**: Next.js API routes handle HTTP requests, parse and validate input, call services, return responses
- **Infrastructure Services**: Encapsulate external API interactions and business logic (Coinbase Payments API, order management)
- **Clear Boundaries**: API routes should never directly access external APIs - always through the service layer

## Next.js API Route Patterns

### Documentation
- All API route handler functions (POST, GET, PUT, DELETE, etc.) must have simple and concise JSDoc comments
- JSDoc must add information beyond the method name - avoid repeating what's already clear from the name
- JSDoc should be brief - one or two lines describing behavior, important parameters, or side effects
- Example: `/** Creates a payment intent with Coinbase Payments API and returns payment details for checkout */`

### Input Validation
- Always use Zod schemas for input validation
- Define schemas as constants (e.g., `CreatePaymentIntentSchema`)
- Parse request body/params with Zod before processing: `const validatedData = Schema.parse(body)`
- Handle ZodError specifically and return 400 status with validation details

### Service Calls
- API routes call services from the `lib/services/` or `app/lib/services/` layer only
- Never access external APIs directly from API routes
- Instantiate service classes as needed: `const serviceInstance = new ServiceClass()`
- Pass validated data and configuration to services

### Error Handling
- Catch `z.ZodError` and return 400 with error details:
  ```typescript
  if (error instanceof z.ZodError) {
    return NextResponse.json(
      { error: 'Invalid input', details: error.issues },
      { status: 400 },
    );
  }
  ```
- Catch general errors and return 500:
  ```typescript
  return NextResponse.json(
    { error: 'Failed to create payment intent' },
    { status: 500 },
  );
  ```
- Include console.error for debugging server-side errors

### Response Format
- Always use `NextResponse.json()` for JSON responses
- Return appropriate HTTP status codes (200, 400, 500, etc.)
- Include console.log for debugging when needed (but remove in production)

### Example API Route Structure
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { CoinbasePaymentsService } from '@/lib/services/coinbase-payments-service';

const CreatePaymentIntentSchema = z.object({
  amount: z.number().positive(),
  currency: z.string().default('USD'),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  customerEmail: z.string().email(),
  billingAddress: z.object({
    country: z.string(),
    address: z.string(),
    city: z.string(),
    state: z.string(),
    zip: z.string(),
  }),
});

/**
 * Creates a payment intent with Coinbase Payments API and returns payment details for checkout
 * Validates order data and customer information before creating payment intent
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = CreatePaymentIntentSchema.parse(body);
    
    const paymentsService = new CoinbasePaymentsService();
    const result = await paymentsService.createPaymentIntent({
      amount: validatedData.amount,
      currency: validatedData.currency,
      items: validatedData.items,
      customerEmail: validatedData.customerEmail,
      billingAddress: validatedData.billingAddress,
    });

    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 },
      );
    }
    
    console.error('Failed to create payment intent:', error);
    return NextResponse.json(
      { error: 'Failed to create payment intent' },
      { status: 500 },
    );
  }
}
```

## Infrastructure Services Layer

### Location and Structure
- Services must be located in the `lib/services/` or `app/lib/services/` directory
- Organize by provider/domain (e.g., `lib/services/coinbase-payments-service.ts`, `lib/services/order-service.ts`)
- Services can extend base clients when applicable

### Documentation
- All public methods in services must have simple and concise JSDoc comments
- JSDoc must add information beyond the method name - avoid repeating what's already clear from the name
- JSDoc should be brief - one or two lines describing behavior, important parameters, side effects, or return value details
- Include JSDoc at the top of service files explaining:
  - What the service does
  - Architecture layer (infrastructure)
  - That it should never be accessed directly from API routes
- Example JSDoc format:
  ```typescript
  /**
   * Creates a payment intent with Coinbase Payments API for processing crypto or card payments
   * Returns payment intent ID and client secret for frontend integration
   */
  async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult>
  
  /**
   * Confirms a payment and processes the order after successful payment
   * Updates order status and returns order confirmation details
   */
  async confirmPayment(params: ConfirmPaymentParams): Promise<PaymentConfirmationResult>
  ```

### TypeScript Interfaces
- Define TypeScript interfaces for all method parameters (e.g., `CreatePaymentIntentParams`)
- Define TypeScript interfaces for all return types (e.g., `PaymentIntentResult`)
- Export interfaces so they can be used by API routes
- Use descriptive, specific interface names

### Method Implementation
- Use descriptive method names (e.g., `createPaymentIntent`, `confirmPayment`, `getOrderStatus`)
- All public methods must have simple and concise JSDoc comments
- Methods should be async and return Promises
- Handle idempotency keys when needed (e.g., using `crypto.randomUUID()`)
- Transform API responses to match internal interfaces (e.g., snake_case to camelCase)
- Include proper error handling with try-catch blocks
- Provide helpful error messages that include context (e.g., order ID, payment amount)

### Service Class Structure
```typescript
/**
 * Coinbase Payments service for payment processing operations
 * Handles all interactions with Coinbase Payments API including payment intent creation,
 * payment confirmation, and order processing
 *
 * Architecture: This is infrastructure layer - never accessed directly from API routes
 * All external Coinbase Payments API interactions go through this service
 */

import { env } from '@/env';

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail: string;
  billingAddress: {
    country: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret?: string;
  walletAddress?: string;
  amount: number;
  currency: string;
}

export class CoinbasePaymentsService {
  private apiUrl: string;
  private apiKey: string;

  constructor() {
    this.apiUrl = env.COINBASE_API_URL;
    this.apiKey = env.COINBASE_API_KEY;
  }

  /**
   * Creates a payment intent with Coinbase Payments API for processing crypto or card payments
   * Returns payment intent ID and client secret for frontend integration
   */
  public async createPaymentIntent(params: CreatePaymentIntentParams): Promise<PaymentIntentResult> {
    try {
      const response = await fetch(`${this.apiUrl}/payment-intents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          amount: params.amount,
          currency: params.currency,
          items: params.items,
          customer_email: params.customerEmail,
          billing_address: params.billingAddress,
        }),
      });

      if (!response.ok) {
        throw new Error(`Coinbase Payments API error: ${response.statusText}`);
      }

      const data = await response.json();
      
      return {
        paymentIntentId: data.payment_intent_id,
        clientSecret: data.client_secret,
        walletAddress: data.wallet_address,
        amount: data.amount,
        currency: data.currency,
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent for ${params.amount} ${params.currency}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}
```

### Request Handling
- Use fetch or HTTP client libraries for making requests
- Include necessary headers (e.g., authentication, content-type)
- Handle query parameters properly for GET requests
- Transform response data to match internal interfaces

## Frontend Architecture Rules

### Component Principles

- **Single Responsibility**: Components must have only one responsibility
- **No Logic in Components**: Components should not contain business logic - all logic must be in custom hooks or context
- **Presentation Only**: Components should focus on rendering UI and handling user interactions
- **Context Integration**: Components use React Context for shared state (cart, notifications)

### React Context

- **State Management**: Use Context API for shared application state (cart, user, notifications)
- **Provider Pattern**: Wrap application with context providers in layout
- **Custom Hooks**: Create custom hooks (e.g., `useCart`) to access context values
- **Separation**: Keep context logic separate from component logic

### Context Example Structure

```typescript
// app/context/CartContext.tsx
import { createContext, useContext, useState, useCallback, useMemo } from 'react';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addItem = useCallback((product: Product) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...currentItems, { ...product, quantity: 1 }];
    });
  }, []);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items]
  );

  const value = useMemo(
    () => ({
      items,
      itemCount,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      isCartOpen,
      setIsCartOpen,
    }),
    [items, itemCount, subtotal, addItem, removeItem, updateQuantity, clearCart, isCartOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
```

### Custom Hooks

- **Logic Container**: Business logic and API calls should be in custom hooks when not suitable for context
- **Reusability**: Hooks should be reusable and independent of specific components
- **State Management**: Hooks manage their own state (loading, error, data)
- **Error Handling**: Hooks handle errors and expose error state to components

### Hook Structure

- Export TypeScript interfaces for hook parameters and return types
- Return an object with the hook's API (functions, state values)
- Handle errors appropriately and expose error state

### Example Hook Structure

```typescript
import { useState, useCallback } from 'react';

export interface CreatePaymentIntentParams {
  amount: number;
  currency: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  customerEmail: string;
  billingAddress: {
    country: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}

export interface PaymentIntentResult {
  paymentIntentId: string;
  clientSecret?: string;
  walletAddress?: string;
  amount: number;
  currency: string;
}

export const usePayment = () => {
  const [paymentIntent, setPaymentIntent] = useState<PaymentIntentResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createPaymentIntent = useCallback(
    async (params: CreatePaymentIntentParams): Promise<PaymentIntentResult> => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch('/api/payments/create-intent', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(params),
        });

        if (!response.ok) {
          throw new Error('Failed to create payment intent');
        }

        const result = await response.json();
        setPaymentIntent(result);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Failed to create payment intent');
        setError(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { 
    paymentIntent, 
    createPaymentIntent, 
    loading, 
    error 
  };
};
```

### Component Example

```typescript
import { useCart } from '@/context/CartContext';
import { usePayment } from '@/hooks/usePayment';
import { Button } from '@/components/ui/button';

export const CheckoutForm = () => {
  const { items, subtotal } = useCart();
  const { createPaymentIntent, loading, error } = usePayment();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createPaymentIntent({
        amount: subtotal,
        currency: 'USD',
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        customerEmail: 'customer@example.com',
        billingAddress: {
          country: 'US',
          address: '123 Main St',
          city: 'San Francisco',
          state: 'CA',
          zip: '94102',
        },
      });
    } catch (err) {
      // Error is already handled in hook
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div>Error: {error.message}</div>}
      <Button type="submit" disabled={loading}>
        {loading ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  );
};
```

### File Structure

- **Components**: `app/components/` directory
- **Context**: `app/context/` directory
- **Hooks**: `app/hooks/` or `hooks/` directory (if used)
- **API Routes**: `app/api/` directory
- **Services**: `lib/services/` or `app/lib/services/` directory
- **One context per file**: Each context should be in its own file
- **Naming**: Context files should be named with `Context.tsx` suffix (e.g., `CartContext.tsx`)

### Wallet Integration

- **Coinbase Wallet SDK or wagmi**: Use Coinbase Wallet SDK or wagmi for wallet connections
- **Provider Setup**: Wrap application with wallet provider in layout
- **Custom Hooks**: Create custom hooks (e.g., `useWallet`) to access wallet state
- **Network Configuration**: Configure supported chains (Base, Ethereum, etc.)

### Wallet Integration Example

```typescript
// lib/wallet-config.ts
import { createConfig, http } from 'wagmi';
import { base, mainnet } from 'wagmi/chains';
import { coinbaseWallet, metaMask, walletConnect } from 'wagmi/connectors';

export const wagmiConfig = createConfig({
  chains: [base, mainnet],
  connectors: [
    coinbaseWallet({ appName: 'Coinbase Marketplace' }),
    metaMask(),
    walletConnect({ projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID }),
  ],
  transports: {
    [base.id]: http(),
    [mainnet.id]: http(),
  },
});
```

```typescript
// hooks/useWallet.ts
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';

export const useWallet = () => {
  const { address, isConnected, chainId } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  return {
    address,
    isConnected,
    chainId,
    balance: balance ? Number(balance.value) : 0,
    connect,
    disconnect,
    connectors,
  };
};
```

### Responsive Design

- **Mobile-First**: Design components with mobile-first approach
- **Breakpoints**: Use standard responsive breakpoints (sm, md, lg, xl)
- **Flexible Layouts**: Use flexbox and grid for responsive layouts
- **Touch Targets**: Ensure interactive elements have adequate touch target sizes (minimum 44x44px)
- **Viewport Units**: Use viewport-relative units (vw, vh) appropriately for responsive sizing
- **Media Queries**: Use CSS media queries or Tailwind responsive utilities for breakpoint-specific styles

### Best Practices

1. **Separation of Concerns**: Components handle UI, context handles shared state, hooks handle business logic
2. **Reusability**: Extract common logic into reusable hooks or context
3. **Type Safety**: Define TypeScript interfaces for all context values, hook parameters and return types
4. **Error Handling**: Hooks and services should handle errors and expose error state
5. **Loading States**: Hooks should manage and expose loading states
6. **Memoization**: Use `useMemo` and `useCallback` appropriately to prevent unnecessary re-renders
7. **Wallet Integration**: Use wallet hooks in custom hooks, not directly in components
8. **Responsive Design**: Always ensure components work well on mobile, tablet, and desktop

## TypeScript & Code Quality

### Type Safety
- Use strict TypeScript types throughout
- Avoid `any` types - use proper interfaces or `unknown` with type guards
- Use type parameters for generic methods when appropriate

### Error Handling
- Always use try-catch blocks in service methods and API routes
- Provide context in error messages (include IDs, operation names, etc.)
- Re-throw errors with enhanced messages when appropriate
- Example: `throw new Error(\`Failed to create payment intent for ${params.amount} ${params.currency}: ${error.message}\`)`

### Code Organization
- Keep services focused on a single responsibility
- Group related methods together
- Use consistent naming conventions (camelCase for methods, PascalCase for classes/interfaces)

## File Structure

### API Routes
- API routes: `app/api/[route]/route.ts`
- Use Next.js App Router API route conventions
- Keep routes thin - validation and delegation only

### Services
- Infrastructure layer: `lib/services/[service-name]-service.ts` or `app/lib/services/[service-name]-service.ts`
- Base clients: `lib/services/base-client.ts` (if needed)
- One service class per file

### Context
- Context providers: `app/context/[context-name]Context.tsx`
- Export provider component and custom hook
- One context per file

### Constants
- Shared configuration: `lib/config.ts` or `app/lib/config.ts`
- Environment variables: Use `process.env` with proper typing
- Export configuration objects

## Best Practices

1. **Simplicity First**: Keep solutions simple - avoid over-engineering and unnecessary edge cases
2. **Separation of Concerns**: API routes handle HTTP, services handle business logic and external APIs
3. **Validation First**: Always validate input before processing
4. **Type Safety**: Use TypeScript interfaces for all data structures
5. **Error Context**: Include relevant context in error messages
6. **Self-Readable Code**: Write code that explains itself - avoid comments unless absolutely necessary
7. **Consistency**: Follow the same patterns across all API routes and services
8. **Frontend-Backend Separation**: Components use context/hooks, hooks call API routes, API routes call services
