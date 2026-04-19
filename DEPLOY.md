# Deployment Guide — GitHub Student Pack

## What you get (and how to claim it)

### 1. Free domain — Namecheap or Name.com
Both are in the Student Pack. Pick one:

| Registrar | Offer | Best for |
|-----------|-------|----------|
| **Namecheap** | 1 free `.me` + SSL | `resumeai.me`, `atsboost.me` |
| **Name.com** | 1 free domain across `.dev`, `.app`, `.software`, `.live`, etc. | `resumeai.dev`, `resumeai.app` |

**Steps:**
1. Go to [education.github.com/pack](https://education.github.com/pack) → find Namecheap or Name.com
2. Click "Get access" — it redirects with your student token
3. Search for and claim your domain (suggested: `resumeai.me` or `resumeai.dev`)
4. After deploying to DigitalOcean (step 3 below), point the domain's DNS there

---

### 2. DigitalOcean — $200 credit (~16 months free)

**Claim:**
1. GitHub Student Pack page → DigitalOcean → "Get access"
2. Creates a DigitalOcean account with $200 credit applied automatically

**Deploy the app:**

```bash
# Install doctl (DigitalOcean CLI)
# macOS:  brew install doctl
# Windows: winget install DigitalOcean.doctl

# Authenticate
doctl auth init

# Push your code to GitHub first, then:
doctl apps create --spec .do/app.yaml
```

Or use the DigitalOcean dashboard:
1. New → App → Connect GitHub repo → select `ats-resume-optimizer`
2. DigitalOcean detects the `Dockerfile` automatically
3. Set environment variables (see list below)
4. Deploy — first build takes ~5 min

**Set these env vars in the DO dashboard (App → Settings → Environment Variables):**

| Variable | Where to get it |
|----------|----------------|
| `ANTHROPIC_API_KEY` | console.anthropic.com |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys |
| `STRIPE_PRICE_ID` | Stripe Dashboard → Products → your $9.99 product |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe Dashboard → Developers → API keys |
| `NEXT_PUBLIC_APP_URL` | Your domain or the `.ondigitalocean.app` URL |

**Connect your custom domain:**
1. DigitalOcean App → Settings → Domains → Add domain
2. Enter your Namecheap/Name.com domain (e.g. `resumeai.me`)
3. DigitalOcean gives you a CNAME target
4. In your registrar's DNS, add: `CNAME @ → <do-target>`
5. SSL is provisioned automatically (Let's Encrypt)

**Cost breakdown with $200 credit:**

| Resource | Monthly cost | Months free |
|----------|-------------|-------------|
| `apps-s-1vcpu-1gb` (1 container) | $12 | **16 months** |

---

### 3. Stripe — Waived fees on first $1,000 revenue

Normally Stripe charges 2.9% + $0.30 per transaction.
On a $9.99 sale that's ~$0.59 per transaction.
The Student Pack waives this on your first $1,000 — saving you ~$59 (~100 sales).

**Claim:**
1. GitHub Student Pack → Stripe → "Get access"
2. Sign into or create your Stripe account
3. The credit is applied automatically to your account

---

## Why DigitalOcean over Vercel for this app

| | Vercel (Hobby) | Vercel (Pro) | DigitalOcean |
|---|---|---|---|
| **Cost** | Free | $20/mo | $12/mo ($0 with credit) |
| **Function timeout** | 10s ❌ | 60s ✓ | Unlimited ✓ |
| **Puppeteer** | Requires chromium-min workaround | Requires chromium-min workaround | Native apt Chromium ✓ |
| **PDF reliability** | Cold-start latency | Better | Best ✓ |
| **Custom domain SSL** | ✓ | ✓ | ✓ (Let's Encrypt) |

The `Dockerfile` in this repo installs Chromium via `apt` — no CDN download at runtime, no bundle size tricks, no timeout worries.

---

## Quick checklist

- [ ] Claimed domain on Namecheap or Name.com
- [ ] Created DigitalOcean account with $200 credit
- [ ] Pushed code to GitHub
- [ ] Created DO App from GitHub repo
- [ ] Set all 5 environment variables in DO dashboard
- [ ] Pointed domain DNS → DigitalOcean CNAME
- [ ] Claimed Stripe Student Pack deal
- [ ] Created $9.99 Stripe product and copied Price ID into env vars
- [ ] Tested end-to-end: optimize → checkout → PDF download
