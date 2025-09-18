import winston from 'winston';

const LOG_LEVEL = process.env.LOG_LEVEL ?? 'info';
const LOG_DIR = process.env.LOG_DIR ?? 'logs';
const IS_DEV_ENV = process.env.NODE_ENV !== 'production';

const createLogger = (service: string = 'api'): winston.Logger => {
  const logger = winston.createLogger({
    level: LOG_LEVEL,
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.errors({ stack: true }),
      winston.format.json()
    ),
    defaultMeta: { service },
    transports: [
      new winston.transports.File({ 
        filename: `${LOG_DIR}/error.log`, 
        level: 'error' 
      }),
      new winston.transports.File({ 
        filename: `${LOG_DIR}/combined.log` 
      }),
    ],
  });

  // Log to console while in development
  if (IS_DEV_ENV) {
    logger.add(new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }));
  }

  return logger;
};

export { createLogger };
