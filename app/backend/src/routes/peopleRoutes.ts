import { Router } from 'express';

import { createLogger } from '@/config/logger';
import { peopleController } from '@/controllers/peopleController';

const logger = createLogger('people-routes');
const router = Router();

/**
 * @module peopleRoutes
 * @description Routes for fetching individual people by ID
 * @version 1.0.0
 */

/**
 * GET /api/people/:id
 * @description Get a person by their ID
 * @param {string} id - The ID of the person to retrieve
 * @returns {Person} The person data
 * @example
 * GET /api/people/1
 */
router.get('/:id', async (req, res) => {
  logger.info('Person endpoint accessed');
  await peopleController.getPersonById(req, res);
});

export default router;
