FROM node:22-alpine
WORKDIR /app
RUN corepack enable
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --filter @sweety/api...
COPY apps/api apps/api
RUN pnpm --dir apps/api prisma generate && pnpm --dir apps/api build
EXPOSE 5000
CMD ["sh", "-c", "pnpm --dir apps/api prisma migrate deploy && pnpm --dir apps/api start"]
