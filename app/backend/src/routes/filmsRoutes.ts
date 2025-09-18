import { Router } from 'express';

import { createLogger } from '@/config/logger';
import { filmsController } from '@/controllers/filmsController';

const logger = createLogger('films-routes');
const router = Router();

/**
 * @module filmsRoutes
 * @description Routes for fetching individual films by ID
 * @version 1.0.0
 */

/**
 * GET /api/films/:id
 * @description Get a film by its ID
 * @param {string} id - The ID of the film to retrieve
 * @returns {Film} The film data
 * @example
 * GET /api/films/1
 */
router.get('/:id', async (req, res) => {
  logger.info('Film endpoint accessed');
  await filmsController.getFilmById(req, res);
});

export default router;
