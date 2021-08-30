export interface IUserWebhookService {
    getUserWebhook(userId: string): Promise<string>;
    setUserWebhook(userId: string, webhook: string): Promise<any>;
    getWebhookKeyForUser(userId: string): string;
}