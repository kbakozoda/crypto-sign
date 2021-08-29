export interface IRedisService {
    getKey(key: string): Promise<string>;
    setKeyValueWithExpiration(key: string, value: string, expiresInSec: number): Promise<string>;
    deleteKey(key: string): Promise<any>;
}