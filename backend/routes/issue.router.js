const express = require('express');
const issueController = require('../controllers/issueController');
const authMiddleware = require('../middleware/authMiddleware');

const issueRouter = express.Router();
issueRouter.get('/issue/all/:repoId', issueController.getAllIssues); // Assumes repoId is passed
issueRouter.get('/issue/:id', issueController.getIssueById);

issueRouter.post('/issue/create/:repoId', authMiddleware, issueController.createIssue);
issueRouter.put('/issue/update/:id', authMiddleware, issueController.updateIssueById);
issueRouter.delete('/issue/delete/:id', authMiddleware, issueController.deleteIssueById);

module.exports = issueRouter;
