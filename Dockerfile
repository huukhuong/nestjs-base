FROM node:22-alpine AS builder

WORKDIR /app

RUN corepack enable
RUN apk add --no-cache python3 make g++

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm build
RUN pnpm rebuild better-sqlite3
RUN pnpm prune --prod --ignore-scripts

FROM node:22-alpine AS runner

WORKDIR /app

RUN apk add --no-cache libstdc++

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

ENV NODE_ENV=production

CMD ["node", "dist/src/main.js"]
