# Coinbase Marketplace

A demo showcasing Coinbase Payments APIs — enabling easy checkout for both crypto and non-crypto users.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration values.

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Public Tunnel with ngrok

To share your local development server externally (for testing on mobile devices, sharing with teammates, etc.), you can use ngrok.

### Prerequisites

Install ngrok if you haven't already:

```bash
# macOS with Homebrew
brew install ngrok

# Or download from https://ngrok.com/download
```

### Running the tunnel

1. First, start the development server in one terminal:

```bash
npm run dev
```

2. In a separate terminal, start the ngrok tunnel:

```bash
npm run dev:tunnel
```

ngrok will provide a public URL (e.g., `https://abc123.ngrok.io`) that forwards to your local server.

### Secure tunnel with basic authentication (recommended)

For added security, use basic authentication to protect access:

```bash
ngrok http 3000 --basic-auth="username:password"
```

Replace `username:password` with your own credentials. Only users with these credentials can access your tunnel.

### Security considerations

- **Use tunnels only for development/testing** — not for production
- **Don't share the URL publicly** — only with trusted collaborators
- **Close ngrok when not in use** — the tunnel stays open until you stop it
- **Never expose sensitive variables** — only use `NEXT_PUBLIC_` prefix for truly public data

## Environment Variables

| Variable | Type | Description |
|----------|------|-------------|
| `NEXT_PUBLIC_BASE_APP_URL` | Public | Base App download URL |
| `NEXT_PUBLIC_BASE_APP_IOS_URL` | Public | iOS App Store URL |
| `NEXT_PUBLIC_BASE_APP_ANDROID_URL` | Public | Google Play Store URL |
| `NEXT_PUBLIC_MARKETPLACE_URL` | Public | Marketplace redirect URL |

**Note:** Variables with `NEXT_PUBLIC_` prefix are exposed to the browser. Never put API keys or secrets in these variables.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
