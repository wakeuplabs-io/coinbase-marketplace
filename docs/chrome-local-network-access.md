# Chrome “Local Network Access” prompt

Some users see Google Chrome’s permission dialog:

> **{origin}** wants to **Access other devices on your local network** — Block / Allow

## What we changed in code (PR-05)

**There is no browser API or iframe flag that reliably turns off this Chrome dialog** when the underlying stack triggers local-network discovery. The work in this repo was **documentation and configuration guidance**, not a hidden code path that suppresses the prompt.

What already exists in the app (and stays as good hygiene, not a guarantee):

- The Coinbase payment UI loads in a **same-origin iframe** with a **small** `allow` list and a restrictive `sandbox` ([`app/checkout/paymentEmbed.tsx`](../app/checkout/paymentEmbed.tsx) → [`public/coinbase-payment-embed.html`](../public/coinbase-payment-embed.html)).

## How to actually avoid the prompt (most demos)

Chrome usually shows this when **WalletConnect** (or similar) runs discovery in the **top-level page**. To avoid registering WalletConnect in the dapp:

1. Use **`NEXT_PUBLIC_DISABLE_WALLETCONNECT=true`** (recommended default in **`.env.example`** in this repo; set on each deployment as needed).
2. Redeploy. Connectors fall back to **Coinbase Wallet + injected** only (`app/lib/wagmi-config.ts`).

**Trade-off:** You lose RainbowKit’s WalletConnect-backed wallets (e.g. some mobile / QR flows). For a Coinbase/Base-focused demo that is often acceptable.

## If you need WalletConnect enabled

Expect that **some Chrome versions may still show** the Local Network prompt. Capture Chrome version + steps and treat it as a **browser / third-party limitation** if it persists after trying the env flag above.

## References

- Plan: [PLAN_COINBASE_CDP_FEEDBACK](https://www.notion.so/wakeuplabs/PLAN_COINBASE_CDP_FEEDBACK-3417b3842f0c80379c41cd4960eefd66) (§4b)
