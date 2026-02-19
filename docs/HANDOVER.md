# Coinbase Marketplace — Production Handover Document

> **Purpose**: This document provides context for building a production-ready ecommerce application using Coinbase Developer Platform (CDP) tools. This is a complete product demonstrating payment integration with Coinbase Payments APIs.

---

## 1. Project Overview

### What Is This?

A **production-ready ecommerce marketplace** demonstrating Coinbase Payments APIs integration. It provides developers with a complete, working example of:

1. Product catalog display with carousel navigation
2. Shopping cart functionality with real-time updates
3. Checkout flow with multiple payment options (crypto, credit cards, Shop Pay)
4. Integration with Coinbase Payments APIs (CDP) for crypto payments
5. Responsive design optimized for mobile and desktop

### Target Audience

Developers building ecommerce applications who need to integrate Coinbase Payments APIs (CDP) for accepting crypto payments alongside traditional payment methods.

### Current State

- ✅ **Frontend**: Fully functional Next.js application with product catalog and cart
- ✅ **State Management**: React Context API for cart state management
- ✅ **UI Components**: Complete component library with responsive design
- ✅ **Checkout Flow**: Checkout page with payment method selection
- ⚠️ **Payment Integration**: Coinbase Payments API integration needs to be implemented
- ⚠️ **Wallet Integration**: Crypto wallet connection needs to be implemented
- ⚠️ **Backend API**: Payment processing endpoints need to be created
- ⚠️ **Tests**: Minimal coverage - needs comprehensive test suite

---

## 2. Technology Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript (strict) |
| **Styling** | Tailwind CSS 4 |
| **State Management** | React Context API |
| **UI Components** | Custom components with Tailwind |
| **Payment Integration** | Coinbase Payments APIs (CDP) |
| **Deployment** | Vercel |
| **Package Manager** | npm |

### Project Structure

```
coinbase-marketplace/
├── app/                          # Next.js App Router
│   ├── page.tsx                 # Landing page
│   ├── marketplace/
│   │   └── page.tsx             # Marketplace page with products
│   ├── checkout/
│   │   └── page.tsx             # Checkout page
│   ├── components/              # UI components
│   │   ├── ProductCard.tsx
│   │   ├── ProductCarousel.tsx
│   │   ├── CartSection.tsx
│   │   ├── CartItem.tsx
│   │   ├── CartProviderWrapper.tsx
│   │   └── ToastContainer.tsx
│   ├── context/                 # React Context providers
│   │   ├── CartContext.tsx
│   │   └── ToastContext.tsx
│   ├── data/                    # Static data
│   │   └── products.ts
│   └── layout.tsx               # Root layout
├── public/                      # Static assets
│   └── payment-icons/           # Payment method icons
├── docs/                        # Documentation
│   ├── HANDOVER.md
│   └── ARCHITECTURE_RULES.md
└── package.json
```

### Key Files

**Pages:**
```
app/
├── page.tsx                     # Landing page with Base App download
├── marketplace/page.tsx         # Product marketplace with carousel
└── checkout/page.tsx             # Checkout with payment options
```

**Components:**
```
app/components/
├── ProductCard.tsx              # Individual product display
├── ProductCarousel.tsx          # Product carousel with swipe
├── CartSection.tsx              # Cart sidebar/section
├── CartItem.tsx                 # Individual cart item
├── CartProviderWrapper.tsx      # Cart context provider wrapper
└── ToastContainer.tsx           # Toast notification container
```

**Context:**
```
app/context/
├── CartContext.tsx              # Cart state management
└── ToastContext.tsx             # Toast notifications
```

**Data:**
```
app/data/
└── products.ts                  # Product catalog data
```

---

## 3. Application Architecture

### Core Features

1. **Product Catalog**
   - Product carousel with swipe navigation
   - Product cards with images, prices, and badges
   - Responsive design for mobile and desktop

