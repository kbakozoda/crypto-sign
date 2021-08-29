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
    del: promisify(redisClient.del).bind(redisClient)
};

const RedisService: IRedisService = {
    async getKey(key: string): Promise<string> {
        return await RedisClient.get(key);
    },

    async setKeyValueWithExpiration(key: string, value: string, expiresInSec: number): Promise<string> {
        return await RedisClient.set(key, value, "EX", expiresInSec);
    },

    async deleteKey(key: string): Promise<any> {
        return await RedisClient.del(key);
    }
};

export default RedisService;
