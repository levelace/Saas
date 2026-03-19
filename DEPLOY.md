# LEVELACE — Full Deployment Guide

## Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Database**: PostgreSQL via Neon (recommended) or Vercel Postgres
- **Auth**: NextAuth.js v4 (credentials + optional OAuth)
- **Payments**: Stripe (subscriptions + webhook lifecycle)
- **Email**: Resend
- **Deployment**: Vercel

---

## Step 1 — Clone & Install

```bash
git init
git add .
git commit -m "Initial commit"
# Push to GitHub/GitLab

npm install
```

---

## Step 2 — Database (Neon — recommended free tier)

1. Go to https://neon.tech → Create project → Copy connection string
2. Add to `.env`:
   ```
   DATABASE_URL="postgresql://user:pass@host/levelace?sslmode=require"
   ```
3. Run:
   ```bash
   npx prisma db push        # creates all tables
   npx prisma generate       # generates client
   npx prisma studio         # optional: view data
   ```

---

## Step 3 — NextAuth Secret

```bash
openssl rand -base64 32
# Copy output → NEXTAUTH_SECRET in .env
```

---

## Step 4 — Stripe Setup

### 4a. Create Products
1. Go to https://dashboard.stripe.com/products
2. Create 3 products:
   - **Starter** — $149/month recurring → copy Price ID → `STRIPE_PRICE_STARTER`
   - **Professional** — $499/month recurring → copy Price ID → `STRIPE_PRICE_PROFESSIONAL`
   - **Enterprise** — (optional, custom pricing) → `STRIPE_PRICE_ENTERPRISE`

### 4b. API Keys
- Dashboard → Developers → API Keys
- Copy **Secret key** → `STRIPE_SECRET_KEY`
- Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

### 4c. Webhook (after deploying)
1. Dashboard → Developers → Webhooks → Add endpoint
2. URL: `https://ilevelace.com/api/stripe/webhook`
3. Events to listen for:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy **Signing secret** → `STRIPE_WEBHOOK_SECRET`

### 4d. Billing Portal
1. Dashboard → Settings → Billing Portal → Activate
2. Configure cancellation and plan switching options

---

## Step 5 — Resend (Email)

1. Go to https://resend.com → Create account
2. Add your domain: `ilevelace.com` → follow DNS verification steps
3. API Keys → Create → copy → `RESEND_API_KEY`
4. Set `EMAIL_FROM="LEVELACE <hello@ilevelace.com>"`
5. Set `EMAIL_TO="hello@ilevelace.com"` (receives contact form notifications)

---

## Step 6 — Deploy to Vercel

### 6a. Connect repo
```bash
npm i -g vercel
vercel login
vercel link   # links to Vercel project
```

Or: Go to https://vercel.com/new → Import Git repository

### 6b. Set Environment Variables
In Vercel Dashboard → Project → Settings → Environment Variables, add ALL from `.env.example`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon/Supabase connection string |
| `NEXTAUTH_SECRET` | Generated secret (openssl rand -base64 32) |
| `NEXTAUTH_URL` | `https://ilevelace.com` |
| `STRIPE_SECRET_KEY` | sk_live_... |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | pk_live_... |
| `STRIPE_WEBHOOK_SECRET` | whsec_... (add after first deploy) |
| `STRIPE_PRICE_STARTER` | price_... |
| `STRIPE_PRICE_PROFESSIONAL` | price_... |
| `STRIPE_PRICE_ENTERPRISE` | price_... |
| `RESEND_API_KEY` | re_... |
| `EMAIL_FROM` | LEVELACE <hello@ilevelace.com> |
| `EMAIL_TO` | hello@ilevelace.com |
| `NEXT_PUBLIC_APP_URL` | https://ilevelace.com |

### 6c. Deploy
```bash
vercel --prod
```

### 6d. Custom Domain
1. Vercel Dashboard → Project → Domains → Add `ilevelace.com`
2. Add DNS records at your registrar:
   - `A` record: `@` → Vercel IP (shown in dashboard)
   - `CNAME`: `www` → `cname.vercel-dns.com`

---

## Step 7 — Post-Deploy Checklist

- [ ] Site loads at https://ilevelace.com
- [ ] Register a test account → verify redirect to dashboard
- [ ] Submit contact form → verify email received
- [ ] Test Stripe checkout (use test card `4242 4242 4242 4242`)
- [ ] Add Stripe webhook URL → paste `whsec_...` into env → redeploy
- [ ] Verify webhook fires on test purchase (Stripe Dashboard → Webhooks → Recent events)
- [ ] Test API endpoint:
  ```bash
  curl -X POST https://ilevelace.com/api/fraud/analyze \
    -H "Authorization: Bearer YOUR_API_KEY" \
    -H "Content-Type: application/json" \
    -d '{"txId":"TEST_001","amount":500,"country":"US"}'
  ```

---

## Local Development

```bash
cp .env.example .env.local
# Fill in values

npm run dev           # starts on localhost:3000
npm run db:studio     # Prisma Studio on localhost:5555

# Stripe webhook local testing:
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Project Structure Summary

```
src/
├── app/
│   ├── (marketing)/          Public site (/, /pricing, /policies)
│   ├── auth/                 Login, register, error pages
│   ├── dashboard/            Protected SaaS dashboard
│   │   ├── page.tsx          Overview + stats
│   │   ├── cases/            Fraud case table + filters
│   │   ├── api-keys/         API key management
│   │   └── billing/          Stripe subscription management
│   └── api/
│       ├── auth/             NextAuth + register
│       ├── contact/          Contact form → email
│       ├── stripe/           Checkout, portal, webhook
│       ├── fraud/            Analyze, cases CRUD, stats
│       └── keys/             API key CRUD
├── components/
│   ├── layout/               Nav + footer
│   ├── sections/             Hero, products, flagship, policies, contact
│   ├── dashboard/            Sidebar, header, billing actions
│   └── ui/                   Toaster
└── lib/
    ├── auth.ts               NextAuth config
    ├── prisma.ts             DB client
    ├── stripe.ts             Stripe client + plans
    ├── fraud-engine.ts       Risk scoring engine
    ├── email.ts              Resend email templates
    └── utils.ts              cn, rate limit, API key gen
```

---

## Security Notes

- All API routes validate auth (session OR API key via Bearer token)
- API keys are stored as SHA-256 hashes — raw key shown once
- Rate limiting on all public endpoints (in-memory; swap for Upstash Redis in production)
- NEXTAUTH_SECRET must be >= 32 bytes
- Stripe webhook signature verified on every event
- CSP headers set in next.config.js
- Password hashed with bcrypt (12 rounds)
