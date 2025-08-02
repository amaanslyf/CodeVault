const jwt = require('jsonwebtoken');
const Issue = require('../models/issueModel');
const Repository = require('../models/repoModel');

async function createIssue(req, res) {
  const { title, description } = req.body;
  const { repoId } = req.params;
  const authorId = req.user._id;

  try {
    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found.' });
    }

    // For private repos, only the owner should be able to create issues.
    if (!repository.visibility && repository.owner.toString() !== authorId.toString()) {
      return res.status(403).json({ message: 'Access Denied: You cannot create issues in this private repository.' });
    }

    const newIssue = new Issue({
      title,
      description,
      repository: repoId,
      author: authorId,
    });
    const savedIssue = await newIssue.save();
    
    await Repository.findByIdAndUpdate(repoId, { $push: { issues: savedIssue._id } });
    
    const issueWithAuthor = await Issue.findById(savedIssue._id).populate('author', 'username');

    res.status(201).json(issueWithAuthor);
  } catch (error) {
    console.error('Error creating issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getAllIssues(req, res) {
  const { repoId } = req.params;
  try {
    const repository = await Repository.findById(repoId);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }


    if (repository.visibility) {
      const issues = await Issue.find({ repository: repoId }).populate('author', 'username').sort({ createdAt: -1 });
      return res.json(issues);
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required to view issues for a private repository.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (repository.owner.toString() !== decoded._id) {
      return res.status(403).json({ message: 'Access denied. You do not have permission to view these issues.' });
    }

    const issues = await Issue.find({ repository: repoId }).populate('author', 'username').sort({ createdAt: -1 });
    res.json(issues);

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }
    console.error('Error fetching issues:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function getIssueById(req, res) {
  const { id } = req.params;
  try {
    const issue = await Issue.findById(id).populate('author', 'username');
    if (!issue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    const repository = await Repository.findById(issue.repository);
    if (!repository) {
      return res.status(404).json({ message: 'Associated repository not found.' });
    }

    if (repository.visibility) {
      return res.json(issue);
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required to view this issue.' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (repository.owner.toString() !== decoded._id) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    
    res.json(issue); 

  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Access denied. Invalid or expired token.' });
    }
    console.error('Error fetching issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function updateIssueById(req, res) {
  const { id } = req.params;
  const { title, description, status } = req.body;
  try {
    const updatedIssue = await Issue.findByIdAndUpdate(
      id,
      { title, description, status },
      { new: true }
    ).populate('author', 'username');
    if (!updatedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }
    res.json(updatedIssue);
  } catch (error) {
    console.error('Error updating issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

async function deleteIssueById(req, res) {
  const { id: issueId } = req.params;
  try {
    const deletedIssue = await Issue.findByIdAndDelete(issueId);
    if (!deletedIssue) {
      return res.status(404).json({ message: 'Issue not found' });
    }

    if (deletedIssue.repository) {
      await Repository.findByIdAndUpdate(
        deletedIssue.repository,
        { $pull: { issues: issueId } }
      );
    }

    res.json({ message: 'Issue deleted successfully' });
  } catch (error) {
    console.error('Error deleting issue:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


module.exports = {
  createIssue,
  getAllIssues,
  getIssueById,
  updateIssueById,
  deleteIssueById,
};
