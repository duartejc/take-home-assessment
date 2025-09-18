import { StatsResponse } from '@swstarter/shared';
import { Request, Response, NextFunction } from 'express';

import { createLogger } from '../config/logger';
import { statsService } from '../services/statsService';

const logger = createLogger('stats-controller');

class StatsController {
  async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Stats endpoint accessed');

      const stats: StatsResponse = await statsService.getStats();

      res.json({
        ...stats,
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      logger.error(`Error in stats controller: ${(error as Error).message}`);
      next(error);
    }
  }
}

export const statsController = new StatsController();
