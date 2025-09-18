import { Router, Request, Response, NextFunction } from 'express';

import { createLogger } from '../config/logger';
import { searchController } from '../controllers/searchController';

/**
 * @module searchRoutes
 * @description Routes for searching Star Wars API data
 * @version 1.0.0
 */

const router = Router();
const logger = createLogger('search-routes');

/**
 * @route GET /
 * @description Search across all Star Wars categories
 * @access Public
 * @param {string} query.query - Search term (required)
 * @returns {Object} Search results with categorized data
 * @returns {string} query - The search term used
 * @returns {number} totalResults - Total number of results found
 * @returns {Object} results - Results categorized by type
 * @returns {string} timestamp - ISO timestamp of the request
 * @example
 * // GET /api/search?query=Luke
 * {
 *   "query": "Luke",
 *   "totalResults": 5,
 *   "results": {
 *     "people": [...],
 *     "films": [...],
 *     "starships": [...],
 *     "vehicles": [...],
 *     "species": [...],
 *     "planets": [...]
 *   },
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 * @throws {400} Bad Request - Missing or invalid query parameter
 * @throws {500} Internal Server Error - SWAPI service error
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    logger.info('Search endpoint accessed');
    await searchController.search(req, res, next);
  } catch (error) {
    logger.error(`Error in search route: ${(error as Error).message}`);
    next(error);
  }
});

/**
 * @route GET /:category
 * @description Search within a specific Star Wars category
 * @access Public
 * @param {string} category.params - Category to search (people|films|starships|vehicles|species|planets)
 * @param {string} query.query - Search term (required)
 * @returns {Object} Search results for the specified category
 * @returns {string} category - The category searched
 * @returns {string} query - The search term used
 * @returns {number} totalResults - Number of results found
 * @returns {Array} results - Array of search results
 * @returns {string} timestamp - ISO timestamp of the request
 * @example
 * // GET /api/search/people?query=Skywalker
 * {
 *   "category": "people",
 *   "query": "Skywalker",
 *   "totalResults": 3,
 *   "results": [...],
 *   "timestamp": "2024-01-01T00:00:00.000Z"
 * }
 * @throws {400} Bad Request - Missing query parameter or invalid category
 * @throws {500} Internal Server Error - SWAPI service error
 */
router.get('/:category', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    logger.info(`Category search endpoint accessed for category: ${category}`);
    await searchController.searchByCategory(req, res, next);
  } catch (error) {
    logger.error(`Error in category search route: ${(error as Error).message}`);
    next(error);
  }
});

export default router;
