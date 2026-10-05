FROM node:22-bookworm-slim

WORKDIR /app
RUN corepack enable

COPY package.json pnpm-lock.yaml patches/ ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build

ENV NODE_ENV=production
EXPOSE 3000

CMD ["sh", "-c", "pnpm drizzle-kit migrate && pnpm start"]
