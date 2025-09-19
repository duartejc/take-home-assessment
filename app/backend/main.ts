import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { Server } from 'http';

import { createLogger } from './src/config/logger';
import { errorHandler } from './src/middleware/errorHandler';
import { requestLogger } from './src/middleware/requestLogger';
import apiRoutes from './src/routes';
import { queueService } from './src/services/queueService';

const PORT = process.env.PORT ?? 3000;
const IS_DEV_ENV = process.env.NODE_ENV !== 'production';
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

const app = express();

// Initialize logger
const logger = createLogger('main');

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(requestLogger);

// Routes
app.use('/api', apiRoutes);

// Global error handler
app.use(errorHandler);

// Root route - redirect to API info
app.get('/', (_req, res) => {
  logger.info('Root endpoint accessed');
  res.redirect('/api');
});

// Start server after initializing queue service
async function startServer(): Promise<void> {
  try {
    // Initialize queue service first
    await initializeQueueService();
    
    // Start HTTP server only after queue service is ready
    const server = app.listen(PORT, () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`Environment: ${IS_DEV_ENV ? 'development' : 'production'}`);
      logger.info(`Log level: ${LOG_LEVEL}`);
      logger.info('All services initialized successfully');
    });

    // Setup graceful shutdown handlers
    setupGracefulShutdown(server);
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
}

// Start the application
void startServer();

// Separate async function for queue service initialization
async function initializeQueueService(): Promise<void> {
  try {
    await queueService.initialize();
    logger.info('Queue service initialized successfully');
  } catch (error) {
    logger.error(`Failed to initialize queue service: ${(error as Error).message}`);
    throw error; // Re-throw to fail server startup if queue service fails
  }
}

// Setup graceful shutdown handlers
function setupGracefulShutdown(server: Server): void {
  // Handle unhandled promise rejections
  process.on('unhandledRejection', (err: Error) => {
    logger.error('Unhandled Rejection! Shutting down...', { error: err });
    server.close(() => {
      process.exit(1);
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (err: Error) => {
    logger.error('Uncaught Exception! Shutting down...', { error: err });
    server.close(() => {
      process.exit(1);
    });
  });

  process.on('SIGTERM', () => {
    logger.info('SIGTERM received. Shutting down gracefully');
    
    // Handle async cleanup without making the callback async
    void (async (): Promise<void> => {
      try {
        await queueService.close();
        logger.info('Queue service closed successfully');
      } catch (error) {
        logger.error(`Error closing queue service: ${(error as Error).message}`);
      }
      
      server.close(() => {
        logger.info('Process terminated');
      });
    })();
  });
}
