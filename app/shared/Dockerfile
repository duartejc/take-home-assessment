# Build stage for shared library
FROM node:20-alpine AS shared-builder

WORKDIR /app/shared

# Copy package files
COPY package*.json ./

# Install dependencies (dev + prod, para permitir build)
# Remove package-lock.json to avoid ARM64/x64 conflicts on Mac
RUN rm -f package-lock.json
RUN npm install

# Copy source code
COPY . .

# Build the shared library
RUN npm run build