2. **Shopping Cart**
   - Add/remove items
   - Update quantities
   - Real-time subtotal calculation
   - Persistent cart state (via Context API)

3. **Checkout Flow**
   - Contact information form
   - Payment method selection (crypto USDC, credit cards, Shop Pay)
   - Billing address form
   - Order summary

4. **Payment Integration**
   - Coinbase Payments APIs (CDP) for crypto payments
   - Support for multiple payment methods
   - Secure payment processing

### State Management

The application uses React Context API for state management:

```typescript
// app/context/CartContext.tsx
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
```

### Product Data Structure

```typescript
// app/data/products.ts
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;  // "Popular", "Best Seller", "Limited", "New"
}

interface CartItem extends Product {
  quantity: number;
}
```

---

## 4. Payment Integration Requirements

### Coinbase Payments APIs (CDP)

The application needs to integrate with Coinbase Payments APIs for processing crypto payments. Key integration points:

1. **Payment Intent Creation**
   - Create payment intent with order details
   - Handle USDC payments on supported chains
   - Support for multiple wallet providers

2. **Payment Processing**
   - Process crypto payments via Coinbase Payments
   - Handle payment confirmations
   - Update order status

3. **Payment Methods**
   - Crypto: USDC (Base, Ethereum, etc.)
   - Credit Cards: Visa, Mastercard, Amex (to be implemented)
   - Shop Pay: Installment payments (to be implemented)

### API Endpoints to Implement

| Method | Endpoint | Purpose | Implementation Status |
|--------|----------|---------|----------------------|
| `POST` | `/api/payments/create-intent` | Create payment intent | ⚠️ To be implemented |
| `POST` | `/api/payments/confirm` | Confirm payment | ⚠️ To be implemented |
| `GET` | `/api/payments/status/:id` | Check payment status | ⚠️ To be implemented |
| `POST` | `/api/orders/create` | Create order | ⚠️ To be implemented |
| `GET` | `/api/orders/:id` | Get order details | ⚠️ To be implemented |

### Implementation Pattern

All endpoints should follow the architecture pattern:
1. **API Route Handler**: Next.js API route handler
2. **Service Layer**: Service classes for Coinbase Payments API integration
3. **Types**: Shared TypeScript interfaces for requests/responses

See `ARCHITECTURE_RULES.md` for detailed implementation guidelines.

### Request/Response Schemas

#### Create Payment Intent Request
```typescript
{
  amount: number;           // Order total in USD
  currency: string;         // "USD"
  items: CartItem[];        // Cart items
  customerEmail: string;    // Customer email
  billingAddress: {
    country: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  };
}
```

#### Create Payment Intent Response
```typescript
{
  paymentIntentId: string;
  clientSecret?: string;    // For credit card payments
  walletAddress?: string;    // For crypto payments
  amount: number;
  currency: string;
}
```

#### Confirm Payment Request
```typescript
{
  paymentIntentId: string;
  paymentMethod: 'crypto' | 'credit' | 'shop';
  transactionHash?: string;  // For crypto payments
  paymentToken?: string;     // For credit card payments
}
```

#### Confirm Payment Response
```typescript
{
  status: 'success' | 'failed' | 'pending';
  orderId?: string;
  transactionHash?: string;
  error?: string;
}
```

---

## 5. Frontend Architecture

### Component Principles

- **Single Responsibility**: Components handle only UI rendering
- **No Business Logic**: All logic in custom hooks or context
- **Presentation Only**: Components receive data and callbacks via props
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints

### Component Structure

**Product Components:**
- `ProductCard`: Displays individual product with image, name, price, badge
- `ProductCarousel`: Swipeable carousel for browsing products

**Cart Components:**
- `CartSection`: Cart sidebar with items and checkout button
- `CartItem`: Individual cart item with quantity controls

**Layout Components:**
- Header with navigation and wallet connection
- Footer with links and branding

### Context Providers

