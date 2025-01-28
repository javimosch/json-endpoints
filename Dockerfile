# Build stage
FROM oven/bun:1-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Copy source code
COPY . .

# Build the frontend
RUN bun run build

# Production stage
FROM denoland/deno:alpine

WORKDIR /app

# Copy server files
COPY --from=builder /app/server/deno.json /app/server/
COPY --from=builder /app/server/index.ts /app/server/

# Copy frontend build
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3000

# Set production environment
ENV NODE_ENV=production

# Cache the dependencies
RUN cd server && deno cache index.ts

# Start the server
CMD ["deno", "run", "--allow-net", "--allow-read", "--allow-env", "server/index.ts"]
