import { swapiService } from './swapiService';

import { createLogger } from '../config/logger';
import { StatsResponse } from '@swstarter/shared';

import { queueService } from './queueService';

const logger = createLogger('stats-service');

interface CachedStats {
  data: StatsResponse['data'];
  timestamp: number;
}

interface CategoryCount {
  people: number;
  films: number;
  starships: number;
  vehicles: number;
  species: number;
  planets: number;
}

interface MostPopulatedCategory {
  category: string;
  count: number;
}

class StatsService {
  private cache: Map<string, CachedStats>;
  private cacheTimeout: number;

  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes cache
  }

  async getStats(): Promise<StatsResponse> {
    try {
      // Get query statistics from BullMQ
      const queryStats = await queueService.getComputedStats();
      
      // Get sample data from each category to compute stats
      const [people, films, starships, vehicles, species, planets] = await Promise.allSettled([
        this.getCategoryCount('people'),
        this.getCategoryCount('films'),
        this.getCategoryCount('starships'),
        this.getCategoryCount('vehicles'),
        this.getCategoryCount('species'),
        this.getCategoryCount('planets'),
      ]);

      const categoryCounts: CategoryCount = {
        people: people.status === 'fulfilled' ? people.value : 0,
        films: films.status === 'fulfilled' ? films.value : 0,
        starships: starships.status === 'fulfilled' ? starships.value : 0,
        vehicles: vehicles.status === 'fulfilled' ? vehicles.value : 0,
        species: species.status === 'fulfilled' ? species.value : 0,
        planets: planets.status === 'fulfilled' ? planets.value : 0,
      };

      const statsData: StatsResponse['data'] = {
        totalResources: this.sumSuccessfulResults([people, films, starships, vehicles, species, planets]),
        categoryCounts,
        mostPopulatedCategory: this.getMostPopulatedCategory(categoryCounts),
        systemInfo: {
          uptime: process.uptime(),
          memoryUsage: process.memoryUsage(),
          nodeVersion: process.version,
          platform: process.platform,
        },
        queryStats: queryStats ? {
          topQueries: queryStats.topQueries,
          averageResponseTime: queryStats.averageResponseTime,
          popularHours: queryStats.popularHours,
          totalQueries: queryStats.totalQueries,
          lastComputed: new Date(queryStats.lastComputed).toISOString(),
        } : {
          topQueries: [],
          averageResponseTime: 0,
          popularHours: [],
          totalQueries: 0,
          lastComputed: null,
        },
        lastUpdated: new Date().toISOString(),
      };

      logger.info('Stats computed successfully');
      return {
        success: true,
        data: statsData,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      logger.error(`Error computing stats: ${(error as Error).message}`);
      throw error;
    }
  }

  async getCategoryCount(category: string): Promise<number> {
    try {
      const searchMethod = `search${category.charAt(0).toUpperCase() + category.slice(1)}` as keyof typeof swapiService;
      // Search with empty string to get all items
      const results = await (swapiService[searchMethod] as Function)('');
      return results.length;
    } catch (error) {
      logger.error(`Error getting count for category ${category}: ${(error as Error).message}`);
      return 0;
    }
  }

  sumSuccessfulResults(results: PromiseSettledResult<number>[]): number {
    return results.reduce((total, result) => {
      return total + (result.status === 'fulfilled' ? result.value : 0);
    }, 0);
  }

  getMostPopulatedCategory(categoryCounts: CategoryCount): MostPopulatedCategory {
    let maxCount = 0;
    let mostPopulated = 'unknown';

    for (const [category, count] of Object.entries(categoryCounts)) {
      if (count > maxCount) {
        maxCount = count;
        mostPopulated = category;
      }
    }

    return {
      category: mostPopulated,
      count: maxCount,
    };
  }

  clearCache(): void {
    this.cache.clear();
    logger.info('Stats cache cleared');
  }

  getCacheInfo(): {
    cacheSize: number;
    cachedKeys: string[];
    cacheTimeout: number;
  } {
    return {
      cacheSize: this.cache.size,
      cachedKeys: Array.from(this.cache.keys()),
      cacheTimeout: this.cacheTimeout,
    };
  }
}

export const statsService = new StatsService();
