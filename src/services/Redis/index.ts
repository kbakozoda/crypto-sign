import * as redis from "redis";
import config from "../../config/env/index";
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
    get: promisify(redisClient.get).bind(redisClient)
};

const RedisService = {
    async getKey(key: string): Promise<string> {
        return await RedisClient.get(key);
    },

    async setKeyValueWithExpiration(key: string, value: string, expiresInSec: number): Promise<string> {
        return await RedisClient.set(key, value, "EX", expiresInSec);
    }
};

export default RedisService; 