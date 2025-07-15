const express = require('express'); 
const userRouter = express.Router(); // Importing express and creating a router instance
const userController = require('../controllers/userController'); 


// Defining routes for user-related operations which get handled by the userController
userRouter.get('/allUsers', userController.getAllUsers); 
userRouter.post('/signup', userController.signup); 
userRouter.post('/login', userController.login); 
userRouter.get('/userProfile/:id', userController.getUserProfile); 
userRouter.put('/updateProfile/:id', userController.updateUserProfile); 
userRouter.delete('/deleteProfile/:id', userController.deleteUserProfile); 

module.exports = userRouter; 