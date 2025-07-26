const express = require('express');
const issueController = require('../controllers/issueController');

// --- NEW: Import the auth middleware ---
// We only need the authentication middleware here for now.
const authMiddleware = require('../middleware/authMiddleware');

const issueRouter = express.Router();

// --- PUBLIC ROUTES: For viewing issues ---
// Anyone can view the issues for a public repository.
issueRouter.get('/issue/all/:repoId', issueController.getAllIssues); // Assumes repoId is passed
issueRouter.get('/issue/:id', issueController.getIssueById);

// --- PROTECTED ROUTES: For creating and modifying issues ---
// A user must be logged in to create, update, or delete an issue.
// The `authMiddleware` will verify their identity before allowing the action.
issueRouter.post('/issue/create/:repoId', authMiddleware, issueController.createIssue);
issueRouter.put('/issue/update/:id', authMiddleware, issueController.updateIssueById);
issueRouter.delete('/issue/delete/:id', authMiddleware, issueController.deleteIssueById);

module.exports = issueRouter;
