import HttpError from "../../config/error";
import CacheService, { ICacheGetKeyResult } from "../../services/Cache";
import SynthesiaService, { ISynthesiaActionResult } from "../../services/Synthesia";
import { ICryptoService } from "./interface";

const CryptoService: ICryptoService = {
    async signMessage(message: string): Promise<any> {
        console.log("New attempt to sign a message, checking the cache", message);
        const cacheGetKeyResult: ICacheGetKeyResult = await CacheService.getValue(message); 
        let signVerificationResult: ISynthesiaActionResult;

        if (cacheGetKeyResult.success) {
            console.log("Value is in cache =", cacheGetKeyResult.value);
            console.log("Verifying the fetched value");
            signVerificationResult = await SynthesiaService.verifySignature(message, cacheGetKeyResult.value);

            if (!signVerificationResult.success) {
                await CacheService.invalidateKey(message);
            } else {
                return cacheGetKeyResult.value;
            }
        }

        if (!cacheGetKeyResult.success || !signVerificationResult.success) {
            console.log("Getting the signature for", message);
            const result: ISynthesiaActionResult = await SynthesiaService.getSignature(message);

            if (result.success) {
                console.log("Success");
                await CacheService.setKeyValue(message, result.data);
                return result.data;
            } else {
                console.log("Could not sign a message");
                throw new HttpError(418, "Retry later");
            }
        }
    },
};

export default CryptoService;
