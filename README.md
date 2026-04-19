# ATS Resume Optimizer

AI-powered resume rewriter that beats applicant tracking systems. Built with Next.js 15, Claude AI, Stripe, and Puppeteer.

## Folder Structure

```
ats-resume-optimizer/
├── app/
│   ├── layout.tsx              # Root layout with nav/footer
│   ├── page.tsx                # Landing page
│   ├── globals.css
│   ├── optimize/
│   │   └── page.tsx            # Main tool (3-step flow)
│   ├── success/
│   │   └── page.tsx            # Post-payment PDF download
│   └── api/
│       ├── optimize/route.ts   # Claude AI optimization
│       ├── generate-pdf/route.ts  # Puppeteer PDF generation
│       ├── create-checkout/route.ts  # Stripe checkout session
│       └── parse-pdf/route.ts  # PDF text extraction
├── components/
│   ├── ResumeForm.tsx          # Step 1: resume + JD input
│   └── ResumePreview.tsx       # Step 3: preview + pay button
├── lib/
│   ├── types.ts                # Shared TypeScript types
│   ├── claude.ts               # Anthropic SDK + prompt
│   ├── stripe.ts               # Stripe helpers
│   ├── pdf.ts                  # Puppeteer PDF generation
│   └── resume-template.ts      # ATS-safe HTML template
├── vercel.json                 # Function timeouts/memory
├── next.config.mjs
└── .env.local.example
```

## Quick Start (Local Dev)

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in keys
cp .env.local.example .env.local

# 3. Run dev server
npm run dev
```

Open http://localhost:3000

> **Chrome required locally** — PDF generation uses your system Chrome. Update the path in `lib/pdf.ts` if needed.

## Environment Variables

| Variable | Description |
|---|---|
| `ANTHROPIC_API_KEY` | From console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe dashboard → Developers → API keys |
| `STRIPE_PRICE_ID` | Create a one-time $9.99 product in Stripe |
| `NEXT_PUBLIC_APP_URL` | Your deployed URL (e.g. https://resumeai.vercel.app) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Stripe Setup

1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. Create a Product: "ATS Resume PDF Download", $9.99 one-time
3. Copy the **Price ID** → `STRIPE_PRICE_ID`
4. Copy **Secret key** → `STRIPE_SECRET_KEY`
5. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add ANTHROPIC_API_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add STRIPE_PRICE_ID
vercel env add NEXT_PUBLIC_APP_URL
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

# Redeploy with env vars
vercel --prod
```

### Vercel Requirements

- **Vercel Pro plan** recommended — PDF generation needs 60s timeout and 1024 MB RAM (configured in `vercel.json`)
- Hobby plan max timeout is 10s which is too short for Puppeteer
- The Chromium binary is downloaded at runtime from GitHub Releases (configured in `lib/pdf.ts`) — no cold-start bundle size issue

### Alternative: Use Vercel Hobby

If you want to stay on Hobby, replace Puppeteer with a client-side PDF approach:
1. Remove `app/api/generate-pdf` and `lib/pdf.ts`
2. In `ResumePreview.tsx`, use `window.print()` with `@media print` CSS
3. Or integrate [PDFShift](https://pdfshift.io) API (paid, no serverless limits)

## User Flow

```
Landing Page (/)
    ↓
/optimize  →  Paste resume + JD
    ↓ (30s Claude API call)
Preview + metrics (ATS score, keywords added)
    ↓ (click "Download PDF")
Stripe Checkout ($9.99)
    ↓ (payment success)
/success?session_id=...&oid=...
    ↓ (verify payment + generate PDF)
Download PDF
```

## How Payment Works (No Database)

1. After AI optimization, resume JSON is saved to `localStorage` with a UUID key
2. Checkout session is created with that UUID in metadata
3. Stripe redirects to `/success?session_id=xxx&oid=UUID`
4. Success page reads resume from `localStorage`, sends to `/api/generate-pdf`
5. API verifies payment via Stripe, generates PDF, streams it back
6. `localStorage` entry is cleaned up after download

This approach requires no database for MVP. For scale, replace localStorage with Redis/KV.

## Customization

### Pricing
Change price in Stripe dashboard. No code change needed.

### AI Model
Edit `lib/claude.ts` → change `model: "claude-sonnet-4-6"` to any Claude model.

### Resume Template
Edit `lib/resume-template.ts` to adjust the HTML/CSS layout. The template is intentionally minimal for ATS compatibility.

### Branding
- Company name: search for "ResumeAI" across `app/` files
- Colors: `tailwind.config.ts` → `brand` colors
