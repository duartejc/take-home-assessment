import { Queue, Worker, ConnectionOptions } from 'bullmq';
import { createClient, RedisClientType } from 'redis';

import { createLogger } from '../config/logger';

const logger = createLogger('queue-service');

// Interface para dados de query
export interface QueryData {
  query: string;
  category?: string;
  timestamp: number;
  responseTime: number;
  resultsCount: number;
}

// Interface para estatísticas computadas
export interface ComputedStats {
  topQueries: Array<{ query: string; count: number; percentage: number }>;
  averageResponseTime: number;
  popularHours: Array<{ hour: number; count: number; percentage: number }>;
  totalQueries: number;
  lastComputed: number;
}

class QueueService {
  private queryQueue: Queue;
  private statsQueue: Queue;
  private queryWorker!: Worker;
  private statsWorker!: Worker;
  private redisConnection: RedisClientType;
  private connectionOptions: ConnectionOptions;
  private isInitialized: boolean = false;
  private hourCounterExpiration: number;
  private queryCounterExpiration: number;

  constructor() {
    const redisHost = process.env.REDIS_HOST ?? 'localhost';
    const redisPort = parseInt(process.env.REDIS_PORT ?? '6379');
    this.hourCounterExpiration = parseInt(process.env.HOUR_COUNTER_EXPIRATION ?? '86400'); 
    this.queryCounterExpiration = parseInt(process.env.QUERY_COUNTER_EXPIRATION ?? '86400');

    // Create connection options for BullMQ
    this.connectionOptions = {
      host: redisHost,
      port: redisPort,
    };

    // Create Redis client for direct operations
    this.redisConnection = createClient({
      socket: {
        host: redisHost,
        port: redisPort,
      },
    });

    this.queryQueue = new Queue('query-queue', {
      connection: this.connectionOptions,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
      },
    });

    this.statsQueue = new Queue('stats-queue', {
      connection: this.connectionOptions,
      defaultJobOptions: {
        removeOnComplete: 10,
        removeOnFail: 5,
      },
    });

