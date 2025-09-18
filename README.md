# SWStarter - Take Home Assessment

Full-stack project with Node.js/TypeScript backend, React/TypeScript frontend, and shared library.

## Project Structure

```
app/
├── backend/          # Node.js/Express API
├── frontend/         # React/Vite Application
└── shared/           # Shared types and utilities
```

## Prerequisites

- Docker
- Docker Compose
- Node.js 18+ (for local development)

## Docker Setup

### 1. Build and start all services

```bash
docker compose up --build
```

### 2. Access the applications

- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:3000

### 3. Stop the services

```bash
docker compose down
```

### 4. Useful commands

```bash
# Rebuild and start services
docker compose up --build --force-recreate

# View service logs
docker compose logs -f

# View logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Stop services and remove volumes
docker compose down -v

# Build only images
docker compose build

# Start services in detached mode
docker compose up -d
```

## Local Development

### Backend

```bash
cd app/backend
npm install
npm run dev
```

### Frontend

```bash
cd app/frontend
npm install
npm run dev
```

### Shared Library

```bash
cd app/shared
npm install
npm run build
```

## Environment Variables

### Backend (.env)
```
NODE_ENV=development
PORT=3000
LOG_LEVEL=info
CORS_ORIGIN=http://localhost:8080
```

### Frontend (.env)
```
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000
VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEBUG_MODE=false
```

## Docker Architecture

### Services

1. **shared**: Shared library (build stage)
2. **backend**: Node.js/TypeScript API
3. **frontend**: React application served by Nginx

### Ports

- **8080**: Frontend (Nginx)
- **3000**: Backend API

### Network

- Services communicate through the `swstarter-network`
- Frontend proxies `/api` requests to the backend

## Multi-stage Build

The project uses multi-stage build to optimize image sizes:

1. **Stage 1**: Build shared library
2. **Stage 2**: Build backend (depends on shared)
3. **Stage 3**: Build frontend (depends on shared)
4. **Stage 4**: Optimized production images

## Compatibility

- **Mac**: Compatible with macOS (uses `docker compose`)
- **Linux**: Compatible with Linux distributions
- **Windows**: Compatible with Windows (Docker Desktop)

## Troubleshooting

### Common Issues

1. **Ports already in use**: Check if ports 3000 and 8080 are available
2. **Permissions**: On Linux/Mac, you may need to adjust file permissions
3. **Docker cache**: Use `--no-cache` if there are issues with old builds

### Clean Docker Environment

```bash
# Stop all containers
docker compose down

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove everything (be careful!)
docker system prune -a
```

## Useful Scripts

```bash
# Check container status
docker compose ps

# Execute command in a container
docker compose exec backend npm test
docker compose exec frontend npm run build

# Access container shell
docker compose exec backend sh
docker compose exec frontend sh
```
