import CacheService, { ICacheGetKeyResult } from "../../services/Cache";
import { ICryptoService } from "./interface";

const CryptoService: ICryptoService = {
    async signMessage(message: string): Promise<void> {
        console.log("signing message", message);
        const cacheGetKeyResult: ICacheGetKeyResult = await CacheService.getValue(message); 
        
        if (cacheGetKeyResult.success) {
            console.log("value is in cache = ", cacheGetKeyResult.value);
            return;
        }

        if (!cacheGetKeyResult.success) {
            console.log("setting new val in cache");
            await CacheService.setKeyValue(message, "321");
        }
    },
};

export default CryptoService;
