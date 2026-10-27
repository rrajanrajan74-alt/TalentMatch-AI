import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

class RedisService {
  private client: Redis | null = null;
  private isConnected: boolean = false;
  private memoryCache: Map<string, { value: string; expiry: number | null }> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    try {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 1,
        connectTimeout: 2000,
        retryStrategy(times) {
          if (times > 3) {
            return null; // Stop retrying after 3 attempts
          }
          return Math.min(times * 200, 1000);
        },
        lazyConnect: true,
      });

      this.client.connect().then(() => {
        this.isConnected = true;
        console.log('[Redis] Connected successfully to Redis server at:', redisUrl);
      }).catch((err) => {
        this.isConnected = false;
        console.warn('[Redis] Unable to connect to Redis server (will use fast in-memory fallback cache):', err.message);
      });

      this.client.on('connect', () => {
        this.isConnected = true;
      });

      this.client.on('error', (err) => {
        this.isConnected = false;
      });

      this.client.on('close', () => {
        this.isConnected = false;
      });
    } catch (e: any) {
      this.isConnected = false;
      console.warn('[Redis] Initialization fallback:', e.message);
    }
  }

  public isReady(): boolean {
    return this.isConnected;
  }

  public async get<T>(key: string): Promise<T | null> {
    if (this.isConnected && this.client) {
      try {
        const data = await this.client.get(key);
        if (!data) return null;
        return JSON.parse(data) as T;
      } catch (err) {
        // Fall back to memory
      }
    }

    // Memory cache fallback
    const item = this.memoryCache.get(key);
    if (!item) return null;
    if (item.expiry && Date.now() > item.expiry) {
      this.memoryCache.delete(key);
      return null;
    }
    try {
      return JSON.parse(item.value) as T;
    } catch {
      return null;
    }
  }

  public async set(key: string, value: any, ttlSeconds: number = 300): Promise<void> {
    const stringValue = JSON.stringify(value);

    if (this.isConnected && this.client) {
      try {
        if (ttlSeconds > 0) {
          await this.client.set(key, stringValue, 'EX', ttlSeconds);
        } else {
          await this.client.set(key, stringValue);
        }
        return;
      } catch (err) {
        // Fall back to memory
      }
    }

    // Memory cache fallback
    const expiry = ttlSeconds > 0 ? Date.now() + (ttlSeconds * 1000) : null;
    this.memoryCache.set(key, { value: stringValue, expiry });
  }

  public async del(key: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.del(key);
      } catch (err) {
        // fallback
      }
    }
    this.memoryCache.delete(key);
  }

  public async delPattern(pattern: string): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        const keys = await this.client.keys(pattern);
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      } catch (err) {
        // fallback
      }
    }

    const regex = new RegExp('^' + pattern.replace(/\*/g, '.*') + '$');
    for (const key of this.memoryCache.keys()) {
      if (regex.test(key)) {
        this.memoryCache.delete(key);
      }
    }
  }

  public async flushAll(): Promise<void> {
    if (this.isConnected && this.client) {
      try {
        await this.client.flushall();
      } catch (err) {
        // fallback
      }
    }
    this.memoryCache.clear();
  }

  // Cache invalidation helpers
  public async invalidateJobCache(jobId?: string) {
    await this.del('jobs:all');
    if (jobId) {
      await this.del(`jobs:${jobId}`);
      await this.del(`rankings:${jobId}`);
    }
    await this.delPattern('rankings:*');
    await this.invalidateAnalyticsCache();
  }

  public async invalidateRankingsCache(jobId?: string) {
    if (jobId) {
      await this.del(`rankings:${jobId}`);
    }
    await this.delPattern('rankings:*');
  }

  public async invalidateAnalyticsCache() {
    await this.del('analytics:dashboard');
    await this.del('analytics:jobs');
    await this.del('analytics:candidates');
  }

  public async invalidateCandidateCache() {
    await this.delPattern('candidates:*');
    await this.delPattern('rankings:*');
    await this.invalidateAnalyticsCache();
  }
}

export const redisService = new RedisService();
export default redisService;
