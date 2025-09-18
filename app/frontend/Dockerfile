# Build stage for shared library
FROM node:18-alpine AS shared-builder

WORKDIR /app/shared

# Copy shared package files
COPY app/shared/package*.json ./

# Install shared dependencies
RUN npm ci --only=production

# Copy shared source code
COPY app/shared/ .

# Build the shared library
RUN npm run build

# Build stage for frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app

# Copy shared library from shared stage
COPY --from=shared-builder /app/shared ./shared

# Copy frontend package files
COPY app/frontend/package*.json ./frontend/

# Install frontend dependencies
WORKDIR /app/frontend
RUN npm ci

# Copy frontend source code
COPY app/frontend/ .

# Build the frontend for production
RUN npm run build

# Production stage with nginx
FROM nginx:alpine AS frontend-production

# Copy built files from builder stage
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy nginx configuration
COPY app/frontend/nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