1. **CartContext**: Manages shopping cart state
   - Items, quantities, subtotal
   - Add/remove/update operations
   - Cart open/close state

2. **ToastContext**: Manages toast notifications
   - Success, error, info messages
   - Auto-dismiss functionality

### Wallet Integration

The application needs wallet integration for crypto payments:

```typescript
// Example wallet integration structure
// hooks/useWallet.ts (to be created)
export const useWallet = () => {
  // Wallet connection state
  // Connect/disconnect functions
  // Wallet address and balance
  // Network switching
};
```

Integration with Coinbase Wallet SDK or wagmi/viem for wallet connections.

---

## 6. Testing Requirements

### Test Coverage Goals

- **Unit Tests**: >80% coverage for hooks, context, and utilities
- **Component Tests**: All user-facing components
- **Integration Tests**: Complete user flows (add to cart, checkout)
- **E2E Tests**: Full checkout flow with payment processing

### Test Structure

```
__tests__/
├── unit/
│   ├── context/
│   │   └── CartContext.test.tsx
│   └── utils/
│       └── formatPrice.test.ts
├── components/
│   ├── ProductCard.test.tsx
│   ├── ProductCarousel.test.tsx
│   ├── CartSection.test.tsx
│   └── CartItem.test.tsx
└── integration/
    ├── cart-flow.test.tsx
    └── checkout-flow.test.tsx
```

### Key Test Scenarios

1. **Cart Functionality**
   - Add item to cart
   - Remove item from cart
   - Update item quantity
   - Clear cart
   - Calculate subtotal correctly

2. **Checkout Flow**
   - Fill contact information
   - Select payment method
   - Fill billing address
   - Submit order
   - Handle payment success/failure

3. **Payment Integration**
   - Create payment intent
   - Process crypto payment
   - Process credit card payment
   - Handle payment errors

4. **Error Handling**
   - Network errors
   - API errors
   - Payment failures
   - Validation errors

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage report
npm test -- --coverage
```

---

## 7. Production Readiness Checklist

### High Priority (MVP)

- [ ] Integrate Coinbase Payments APIs (CDP)
- [ ] Implement wallet connection (Coinbase Wallet SDK or wagmi)
- [ ] Create payment processing API routes
- [ ] Implement order creation and management
- [ ] Add payment status tracking
- [ ] Add error boundaries and fallback UI
- [ ] Add comprehensive error handling
- [ ] Write unit tests for cart context (>80% coverage)
- [ ] Write component tests
- [ ] Add loading states for async operations

### Medium Priority

- [ ] Add integration tests for checkout flow
- [ ] Implement retry logic for failed API calls
- [ ] Add loading skeletons during data fetches
- [ ] Implement order history page
- [ ] Add email notifications for order confirmations
- [ ] Add analytics/telemetry
- [ ] Add request validation middleware
- [ ] Implement rate limiting
- [ ] Add environment variable validation

### Low Priority

- [ ] Optimize bundle size
- [ ] Add PWA support
- [ ] Implement dark/light theme toggle
- [ ] Add i18n support
- [ ] Performance monitoring
- [ ] Add E2E tests with Playwright
- [ ] Implement product search and filtering
- [ ] Add product reviews and ratings

---

## 8. Environment Variables

### Frontend (.env.local)

```env
# Public URLs
NEXT_PUBLIC_BASE_APP_URL=https://www.coinbase.com/wallet/downloads
NEXT_PUBLIC_BASE_APP_IOS_URL=https://apps.apple.com/us/app/base-formerly-coinbase-wallet/id1278383455
NEXT_PUBLIC_BASE_APP_ANDROID_URL=https://play.google.com/store/apps/details?id=org.toshi
NEXT_PUBLIC_MARKETPLACE_URL=/marketplace

# Coinbase Payments API (CDP)
NEXT_PUBLIC_COINBASE_API_KEY=your-api-key
NEXT_PUBLIC_COINBASE_API_URL=https://api.cdp.coinbase.com

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

