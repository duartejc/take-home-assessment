import { Request, Response, NextFunction } from 'express';

import { createLogger } from '../config/logger';

const logger = createLogger('error-handler');

const IS_DEV_ENV = process.env.NODE_ENV !== 'production';
const INTERNAL_SERVER_ERROR = 'Internal Server Error';
const SOMETHING_WENT_WRONG = 'Something went wrong';

interface CustomError extends Error {
  statusCode?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
  logger.error({
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip
  });

  const statusCode = err.statusCode ?? 500;
  const message = IS_DEV_ENV ? err.message : SOMETHING_WENT_WRONG;

  res.status(statusCode).json({
    error: err.name || INTERNAL_SERVER_ERROR,
    message
  });
};

export { errorHandler };
