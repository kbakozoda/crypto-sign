import { IQueueItem } from ".";

export interface IRedisService {
    getKey(key: string): Promise<string>;
    setKeyValueWithExpiration(key: string, value: string, expiresInSec: number): Promise<string>;
    setKeyValue(key: string, value: string): Promise<string>;
    deleteKey(key: string): Promise<any>;
    addItemToQueue(item: any, queueName: string): Promise<any>;
    getNextItemFromQueue(queueName: string): Promise<any>;
    popNextItemFromQueue(queueName: string): Promise<any>;
}
