import RedisService from "../Redis";
import { ICacheService } from "./interface";
import config from "../../config/env/index";

export interface ICacheGetKeyResult {
    success: boolean,
    value: string;
}

const CacheService: ICacheService = {
    async getValue(key: string): Promise<ICacheGetKeyResult> {
        console.log("CACHE: getting key", key);

        const result: ICacheGetKeyResult = {
            value: await RedisService.getKey(key),
            success: true
        };

        if (!result.value) {
            result.success = false;            
        }

        return result;
    },

    async setKeyValue(key: string, value: string): Promise<any> {
        console.log("CACHE: setting key & value", key, value);
        return RedisService.setKeyValueWithExpiration(key, value, config.signatureCacheKeysTimeoutSec);
    },

    async invalidateKey(key: string): Promise<any> {
        console.log("CACHE: invalidating key");
        return RedisService.deleteKey(key);
    }
}

export default CacheService;