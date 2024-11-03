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
#FROM base AS runner
#WORKDIR /stamp-book
EXPOSE 4444
ENV NODE_ENV production

# Disable telemetry
#ENV NEXT_TELEMETRY_DISABLED 1
#RUN mkdir apps
#RUN mkdir apps/nextjs
#RUN mkdir apps/nextjs/.next
#COPY --from=builder /stamp-book/apps/nextjs/public apps/nextjs/
#COPY --from=builder /stamp-book/apps/nextjs/.next/standalone apps/nextjs/.next/
#COPY --from=builder /stamp-book/apps/nextjs/.next/static apps/nextjs/.next/static
#COPY ./apps/nextjs/package.json apps/nextjs/
#COPY ./.env.production .

#RUN cd apps/nextjs

CMD ["bun", "run", "start"]