### Backend API Routes (.env.local)

```env
# Server-side only (not exposed to browser)
COINBASE_API_KEY=your-api-key
COINBASE_API_SECRET=your-api-secret
COINBASE_API_URL=https://api.cdp.coinbase.com

# Database (if needed)
DATABASE_URL=your-database-url

# Order management
ORDER_WEBHOOK_SECRET=your-webhook-secret
```

**Note:** Variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Never put API secrets in these variables.

---

## 9. Key Implementation Notes

### Cart State Management

The cart uses React Context API for state management. The cart state persists during the session but does not persist across page refreshes. Consider adding:

- LocalStorage persistence
- Session management
- Cart recovery on page reload

### Payment Flow

1. User adds items to cart
2. User proceeds to checkout
3. User fills contact and billing information
4. User selects payment method
5. System creates payment intent via Coinbase Payments API
6. User completes payment (crypto or card)
7. System confirms payment and creates order
8. User receives order confirmation

### Error Handling

- Network errors: Show user-friendly message, allow retry
- Payment errors: Show specific error message, allow payment method change
- Validation errors: Highlight invalid fields, show inline errors
- API errors: Log server-side, show generic user message

### Responsive Design

- Mobile-first approach
- Touch-friendly interactions (minimum 44x44px touch targets)
- Swipe gestures for product carousel
- Responsive typography and spacing
- Optimized images for different screen sizes

---

## 10. Development Workflow

### Setup

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

### Code Organization

Follow the architecture rules in `ARCHITECTURE_RULES.md`:

1. **Components**: Presentation only, no business logic
2. **Context**: State management for cart and notifications
3. **API Routes**: Server-side payment processing
4. **Services**: Coinbase Payments API integration

### First Implementation Tasks

1. **Payment Integration**
   - Create API routes for payment processing
   - Integrate Coinbase Payments SDK
   - Implement payment intent creation
   - Implement payment confirmation

2. **Wallet Integration**
   - Add wallet connection functionality
   - Integrate Coinbase Wallet SDK or wagmi
   - Handle wallet connection state
   - Display wallet address and balance

3. **Order Management**
   - Create order API routes
   - Implement order creation after payment
   - Add order status tracking
   - Create order confirmation page

4. **Testing**
   - Write unit tests for cart context
   - Write component tests
   - Write integration tests for checkout flow

---

## 11. Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│              Frontend (Next.js App Router)                  │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Pages (Route Handlers)                     │ │
│  │  Landing | Marketplace | Checkout                        │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Components (Presentation Only)             │ │
│  │  ProductCard | CartSection | CheckoutForm               │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Context (State Management)                 │ │
│  │  CartContext | ToastContext                             │ │
│  └────────────────────────────────────────────────────────┘ │
│                          │                                   │
│                          ▼                                   │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              API Routes (Server-Side)                   │ │
│  │  /api/payments/* | /api/orders/*                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                          │
                          │ HTTP
                          ▼
┌─────────────────────────────────────────────────────────────┐
│         Coinbase Payments APIs (CDP)                         │
│  Payment Intents | Payment Processing | Order Management    │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ▼                 ▼                 ▼
  ┌──────────┐    ┌──────────────┐    ┌──────────┐
  │  Crypto   │    │   Credit      │    │  Shop     │
  │  Wallets  │    │   Cards      │    │  Pay      │
  └──────────┘    └──────────────┘    └──────────┘
```

---

## 12. Resources & References

- **Coinbase Developer Platform**: https://docs.cdp.coinbase.com
- **Coinbase Payments API**: https://docs.cdp.coinbase.com/payments/docs
- **Next.js Documentation**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Vercel Deployment**: https://vercel.com/docs

---

## 13. Architecture Rules

See `ARCHITECTURE_RULES.md` for detailed coding standards, patterns, and examples specific to this project.

---

*Last updated: 2026-02-04*
