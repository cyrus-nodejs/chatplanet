import { createClient, RedisClientType } from 'redis';

import dotenv from "dotenv";

dotenv.config()


let redisClient: RedisClientType;

export const initRedis = async (): Promise<RedisClientType> => {
  redisClient = createClient(
    {
    username:process.env.REDIS_USERNAME,
    password:process.env.REDIS_PASSWORD,
    socket: {
        host:process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
    }
});

  // Event listeners for debugging and reliability
  redisClient.on('error', (err) => console.error('❌ Redis Client Error:', err));
  redisClient.on('connect', () => console.log('✅ Connected to Redis'));
  redisClient.on('reconnecting', () => console.log('♻️ Reconnecting to Redis'));
  redisClient.on('end', () => console.log('🔌 Redis connection closed'));

  await redisClient.connect();
  return redisClient;
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call initRedis first.');
  }
  return redisClient;
};
