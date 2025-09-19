# Build stage for shared library
FROM node:20-alpine AS shared-builder

WORKDIR /app/shared

# Copy shared package files
COPY app/shared/package*.json ./

# Install dependencies (dev + prod, para permitir build)
# Remove package-lock.json to avoid ARM64/x64 conflicts on Mac
RUN rm -f package-lock.json
RUN npm install

# Copy shared source code
COPY app/shared/ .

# Build the shared library
RUN npm run build


# Build stage for backend
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY app/backend/package*.json ./

# Install dependencies (dev + prod, para permitir build)
# Remove package-lock.json to avoid ARM64/x64 conflicts on Mac
RUN rm -f package-lock.json
RUN npm install

# Copy backend source code
COPY app/backend/ .

# Copy shared library from shared-builder
COPY --from=shared-builder /app/shared ../shared

# Build backend
RUN npm run build


# Production stage
FROM node:20-alpine AS backend-production

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S backend -u 1001

# Create logs directory with proper permissions
RUN mkdir -p /app/logs && chown backend:nodejs /app/logs

# Copy built application and deps
COPY --from=backend-builder --chown=backend:nodejs /app/backend/dist ./dist
COPY --from=backend-builder --chown=backend:nodejs /app/backend/node_modules ./node_modules
COPY --from=backend-builder --chown=backend:nodejs /app/backend/package*.json ./
COPY --from=backend-builder --chown=backend:nodejs /app/shared ./shared
COPY --from=backend-builder --chown=backend:nodejs /app/backend/tsconfig.json ./tsconfig.json

# Switch to non-root user
USER backend

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
