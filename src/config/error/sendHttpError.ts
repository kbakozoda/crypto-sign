import { HttpError } from './index';
import { NextFunction, Request } from 'express';

export function sendHttpErrorModule(req: Request, res: any, next: NextFunction): void {
    res.sendHttpError = (error: HttpError): void => {
        res.status(error.status);

        res.json({
            status: error.status,
            name: error.name,
            message: error.message
        });    
    };

    next();
}
