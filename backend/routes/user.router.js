const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Routes ---
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/userProfile/:id', userController.getUserProfile); // For public view

// --- Protected Routes ---

// --- FIX: Add the new protected route for fetching the logged-in user's own profile ---
userRouter.get('/me', authMiddleware, userController.getMe);

userRouter.put('/updateProfile/:id', authMiddleware, userController.updateUserProfile);
userRouter.delete('/deleteProfile/:id', authMiddleware, userController.deleteUserProfile);

module.exports = userRouter;
