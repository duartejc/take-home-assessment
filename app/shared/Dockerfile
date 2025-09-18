# Build stage for shared library
FROM node:18-alpine AS shared-builder

WORKDIR /app/shared

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build the shared library
RUN npm run build