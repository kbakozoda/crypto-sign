import CryptoService from "../../components/Crypto/service";
import NotificationService from "../Notification";
import RedisService, { IQueueItem } from "../Redis";
import { ISignRetryManager } from "./interface";

export interface IRetryQueueItem extends IQueueItem {
    userId: string,
    message: string,
    webhook: string
};

const QUEUE_NAME = "msg_queue";
const HANDLING_INTERVAL_MS = 10000;

const SignRetryManager: ISignRetryManager = {

    handlingStarted: false,

    startHandling(): void {
        setInterval(this.handleNextItemInQueue, HANDLING_INTERVAL_MS);
        this.handlingStarted = true;
        console.log("Sign Retry Manager: started");
    },

    async addItemToRetryQueue(item: IRetryQueueItem): Promise<any> {
        await RedisService.addItemToQueue(item, QUEUE_NAME);
        return;
    },

    async handleNextItemInQueue(): Promise<any> {
        const nextItem: IRetryQueueItem | boolean = await SignRetryManager.getAndPopNextItemFromQueue();

        if (nextItem) {
            console.log("Sign Retry Manager: handling next item", nextItem);
            const nextItemTyped = nextItem as IRetryQueueItem;
            try {
                const signature = await CryptoService.signMessage(nextItemTyped.message, nextItemTyped.userId);
                console.log("Sign Retry Manager: success, signature = ", signature);
                SignRetryManager.notifyUserWebhook(nextItemTyped.webhook, signature);
            } catch(err) {
                console.log("Sign Retry Manager: item handle failed", err);
            }
        }
    },

    async getAndPopNextItemFromQueue(): Promise<IRetryQueueItem | boolean> {
        const nextItem = await RedisService.getNextItemFromQueue(QUEUE_NAME);
        if (nextItem) {
            await RedisService.popNextItemFromQueue(QUEUE_NAME);
            return nextItem;
        }

        return false;
    },

    async notifyUserWebhook(webhook: string, signature: string): Promise<any> {
        if (!webhook) {
            console.log("No webhook is specified, notification will not be sent.");
            return;
        }

        console.log("Sending notification to webhook", webhook);
        await NotificationService.sendNotification(webhook, { signature });
    }
};

SignRetryManager.startHandling();

export default SignRetryManager;
