FROM oven/bun
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1
RUN apt update && apt install python3 python3-pip make g++ -y
WORKDIR /stamp-book

COPY . .
RUN bun install
RUN bun run build

EXPOSE 4444

CMD ["bun", "run", "start"]