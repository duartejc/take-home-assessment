import { Router, Request, Response, NextFunction } from 'express';

import { createLogger } from '@/config/logger';
import { statsController } from '@/controllers/statsController';

/**
 * @module statsRoutes
 * @description Routes for API statistics and cache management
 * @version 1.0.0
 */

const router = Router();
const logger = createLogger('stats-routes');

/**
 * @route GET /
 * @description Get comprehensive API statistics
 * @access Public
 * @returns {Object} API statistics and system information
 * @returns {number} totalResources - Total number of resources across all categories
 * @returns {Object} categoryCounts - Count of resources per category
 * @returns {Object} mostPopulatedCategory - Category with most resources
 * @returns {Object} systemInfo - System and runtime information
 * @returns {string} lastUpdated - ISO timestamp of last update
 * @example
 * // GET /api/stats
 * {
 *   "success": true,
 *   "data": {
 *     "totalResources": 87,
 *     "categoryCounts": {
 *       "people": 82,
 *       "films": 6,
 *       "starships": 36,
 *       "vehicles": 39,
 *       "species": 37,
 *       "planets": 60
 *     },
 *     "mostPopulatedCategory": {
 *       "category": "people",
 *       "count": 82
 *     },
 *     "systemInfo": {
 *       "uptime": 123.456,
 *       "memoryUsage": {...},
 *       "nodeVersion": "v18.17.0",
 *       "platform": "linux"
 *     },
 *     "lastUpdated": "2024-01-01T00:00:00.000Z"
 *   },
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 * @throws {500} Internal Server Error - Statistics computation error
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Stats endpoint accessed');
    await statsController.getStats(req, res, next);
  } catch (error) {
    logger.error(`Error in stats route: ${(error as Error).message}`);
    next(error);
  }
});

export default router;
