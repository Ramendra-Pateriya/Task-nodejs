// Required modules
import express from 'express';
import {register , login, allUser, forgotPassword, resetPassword, resetPasswordSubmit} from '../controllers/userController.js';
import {verifyInputForSignUp, verifyToken, verifyInputForLogin} from '../middleware/auth.js';


// Initialize router
const router = express.Router();

// API for user signup
router.post('/api/signup', verifyInputForSignUp, register);

// API for user login
router.post('/api/login',verifyInputForLogin, login);

// API for user list
router.get('/api/list', verifyToken,allUser);

// API for forgot password
router.get('/forgot-password', forgotPassword);

// API for reset password page
router.get('/reset-password/:token', resetPassword);

// API for updated password 
router.post('/reset-password-submit', resetPasswordSubmit);

export default router;