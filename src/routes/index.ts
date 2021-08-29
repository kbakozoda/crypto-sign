import * as express from 'express';
import * as http from 'http';
import CryptoRouter from './CryptoRouter';

/**
 * @export
 * @param {express.Application} app
 */
export function init(app: express.Application): void {
    const router: express.Router = express.Router();

    app.use('/crypto', CryptoRouter);

    app.use((req, res, next) => {
        res.status(404).send(http.STATUS_CODES[404]);
    });

    app.use(router);
}
