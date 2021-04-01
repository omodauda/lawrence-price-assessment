import { Router } from 'express';
import AccountController from '../controllers/account';
import authenticate from '../middlewares/auth';
import { validateBody, schemas } from '../validators';

const router = new Router();

router
  .route('/account/credit')
  .post(validateBody(schemas.addMoney), authenticate, AccountController.addMoney);

export default router;
