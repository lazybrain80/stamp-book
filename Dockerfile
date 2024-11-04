FROM oven/bun AS base

# Rebuild the source code only when needed
FROM base AS builder
RUN apt update && apt install python3 python3-pip make g++ -y
WORKDIR /stamp-book
COPY . .
RUN bun install

# Disable telemetry during the build
ENV NEXT_TELEMETRY_DISABLED 1

RUN bun run build

# Production image, copy all the files and run next
FROM base AS runner
RUN apt update && apt install python3 python3-pip make g++ -y
WORKDIR /stamp-book
EXPOSE 4444
ENV NODE_ENV production

# Disable telemetry
ENV NEXT_TELEMETRY_DISABLED 1

RUN mkdir .next
COPY ./package_production.json ./package.json
COPY .env.production .
RUN bun install

COPY ./apps/nextjs/public ./public
COPY --from=builder /stamp-book/apps/nextjs/.next/server .next/server
COPY --from=builder /stamp-book/apps/nextjs/.next/static .next/static
COPY --from=builder /stamp-book/apps/nextjs/.next/types .next/types
COPY --from=builder /stamp-book/apps/nextjs/.next/app-build-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/app-path-routes-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/BUILD_ID .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/build-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/export-marker.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/images-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/next-minimal-server.js.nft.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/next-server.js.nft.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/package.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/prerender-manifest.js .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/prerender-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/react-loadable-manifest.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/required-server-files.json .next/
COPY --from=builder /stamp-book/apps/nextjs/.next/routes-manifest.json .next/

# RUN bun add dotenv-cli@7.3.0
# RUN bun add turbo@1.13.3

CMD ["bun", "run", "start"]