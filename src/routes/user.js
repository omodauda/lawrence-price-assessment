import { Router } from 'express';
import UserController from '../controllers/user';
import { validateBody, schemas } from '../validators';
import authenticate from '../middlewares/auth';

const router = new Router();

router
  .route('/users/signup')
  .post(validateBody(schemas.registerUser), UserController.registerUser);

router
  .route('/users/login')
  .post(validateBody(schemas.loginUser), UserController.loginUser);

router
  .route('/users/logout')
  .get(authenticate, UserController.logout);

export default router;
