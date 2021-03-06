import { NextFunction, Request, Response } from 'express';
import HttpError from '../../config/error';
import UserWebhookService from '../../services/UserWebhook';
import CryptoService from './service';

export async function sign(req: Request, res: Response, next: NextFunction): Promise < void > {
    const message = req.query.message as string;
    const userId = req.header("userId");
    console.log(`New message sign request for ${message} from ${userId}`);

    if (!message) {
        return next(new HttpError(400, "Please send the message in url params"));
    }

    const signature = await CryptoService.signMessage(message, userId);

    res.status(200).json({"signature": signature});
}

export async function setWebhook(req: Request, res: Response, next: NextFunction): Promise < void > {
    const userId = req.header("userId");
    const webhookUrl = req.body.webhook;

    if (!userId || !webhookUrl) {
        return next(new HttpError(400, "Please specify userId and webhook"));
    }

    console.log("Setting user webhook", userId, webhookUrl);
    await UserWebhookService.setUserWebhook(userId, webhookUrl);

    res.status(200).json({"result": "ok"});
}
