FROM oven/bun AS base

# Rebuild the source code only when needed
FROM base AS builder
RUN apt update && apt install python3 python3-pip make g++ -y
WORKDIR /stamp-book
COPY . .
RUN bun install

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /stamp-book

ENV NODE_ENV production

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN adduser --system --uid 1001 nextjs

COPY --from=builder /stamp-book/apps/nextjs/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:bun .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:bun /stamp-book/apps/nextjs/.next/standalone ./
COPY --from=builder --chown=nextjs:bun /stamp-book/apps/nextjs/.next/static ./.next/static

USER nextjs

EXPOSE 4444

ENV PORT 4444

# Set hostname to localhost
ENV HOSTNAME "0.0.0.0"

CMD ["bun", "server.js"]