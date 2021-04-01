import { Router } from 'express';
import userRoutes from './user';
import accountRoutes from './account';

const router = new Router();

router.use('/', userRoutes);
router.use('/', accountRoutes);

export default router;
