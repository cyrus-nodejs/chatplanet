"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRedisClient = exports.initRedis = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// console.log(`${process.env.REDIS_USERNAME}`)
// console.log(process.env.REDIS_HOST)
// console.log(process.env.REDIS_PORT)
// console.log(process.env.REDIS_PASSWORD)
let redisClient;
const initRedis = async () => {
    redisClient = (0, redis_1.createClient)({
        username: process.env.REDIS_USERNAME,
        password: process.env.REDIS_PASSWORD,
        socket: {
            host: process.env.REDIS_HOST,
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
exports.initRedis = initRedis;
const getRedisClient = () => {
    if (!redisClient) {
        throw new Error('Redis client not initialized. Call initRedis first.');
    }
    return redisClient;
};
exports.getRedisClient = getRedisClient;
