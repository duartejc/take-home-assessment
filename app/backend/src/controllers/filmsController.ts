import { Film } from '@swstarter/shared';
import { Request, Response } from 'express';

import { createLogger } from '@/config/logger';
import { swapiService } from '@/services/swapiService';

const logger = createLogger('films-controller');

class FilmsController {
  
  async getFilmById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        logger.warn('Film request without ID parameter');
        res.status(400).json({
          error: 'Bad Request',
          message: 'ID parameter is required'
        });
        return;
      }

      if (typeof id !== 'string' || id.trim().length === 0) {
        logger.warn('Invalid ID parameter');
        res.status(400).json({
          error: 'Bad Request',
          message: 'ID parameter must be a non-empty string'
        });
        return;
      }

      logger.info(`Processing film request for ID: ${id}`);

      const film: Film = await swapiService.getFilmById(id);

      logger.info(`Film retrieved successfully for ID: ${id}`);

      res.json(film);

    } catch (error) {
      logger.error(`Error in films controller: ${(error as Error).message}`);
      
      // Handle 404 errors specifically
      if ((error as { response: { status: number } }).response?.status === 404) {
        res.status(404).json({
          error: 'Not Found',
          message: `Film with ID ${req.params.id} not found`
        });
        return;
      }

      res.status(500).json({
        error: 'Internal Server Error',
        message: 'Failed to retrieve film data'
      });
    }
  }
}

export const filmsController = new FilmsController();
