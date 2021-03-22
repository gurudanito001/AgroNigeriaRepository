import { Router } from 'express';
import verifyRefreshToken from '../../helpers/verifyRefreshToken';
import Controller from './auth.controller';

const user: Router = Router();
const controller = new Controller();

// Sign In
user.post('/authenticate', controller.authenticate);

user.post('/refresh-token', controller.refreshTokens);

// Register New User
user.post('/register', controller.register);

user.put('/forgot-password', controller.forgotPassword)

user.put('/reset-password', controller.resetPassword)

export default user;
