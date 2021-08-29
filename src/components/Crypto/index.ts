import { NextFunction, Request, Response } from 'express';
import HttpError from '../../config/error';

export async function sign(req: Request, res: Response, next: NextFunction): Promise < void > {
    const message = req.query.message;

    console.log("message sign request for", message);
    res.status(200).json({"result": "ok"});
}
