import { Router } from 'express';
import userRoutes from './user';

const router = new Router();

router.use('/', userRoutes);

export default router;
