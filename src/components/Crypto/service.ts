import HttpError from "../../config/error";
import CacheService, { ICacheGetKeyResult } from "../../services/Cache";
import SignRetryManager, { IRetryQueueItem } from "../../services/SignRetryManager";
import SynthesiaService, { ISynthesiaActionResult } from "../../services/Synthesia";
import UserWebhookService from "../../services/UserWebhook";
import { ICryptoService } from "./interface";

const CryptoService: ICryptoService = {
    async signMessage(message: string, userId: string): Promise<any> {
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
                await CryptoService.passFailedMessageToRetryManager(message, userId);
                throw new HttpError(418, "Retry later");
            }
        }
    },

    async passFailedMessageToRetryManager(message: string, userId: string): Promise<any> {
        let webhook;
        try {
            webhook = await UserWebhookService.getUserWebhook(userId);
        } catch(err) {
            console.log("could not get webhook for user", userId);
            console.log(err);
        }

        const itemForQueue: IRetryQueueItem = {
            userId,
            message,
            webhook
        };

        console.log("Pushing message to retry queue");
        await SignRetryManager.addItemToRetryQueue(itemForQueue);
    }
};

export default CryptoService;
