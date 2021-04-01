import { Router } from 'express';
import UserController from '../controllers/user';
import { validateBody, schemas } from '../validators';

const router = new Router();

router
  .route('/users/signup')
  .post(validateBody(schemas.registerUser), UserController.registerUser);

router
  .route('/users/login')
  .post(validateBody(schemas.loginUser), UserController.loginUser);

export default router;
