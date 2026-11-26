# Ammora Token Radar

A Vite + React starter for a read-only Ammora SDK dashboard on GIWA Sepolia.

## Included
- Exact dependency pin: `@ammora-protocol/sdk@0.3.9`
- Official SDK deployment catalog import: `giwaSepoliaAutoRouteDeployment`
- Chain / protocol deployment details from the SDK catalog
- Injected EIP-1193 wallet connection and GIWA Sepolia network switch request
- Responsive dark dashboard UI
- No fabricated token rows, no private keys, and no transaction sending

## Requirements
- Node.js 22 or 24
- MetaMask or another EIP-1193 wallet (optional for viewing)

## Run locally

```bash
npm install
npm run dev
```

## Build for hosting

```bash
npm run build
npm run preview
```

Deploy the generated `dist/` directory to Vercel, Netlify, or Cloudflare Pages. For Vercel, framework preset Vite and output directory `dist`.

## Important next integration
The Launch Explorer is intentionally an honest empty state. Connect it to a documented Ammora data/indexer API only after confirming the official API client and methods in the current docs/examples. Do not hardcode invented endpoints or fake token/launch records.

## Safety
- GIWA Sepolia testnet only (chain ID 91342).
- This starter does not create Configs, issue tokens, trade, or submit transactions.
- Never put a seed phrase/private key in frontend code, `.env`, or GitHub.
- SDK package installation is not proof that an on-chain action succeeded.

## Official references
- SDK quickstart: https://docs.ammora.org/guides/sdk-quickstart
- SDK examples: https://docs.ammora.org/examples
- Launchpad guide: https://docs.ammora.org/guides/launchpad
- SDK package: https://www.npmjs.com/package/@ammora-protocol/sdk
