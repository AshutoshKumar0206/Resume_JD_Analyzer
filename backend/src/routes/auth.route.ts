import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import { login, signup } from '../controllers/auth.controller';

const authRouter = Router();

// Endpoint: POST /api/auth/signup
authRouter.post('/login', login);
authRouter.post('/signup', signup);

// Endpoint: POST /api/auth/signout
// authRouter.post('/signout', authMiddleware, signout);

export default authRouter;