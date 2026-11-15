import { Redis } from "ioredis";
import { config } from "../config/config.js";

const redis: Redis | null = config.redisUrl
  ? new Redis(config.redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 1000,
      lazyConnect: true,
    })
  : null;

let warned = false;

async function withRedis<T>(operation: (client: Redis) => Promise<T>): Promise<T | null> {
  if (!redis) return null;
  try {
    if (redis.status === "wait") await redis.connect();
    return await operation(redis);
  } catch (error) {
    if (!warned) {
      warned = true;
      console.error("[Redis] Cache unavailable:", error);
    }
    return null;
  }
}

export async function getCached<T>(key: string): Promise<T | null> {
  const value = await withRedis((client) => client.get(key));
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    console.error("[Redis] Invalid cached JSON:", error);
    return null;
  }
}

export async function setCached(key: string, value: unknown, ttlSeconds = 300): Promise<void> {
  await withRedis((client) => client.set(key, JSON.stringify(value), "EX", ttlSeconds));
}

export async function clearReportCache(userIds: string[]): Promise<void> {
  await Promise.all(userIds.map(async (userId) => {
    const keys = await withRedis((client) => client.keys(`report:${userId}:*`));
    if (keys && keys.length > 0) await withRedis((client) => client.del(...keys));
  }));
}

export { redis };