    this.setupWorkers();
  }

  private setupWorkers(): void {
    // Worker for processing individual queries
    this.queryWorker = new Worker(
      'query-queue',
      async (job) => {
        const { query, category, timestamp, responseTime, resultsCount } = job.data as QueryData;
        
        logger.info(`Processing query: ${query}, category: ${category ?? 'all'}`);
        
        await this.storeQueryData({
          query,
          category,
          timestamp,
          responseTime,
          resultsCount,
        });

        return { success: true };
      },
      {
        connection: this.connectionOptions,
        concurrency: 10,
      }
    );

    // Worker for computing statistics
    this.statsWorker = new Worker(
      'stats-queue',
      async () => {
        logger.info('Computing statistics...');
        
        const stats = await this.computeStats();
        
        await this.storeComputedStats(stats);
        
        logger.info('Statistics computed successfully');
        return { success: true, stats };
      },
      {
        connection: this.connectionOptions,
        concurrency: 1,
      }
    );

    this.queryWorker.on('completed', (job) => {
      logger.debug(`Query job ${job.id} completed`);
    });

    this.queryWorker.on('failed', (job, err) => {
      logger.error(`Query job ${job?.id ?? 'unknown'} failed: ${err.message}`);
    });

    this.statsWorker.on('completed', (job) => {
      logger.info(`Stats computation job ${job.id} completed`);
    });

    this.statsWorker.on('failed', (job, err) => {
      logger.error(`Stats computation job ${job?.id ?? 'unknown'} failed: ${err.message}`);
    });
  }

  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      await this.redisConnection.connect();
      logger.info('Redis connection established');

      await this.scheduleStatsComputation();
      
      this.isInitialized = true;
      logger.info('Queue service initialized successfully');
    } catch (error) {
      logger.error(`Failed to initialize queue service: ${(error as Error).message}`);
      throw error;
    }
  }

  async addQuery(data: QueryData): Promise<void> {
    try {
      await this.queryQueue.add('process-query', data, {
        priority: 1,
        delay: 0,
      });
      logger.debug(`Query added to queue: ${data.query}`);
    } catch (error) {
      logger.error(`Failed to add query to queue: ${(error as Error).message}`);
      throw error;
    }
  }

  private async scheduleStatsComputation(): Promise<void> {
    // Recurrent job every 5 minutes
    await this.statsQueue.add(
      'compute-stats',
      {},
      {
        repeat: {
          pattern: '*/5 * * * *',
        },
        priority: 10,
      }
    );
    
    logger.info('Stats computation scheduled every 5 minutes');
  }

  private async storeQueryData(data: QueryData): Promise<void> {
    const key = `query:${data.timestamp}`;
    const hourKey = `queries:hour:${new Date(data.timestamp).getHours()}`;
    const queryKey = `queries:text:${data.query.toLowerCase()}`;
    
    const multi = this.redisConnection.multi();

    multi.hSet(key, {
      query: data.query,
      category: data.category ?? 'all',
      timestamp: data.timestamp.toString(),
      responseTime: data.responseTime.toString(),
      resultsCount: data.resultsCount.toString(),
    });
    multi.expire(key, 24 * 60 * 60);
    
    // Increment hour counter
    multi.incr(hourKey);
    multi.expire(hourKey, this.hourCounterExpiration);
    
    // Increment query counter
    multi.incr(queryKey);
    multi.expire(queryKey, this.queryCounterExpiration);
    
    await multi.exec();
  }

  private async computeStats(): Promise<ComputedStats> {
    const now = Date.now();
    const twentyFourHoursAgo = now - 24 * 60 * 60 * 1000;
    
    // Get all queries from the last 24 hours
    const queryKeys = await this.redisConnection.keys('query:*');
    const recentQueries: QueryData[] = [];
    
    for (const key of queryKeys) {
      const data = await this.redisConnection.hGetAll(key);
      const timestamp = parseInt(data.timestamp);
      
      if (timestamp >= twentyFourHoursAgo) {
        recentQueries.push({
          query: data.query,
          category: data.category,
          timestamp,
          responseTime: parseFloat(data.responseTime),
          resultsCount: parseInt(data.resultsCount),
        });
      }
    }
    
    // Compute top queries
    const topQueries = this.computeTopQueries(recentQueries);
    
    // Compute average response time
    const averageResponseTime = this.computeAverageResponseTime(recentQueries);
    
    // Compute popular hours
    const popularHours = this.computePopularHours(recentQueries);
    
    return {
      topQueries,
      averageResponseTime,
      popularHours,
      totalQueries: recentQueries.length,
      lastComputed: now,
    };
  }

  private computeTopQueries(queries: QueryData[]): Array<{ query: string; count: number; percentage: number }> {
    const queryCounts = new Map<string, number>();
    
    queries.forEach(q => {
      const normalizedQuery = q.query.toLowerCase().trim();
      queryCounts.set(normalizedQuery, (queryCounts.get(normalizedQuery) ?? 0) + 1);
    });
    
    const sortedQueries = Array.from(queryCounts.entries())
      .map(([query, count]) => ({
        query,
        count,
        percentage: (count / queries.length) * 100,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    return sortedQueries;
  }

  private computeAverageResponseTime(queries: QueryData[]): number {
    if (queries.length === 0) return 0;
    
    const totalTime = queries.reduce((sum, q) => sum + q.responseTime, 0);
    return totalTime / queries.length;
  }

  private computePopularHours(queries: QueryData[]): Array<{ hour: number; count: number; percentage: number }> {
    const hourCounts = new Map<number, number>();
    
    queries.forEach(q => {
      const hour = new Date(q.timestamp).getHours();
      hourCounts.set(hour, (hourCounts.get(hour) ?? 0) + 1);
    });
    
    const sortedHours = Array.from(hourCounts.entries())
      .map(([hour, count]) => ({
        hour,
        count,
        percentage: (count / queries.length) * 100,
      }))
      .sort((a, b) => b.count - a.count);
    
    return sortedHours;
  }

  private async storeComputedStats(stats: ComputedStats): Promise<void> {
    await this.redisConnection.set(
      'computed:stats',
      JSON.stringify(stats),
      {
        EX: 10 * 60,
      }
    );
  }

  async getComputedStats(): Promise<ComputedStats | null> {
    try {
      const statsData = await this.redisConnection.get('computed:stats');
      if (statsData) {
        return JSON.parse(statsData) as ComputedStats;
      }
      return null;
    } catch (error) {
      logger.error(`Failed to get computed stats: ${(error as Error).message}`);
      return null;
    }
  }

  async close(): Promise<void> {
    try {
      await this.queryWorker.close();
      await this.statsWorker.close();
      await this.queryQueue.close();
      await this.statsQueue.close();
      await this.redisConnection.quit();
      logger.info('Queue service closed successfully');
    } catch (error) {
      logger.error(`Error closing queue service: ${(error as Error).message}`);
    }
  }
}

export const queueService = new QueueService();
