import { Router } from 'express';
import TransactionController from '../controllers/transaction';
import authenticate from '../middlewares/auth';
import { validateBody, schemas } from '../validators';

const router = new Router();

router
  .route('/account/add_money')
  .post(validateBody(schemas.addMoney), authenticate, TransactionController.addMoney);

export default router;
