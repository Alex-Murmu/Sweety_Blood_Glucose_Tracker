FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.33.2 --activate
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/web/package.json apps/web/package.json
COPY apps/api/package.json apps/api/package.json
RUN pnpm install --frozen-lockfile
COPY apps/web apps/web
COPY apps/api apps/api
RUN pnpm --dir apps/web build

FROM nginx:alpine
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
