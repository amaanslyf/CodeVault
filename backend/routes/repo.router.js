const express = require('express');
const multer = require('multer'); // --- NEW: Import multer
const repoController = require('../controllers/repoController');
const authMiddleware = require('../middleware/authMiddleware');
const { isRepoOwner } = require('../middleware/authorizeMiddleware');

const repoRouter = express.Router();

// We use memoryStorage to temporarily hold files in memory before uploading to S3.
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

repoRouter.get('/repo/all', repoController.getAllRepositories);
repoRouter.get('/repo/public', authMiddleware, repoController.getPublicRepositories);
repoRouter.get('/repo/viewrepo/:id', repoController.fetchRepositoryById);
repoRouter.get('/repo/name/:name', repoController.fetchRepositoryByName);
repoRouter.post('/repo/create', authMiddleware, repoController.createRepository);
repoRouter.get('/repo/user/:userId', authMiddleware, repoController.fetchRepositoriesForCurrentUser);
repoRouter.put('/repo/update/:id', authMiddleware, isRepoOwner, repoController.updateRepositoryById);
repoRouter.patch('/repo/toggle/:id', authMiddleware, isRepoOwner, repoController.toggleVisibilityById);
repoRouter.delete('/repo/delete/:id', authMiddleware, isRepoOwner, repoController.deleteRepositoryById);
repoRouter.post('/repo/push/:id', authMiddleware, isRepoOwner, upload.array('files'), repoController.pushCommit);
repoRouter.get('/repo/pull/:id', authMiddleware, isRepoOwner, repoController.pullRepoData);

module.exports = repoRouter;
