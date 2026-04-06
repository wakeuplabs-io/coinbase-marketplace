# Coinbase Marketplace

This document is a ready-to-copy README draft focused on complete onboarding, environment variables, and deployment clarity.

---

## Coinbase Marketplace

Demo app built with Next.js that integrates Coinbase Payments APIs for checkout flows (crypto + fiat-like UX), plus wallet connection and order notification support.

## Quick Start

### 1) Requirements

- Node.js 20+
- npm 10+
- ngrok (optional, for external callbacks/testing)

### 2) Install

```bash
npm install
```

### 3) Configure environment

```bash
cp .env.example .env.local
```

Then fill `.env.local` using the table below.

### 4) Run

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### 5) Sanity checks

- Open `http://localhost:3000/api/health`
- Confirm response is `status: "healthy"`
- Run a test checkout and verify payment link creation

---

## Environment Variables

### Required for full payment flow

| Variable | Scope | Required | Purpose | Example |
|---|---|---|---|---|
| `COINBASE_API_KEY_ID` | Server | Yes | CDP API key id used to sign JWT for Coinbase Payments requests | `organizations/.../apiKeys/...` |
| `COINBASE_API_KEY_SECRET` | Server | Yes | CDP API key secret (PEM/private key) | `-----BEGIN EC PRIVATE KEY-----...` |
| `COINBASE_PAYMENTS_RECEIVER` | Server | Yes | EVM receiver address for settlement/fees | `0xabc123...` |
| `COINBASE_PAYMENTS_BASE_REDIRECT_URL` | Server | Yes | Public base URL used to build success/fail/callback URLs | `https://your-app.ngrok.io` |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | Public | Yes (if notifications enabled) | Web3Forms key for checkout/order contact submission | `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx` |
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | Public | Recommended | WalletConnect project id for QR wallet flows | `abc123...` |

### Optional (with defaults in code)

| Variable | Scope | Required | Purpose | Default |
|---|---|---|---|---|
| `NEXT_PUBLIC_BASE_APP_URL` | Public | No | Base app landing/download URL | `https://www.coinbase.com/wallet/downloads` |
| `NEXT_PUBLIC_BASE_APP_IOS_URL` | Public | No | iOS Base app URL | App Store URL |
| `NEXT_PUBLIC_BASE_APP_ANDROID_URL` | Public | No | Android Base app URL | Play Store URL |
| `NEXT_PUBLIC_MARKETPLACE_URL` | Public | No | Redirect path/URL for marketplace page | `/marketplace` |
| `NEXT_PUBLIC_DISABLE_WALLETCONNECT` | Public | No | Disables WalletConnect connector when `true` | `false` |

### Security rules

- `NEXT_PUBLIC_*` variables are exposed to browser clients.
- Never place secrets in `NEXT_PUBLIC_*`.
- `COINBASE_API_KEY_SECRET` must remain server-only.

---

## Example `.env.local` (full flow)

```env
# -------------------------------
# Server-only (required)
# -------------------------------
COINBASE_API_KEY_ID=organizations/ORG_ID/apiKeys/KEY_ID
COINBASE_API_KEY_SECRET="-----BEGIN EC PRIVATE KEY-----\n...\n-----END EC PRIVATE KEY-----\n"
COINBASE_PAYMENTS_RECEIVER=0xYourReceiverAddress
COINBASE_PAYMENTS_BASE_REDIRECT_URL=https://your-public-url.ngrok.io

# -------------------------------
# Public (recommended/required by UX)
# -------------------------------
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=your_web3forms_access_key

# Optional overrides
NEXT_PUBLIC_DISABLE_WALLETCONNECT=false
NEXT_PUBLIC_BASE_APP_URL=https://www.coinbase.com/wallet/downloads
NEXT_PUBLIC_BASE_APP_IOS_URL=https://apps.apple.com/us/app/base-formerly-coinbase-wallet/id1278383455
NEXT_PUBLIC_BASE_APP_ANDROID_URL=https://play.google.com/store/apps/details?id=org.toshi
NEXT_PUBLIC_MARKETPLACE_URL=/marketplace
```

---

## External Services Setup

### Coinbase Developer Platform (CDP)

1. Create API key in CDP.
2. Copy key id into `COINBASE_API_KEY_ID`.
3. Copy private key into `COINBASE_API_KEY_SECRET`.
4. Set receiver wallet in `COINBASE_PAYMENTS_RECEIVER`.

### WalletConnect

1. Create project at [WalletConnect Cloud](https://cloud.walletconnect.com).
2. Copy project id to `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`.

### Web3Forms (optional but used by checkout hook)

1. Create key at [Web3Forms](https://web3forms.com).
2. Set `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`.

---

## Running with ngrok (for callbacks/redirects)

In one terminal:

```bash
npm run dev
```

In another terminal:

```bash
npm run dev:tunnel
```

Then set:

```env
COINBASE_PAYMENTS_BASE_REDIRECT_URL=https://<your-ngrok-domain>.ngrok.io
```

Restart dev server after changing env vars.

---

## Operational Notes

- Payment config currently points to Coinbase Payments sandbox in code.
- If you move to production endpoints/networks, update API base URL and token/network constants accordingly.
- Health endpoint (`/api/health`) intentionally reports presence of required env vars (without exposing full secrets).

---

## Troubleshooting

### `Invalid environment variables` at runtime

Ensure these are present and valid:

- `COINBASE_API_KEY_ID`
- `COINBASE_API_KEY_SECRET`
- `COINBASE_PAYMENTS_RECEIVER` (valid EVM address)
- `COINBASE_PAYMENTS_BASE_REDIRECT_URL`

### WalletConnect warning in browser

If you see missing project id warning:

- Set `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`, or
- Temporarily disable with `NEXT_PUBLIC_DISABLE_WALLETCONNECT=true`

### Checkout notification failing

- Verify `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY`
- Check network access to `https://api.web3forms.com/submit`

---

## Deploy

### Preview

```bash
npm run deploy:preview
```

### Production

```bash
npm run deploy:production
```

Also configure all required env vars in your hosting provider (Vercel/AWS Amplify/etc.) before deployment.
