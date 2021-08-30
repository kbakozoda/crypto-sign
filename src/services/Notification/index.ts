import { INotificationService } from "./interface";
import axios from "axios";

const NotificationService: INotificationService = {
    async sendNotification(webhook: string, data: any): Promise<any> {
        await axios.post(webhook, data, { timeout: 1000 });
    }
}

export default NotificationService;