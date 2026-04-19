# syntax=docker/dockerfile:1
FROM node:20-slim AS base

# Install Chromium via apt — works perfectly on DigitalOcean, no CDN download at runtime
RUN apt-get update && apt-get install -y \
  chromium \
  fonts-liberation \
  --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*

# Tell pdf.ts where to find Chromium
ENV CHROMIUM_PATH=/usr/bin/chromium
# Skip puppeteer's own Chromium download (we use the system one)
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# ---------- deps ----------
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---------- builder ----------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runner ----------
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]
