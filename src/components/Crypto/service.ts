import HttpError from "../../config/error";
import CacheService, { ICacheGetKeyResult } from "../../services/Cache";
import SignRetryManager, { IRetryQueueItem } from "../../services/SignRetryManager";
import SynthesiaService, { ISynthesiaActionResult } from "../../services/Synthesia";
import UserWebhookService from "../../services/UserWebhook";
import { ICryptoService } from "./interface";

const CryptoService: ICryptoService = {
    async signMessage(message: string, userId: string): Promise<any> {
        console.log("New attempt to sign a message, checking the cache", message);
        const getMessageSignatureInCacheResult: ICacheGetKeyResult = await CacheService.getValue(message); 
        let signVerificationResult: ISynthesiaActionResult;

        if (getMessageSignatureInCacheResult.success) {
            console.log("Value is in cache =", getMessageSignatureInCacheResult.value);
            console.log("Verifying the fetched value");
            signVerificationResult = await SynthesiaService.verifySignature(message, getMessageSignatureInCacheResult.value);

            if (!signVerificationResult.success) {
                await CacheService.invalidateKey(message);
            } else {
                return getMessageSignatureInCacheResult.value;
            }
        }

        if (!getMessageSignatureInCacheResult.success || !signVerificationResult.success) {
            return await CryptoService.getMessageSignatureForUser(message, userId);
        }
    },

    async getMessageSignatureForUser(message: string, userId: string): Promise<string> {
        console.log("Getting the signature for", message);
        const result: ISynthesiaActionResult = await SynthesiaService.getSignature(message);

        if (result.success) {
            console.log("Success");
            await CacheService.setKeyValue(message, result.data);
            return result.data;
        } else {
            console.log("Could not sign a message");
            await CryptoService.passFailedMessageToRetryManager(message, userId);
            throw new HttpError(418, "Retry later or wait for a result on your webhook.");
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

        if (!userId) {
            console.log("UserId not specified, will not add to retry queue.");
            return;
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
