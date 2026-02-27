# Stage 1: Build React client
FROM node:22-alpine AS client-build
WORKDIR /app/client
COPY client/package.json client/package-lock.json* ./
RUN npm ci
COPY client/ .
RUN npm run build

# Stage 2: Install server dependencies
FROM node:22-alpine AS server-deps
WORKDIR /app/server
COPY server/package.json server/package-lock.json* ./
RUN npm ci --omit=dev

# Stage 3: Production image
FROM node:22-alpine
RUN addgroup -S dasboot && adduser -S dasboot -G dasboot
WORKDIR /app

COPY --from=server-deps /app/server/node_modules ./server/node_modules
COPY server/ ./server/
COPY --from=client-build /app/client/dist ./client/dist

RUN mkdir -p /app/server/data && chown -R dasboot:dasboot /app

USER dasboot

EXPOSE 3001
ENV NODE_ENV=production
CMD ["node", "server/index.js"]
