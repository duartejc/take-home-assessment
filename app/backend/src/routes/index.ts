import { Router } from 'express';

import filmsRoutes from './filmsRoutes';
import peopleRoutes from './peopleRoutes';
import searchRoutes from './searchRoutes';
import statsRoutes from './statsRoutes';

/**
 * @module routes
 * @description Main router module that aggregates all API routes
 * @version 1.0.0
 * @example
 * // Usage in main.ts
 * import apiRoutes from '@/routes';
 * app.use('/api', apiRoutes);
 */

const router = Router();

router.use('/films', filmsRoutes);
router.use('/search', searchRoutes);
router.use('/stats', statsRoutes);
router.use('/people', peopleRoutes);

export default router;
