# Use the official Node.js runtime as the base image
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
# to understand why libc6-compat might be needed
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Environment variable for build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-https://bankingapp-backend-580700595487.europe-west1.run.app}

# Build the application
RUN npm run build


# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Don't run production builds as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy the built application
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=production

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]

# Development stage (optional, can be used with --target dev)
FROM base AS dev
WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
# Give the nextjs user ownership of the app directory
RUN chown -R nextjs:nodejs /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Switch to non-root user
USER nextjs

# Environment variable for build time
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL:-http://host.docker.internal:8080}

EXPOSE 3000

ENV PORT=3000
ENV NODE_ENV=development

CMD ["npm", "run", "dev"]