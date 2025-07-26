const Repository = require('../models/repoModel'); // Using the Mongoose Repository model
const mongoose = require('mongoose');

/**
 * Middleware to authorize if the logged-in user is the owner of a repository.
 * This must be used after authMiddleware.
 */
const isRepoOwner = async (req, res, next) => {
  try {
    const { id: repoId } = req.params;
    const userId = req.user._id; // This comes from authMiddleware

    // Check if the provided repoId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(repoId)) {
        return res.status(400).json({ message: 'Invalid repository ID format' });
    }

    // 1. Find the repository by its ID
    const repository = await Repository.findById(repoId);

    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // 2. Compare the repository's owner ID with the authenticated user's ID
    // We use .toString() to ensure a correct comparison between ObjectId types.
    if (repository.owner.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'Forbidden: You are not the owner of this repository' });
    }

    // 3. If authorized, proceed to the next handler
    next();
  } catch (error) {
    console.error('Authorization error:', error.message);
    res.status(500).json({ message: 'Internal server error during authorization' });
  }
};

module.exports = { isRepoOwner };
