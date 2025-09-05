# Dependency stage
FROM node:20-alpine AS dependencies

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
COPY apps/client/package.json apps/client/package.json
COPY apps/server/package.json apps/server/package.json
COPY libs/shared/package.json libs/shared/package.json

RUN npm ci --workspaces

# Builder stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY --from=dependencies /app/node_modules node_modules/
COPY package.json ./
COPY package-lock.json ./
COPY tsconfig.base.json ./
COPY apps apps/
COPY libs libs/

RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

COPY package.json ./
COPY package-lock.json ./
COPY apps/client/package.json apps/client/package.json
COPY apps/server/package.json apps/server/package.json
COPY libs/shared/package.json libs/shared/package.json

# Install only production dependencies
RUN npm ci --workspaces --omit=dev

COPY --from=builder /app/dist dist/
COPY --from=builder /app/libs/shared/dist libs/shared/dist/

EXPOSE 3000

CMD ["npm", "start"]
