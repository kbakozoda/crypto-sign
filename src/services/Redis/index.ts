import * as redis from "redis";
import config from "../../config/env/index";
import { IRedisService } from "./interface";
const { promisify } = require("util");

console.log("Creating Redis client");

const redisClient = redis.createClient({
    host: config.redis.host,
    port: config.redis.port
});

redisClient.on("connect", () => {
    console.log("Successfully connected to Redis");
});

redisClient.on("error", (err) => {
    console.log("Error connecting to Redis", err);
});

const RedisClient = {
    set: promisify(redisClient.set).bind(redisClient),
    get: promisify(redisClient.get).bind(redisClient),
    del: promisify(redisClient.del).bind(redisClient),
    rpush: promisify(redisClient.rpush).bind(redisClient),
    lrange: promisify(redisClient.lrange).bind(redisClient),
    lpop: promisify(redisClient.lpop).bind(redisClient),
};

export interface IQueueItem {};

const RedisService: IRedisService = {
    async getKey(key: string): Promise<string> {
        return await RedisClient.get(key);
    },

    async setKeyValueWithExpiration(key: string, value: string, expiresInSec: number): Promise<string> {
        return await RedisClient.set(key, value, "EX", expiresInSec);
    },

    async setKeyValue(key: string, value: string): Promise<string> {
        return await RedisClient.set(key, value);
    },

    async deleteKey(key: string): Promise<any> {
        return await RedisClient.del(key);
    },

    async addItemToQueue(item: any, queueName: string): Promise<any> {
        return await RedisClient.rpush([queueName, JSON.stringify(item)]);
    },

    async getNextItemFromQueue(queueName: string): Promise<any> {
        const items = await RedisClient.lrange(queueName, 0, 0); 
        console.log("QUEUE: fetched items = ", items);
        if (items.length > 0) {
            return JSON.parse(items[0]);
        } else {
            return false;
        }
    },

    async popNextItemFromQueue(queueName: string): Promise<any> {
        return await RedisClient.lpop(queueName);
    }
};

export default RedisService;
