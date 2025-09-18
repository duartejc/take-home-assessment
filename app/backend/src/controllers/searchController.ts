import { ApiSearchResponse, SearchResults } from '@swstarter/shared';
import { Request, Response, NextFunction } from 'express';

import { createLogger } from '../config/logger';
import { queueService, QueryData } from '../services/queueService';
import { swapiService } from '../services/swapiService';

const logger = createLogger('search-controller');

class SearchController {
  async search(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { query } = req.query;

      if (!query) {
        logger.warn('Search request without query parameter');
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter is required'
        });
        return;
      }

      if (typeof query !== 'string' || query.trim().length === 0) {
        logger.warn('Invalid query parameter');
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter must be a non-empty string'
        });
        return;
      }

      logger.info(`Processing search request for query: ${query}`);

      const results: SearchResults = await swapiService.search(query.trim());

      // Calculate total results and response time
      const totalResults = results.people.length + results.films.length + results.starships.length + 
                           results.vehicles.length + results.species.length + results.planets.length;
      const responseTime = Date.now() - startTime;

      logger.info(`Search completed. Found ${totalResults} total results in ${responseTime}ms`);

      // Collect query data for statistics
      const queryData: QueryData = {
        query: query.trim(),
        timestamp: Date.now(),
        responseTime,
        resultsCount: totalResults,
      };

      // Add query to processing queue (fire and forget)
      queueService.addQuery(queryData).catch(error => {
        logger.error(`Failed to add query to queue: ${(error as Error).message}`);
      });

      const response: ApiSearchResponse = {
        query: query.trim(),
        totalResults: totalResults,
        results,
        timestamp: new Date().toISOString()
      };

      res.json(response);

    } catch (error) {
      logger.error(`Error in search controller: ${(error as Error).message}`);
      next(error);
    }
  }

  async searchByCategory(req: Request, res: Response, next: NextFunction): Promise<void> {
    const startTime = Date.now();
    
    try {
      const { category } = req.params;
      const { query } = req.query;

      if (!query) {
        logger.warn('Search request without query parameter');
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter is required'
        });
        return;
      }

      if (typeof query !== 'string') {
        logger.warn('Invalid query parameter type');
        res.status(400).json({
          error: 'Bad Request',
          message: 'Query parameter must be a string'
        });
        return;
      }

      const validCategories = ['people', 'films', 'starships', 'vehicles', 'species', 'planets'];
      
      if (!validCategories.includes(category)) {
        logger.warn(`Invalid category requested: ${category}`);
        res.status(400).json({
          error: 'Bad Request',
          message: `Invalid category. Valid categories are: ${validCategories.join(', ')}`
        });
        return;
      }

      logger.info(`Processing search request for category: ${category}, query: ${query}`);

      const searchMethod = `search${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof swapiService;
      const results = await (swapiService[searchMethod])(query.trim()) as Array<unknown>;

      const responseTime = Date.now() - startTime;
      logger.info(`Search completed for ${category}. Found ${results.length} results in ${responseTime}ms`);

      // Collect query data for statistics
      const queryData: QueryData = {
        query: query.trim(),
        category,
        timestamp: Date.now(),
        responseTime,
        resultsCount: results.length,
      };

      // Add query to processing queue (fire and forget)
      queueService.addQuery(queryData).catch(error => {
        logger.error(`Failed to add query to queue: ${(error as Error).message}`);
      });

      res.json({
        category,
        query: query.trim(),
        totalResults: results.length,
        results,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      logger.error(`Error in category search controller: ${(error as Error).message}`);
      next(error);
    }
  }
}

export const searchController = new SearchController();
