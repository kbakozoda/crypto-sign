import { Router } from 'express';
import { CryptoComponent } from '../components';

const router: Router = Router();

router.get('/sign', CryptoComponent.sign);

export default router;
