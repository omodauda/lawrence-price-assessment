import { Router } from 'express';
import userRoutes from './user';
import transactionRoutes from './transaction';

const router = new Router();

router.use('/', userRoutes);
router.use('/', transactionRoutes);

export default router;
