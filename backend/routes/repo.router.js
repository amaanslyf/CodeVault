const express = require('express'); 
const repoController = require('../controllers/repoController'); 

const repoRouter=express.Router();

// Define the routes for the repository operations
repoRouter.post('/repo/create', repoController.createRepository); 
repoRouter.get('/repo/all', repoController.getAllRepositories);
repoRouter.get('/repo/user/:id', repoController.fetchRepositoryById);
repoRouter.get('/repo/name/:name', repoController.fetchRepositoryByName);
repoRouter.get('/repo/:userId', repoController.fetchRepositoriesForCurrentUser);
repoRouter.put('/repo/update/:id', repoController.updateRepositoryById);
repoRouter.patch('/repo/toggle/:id', repoController.toggleVisibilityById);
repoRouter.delete('/repo/delete/:id', repoController.deleteRepositoryById);


module.exports = repoRouter; 