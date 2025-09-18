import 'dotenv/config';
import cors from 'cors';
import express from 'express';

import { createLogger } from './src/config/logger';
import { errorHandler } from './src/middleware/errorHandler';
import { requestLogger } from './src/middleware/requestLogger';
import apiRoutes from './src/routes';

const app = express();
const port = process.env.PORT ?? 3000;
const IS_DEV_ENV = process.env.NODE_ENV !== 'production';
const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';

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
app.get('/', (req, res) => {
  logger.info('Root endpoint accessed');
  res.redirect('/api');
});

// Start server
const server = app.listen(port, () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`Environment: ${IS_DEV_ENV ? 'development' : 'production'}`);
  logger.info(`Log level: ${LOG_LEVEL}`);
});

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
  server.close(() => {
    logger.info('Process terminated');
  });
});
