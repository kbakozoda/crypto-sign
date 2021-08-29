import { ICacheGetKeyResult } from ".";

export interface ICacheService {
    getValue(key: string): Promise<ICacheGetKeyResult>;
    setKeyValue(key: string, value: string): Promise<any>;
    invalidateKey(key: string): Promise<any>;
}