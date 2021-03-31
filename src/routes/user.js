import { Router } from 'express';
import UserController from '../controllers/user';
import { validateBody, schemas } from '../validators';

const router = new Router();

router
  .route('/users/signup')
  .post(validateBody(schemas.registerUser), UserController.registerUser);

export default router;
