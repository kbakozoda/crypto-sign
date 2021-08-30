import RedisService from "../Redis";

const WEBHOOK_KEY_PREFIX = "_webhook_";

const UserWebhookService = {
    async getUserWebhook(userId: string): Promise<string> {
        return await RedisService.getKey(UserWebhookService.getWebhookKeyForUser(userId));
    },

    async setUserWebhook(userId: string, webhook: string): Promise<any> {
        return await RedisService.setKeyValue(UserWebhookService.getWebhookKeyForUser(userId), webhook);
    },

    getWebhookKeyForUser(userId: string): string {
        return `${WEBHOOK_KEY_PREFIX}-${userId}`;
    }
};

export default UserWebhookService;
