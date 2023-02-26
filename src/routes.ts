import { Router } from 'express';
import UserController from './controllers/UserController';
import RefreshTokenController from './controllers/RefreshTokenController';
import ValidateMiddleware from './middlewares/validate';
import { USER_SHAPE } from './constants/validationShape';
import AuthController from './controllers/AuthController';

const router = Router();

router.post('/register', ValidateMiddleware(USER_SHAPE), UserController.register)
router.post('/confirm', UserController.confirm)
router.post('/login', AuthController.login)
router.post('/refresh-token', RefreshTokenController.refresh)

export default router;
