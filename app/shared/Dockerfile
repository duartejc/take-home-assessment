# Build stage for shared library
FROM node:20-alpine AS shared-builder

WORKDIR /app/shared

# Copy package files
COPY package*.json ./

# Install dependencies (dev + prod, para permitir build)
RUN npm ci

# Copy source code
COPY . .

# Build the shared library
RUN npm run build