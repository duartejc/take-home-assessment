import morgan from 'morgan';

import { createLogger } from '@/config/logger';

const logger = createLogger('http-requests');

const requestLogger = morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim())
  }
});

export { requestLogger };
