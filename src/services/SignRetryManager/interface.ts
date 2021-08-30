import { IRetryQueueItem } from "./index";

export interface ISignRetryManager {
    handlingStarted: boolean;
    startHandling(): void;
    addItemToRetryQueue(item: IRetryQueueItem): Promise<any>;
    getAndPopNextItemFromQueue(): Promise<IRetryQueueItem | boolean>;
    handleNextItemInQueue(): Promise<any>;
    notifyUserWebhook(webhook: string, signature: string): Promise<any>;
}