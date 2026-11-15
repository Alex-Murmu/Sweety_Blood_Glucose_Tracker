FROM node:22-alpine
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.33.2 --activate
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
COPY apps/web/package.json apps/web/package.json
COPY apps/api/prisma apps/api/prisma
RUN pnpm install --frozen-lockfile
COPY apps/api apps/api
COPY apps/web apps/web
RUN pnpm --filter @sweety/api exec prisma generate && cd apps/api && pnpm build
EXPOSE 5000
CMD ["sh", "-c", "cd apps/api && pnpm prisma migrate deploy && pnpm start"]
