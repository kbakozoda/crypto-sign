import { Router } from 'express';
import { CryptoComponent } from '../components';

let wrap = function(fn: Function) {
    return (...args: any[]) => fn(...args).catch(args[2]);
};

const router: Router = Router();

router.get('/sign', wrap(CryptoComponent.sign));
router.post('/set-webhook', wrap(CryptoComponent.setWebhook));

export default router;
