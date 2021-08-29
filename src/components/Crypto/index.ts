import { NextFunction, Request, Response } from 'express';
import HttpError from '../../config/error';

export async function sign(req: Request, res: Response, next: NextFunction): Promise < void > {
    const message = req.query.message;
    const userId = req.header("userId");
    console.log(`New message sign request for ${message} from ${userId}`);
    res.status(200).json({"result": "ok"});
}

export async function setWebhook(req: Request, res: Response, next: NextFunction): Promise < void > {
    const userId = req.header("userId");
    const webhookUrl = req.body.webhook;

    if (!userId || !webhookUrl) {
        return next(new HttpError(400, "Please specify userId and webhook"));
    }

    res.status(200).json({"result": "ok"});
}
