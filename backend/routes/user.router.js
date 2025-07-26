const express = require('express');
const userRouter = express.Router();
const userController = require('../controllers/userController');
// --- NEW: Import authMiddleware to protect routes ---
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Routes ---
// These routes can be accessed without being logged in.
userRouter.get('/allUsers', userController.getAllUsers);
userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.get('/userProfile/:id', userController.getUserProfile);

// --- MODIFIED: Protect these sensitive routes with middleware ---
// A user must now be logged in to even attempt to update or delete a profile.
// The controller will then perform the final authorization check to ensure ownership.
userRouter.put('/updateProfile/:id', authMiddleware, userController.updateUserProfile);
userRouter.delete('/deleteProfile/:id', authMiddleware, userController.deleteUserProfile);

module.exports = userRouter;
