export interface INotificationService {
    sendNotification(webhook: string, data: any): Promise<any>;
}
