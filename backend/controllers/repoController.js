const mongoose = require('mongoose');
const path = require('path'); // <-- Added for use in pullRepoData
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const { s3, S3_BUCKET } = require('../config/aws-config');

// --- Controller for creating a repository ---
async function createRepository(req, res) {
  const { name, description, visibility } = req.body;
  try {
    const ownerId = req.user._id;
    const newRepository = new Repository({
      name,
      description,
      visibility,
      owner: ownerId,
    });
    const savedRepository = await newRepository.save();
    await User.findByIdAndUpdate(ownerId, { $push: { repositories: savedRepository._id } });
    res.status(201).json({
      message: 'Repository created successfully',
      repository: savedRepository,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'A repository with this name already exists.' });
    }
    console.error('Error creating repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for fetching all repositories ---
async function getAllRepositories(req, res) {
  try {
    const repositories = await Repository.find().populate('owner', 'username').populate('issues');
    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for fetching a repository by its ID ---
async function fetchRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id).populate('owner', 'username').populate('issues');
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    res.json(repository);
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for fetching a repository by its name ---
async function fetchRepositoryByName(req, res) {
  const { name } = req.params;
  try {
    const repository = await Repository.findOne({ name }).populate('owner', 'username').populate('issues');
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    res.json(repository);
  } catch (error) {
    console.error('Error fetching repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for fetching all repositories for a specific user ---
async function fetchRepositoriesForCurrentUser(req, res) {
  const { userId } = req.params;
  try {
    const repositories = await Repository.find({ owner: userId }).populate('owner', 'username');
    res.json(repositories);
  } catch (error) {
    console.error('Error fetching repositories for user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for updating a repository's details ---
async function updateRepositoryById(req, res) {
  const { id } = req.params;
  const { description } = req.body;
  try {
    const updatedRepository = await Repository.findByIdAndUpdate(
      id,
      { description },
      { new: true }
    ).populate('owner', 'username');
    if (!updatedRepository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    res.json({ message: 'Repository updated successfully', repository: updatedRepository });
  } catch (error) {
    console.error('Error updating repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for toggling a repository's visibility ---
async function toggleVisibilityById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findById(id);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    repository.visibility = !repository.visibility;
    const updatedRepository = await repository.save();
    res.json({ message: 'Repository visibility toggled successfully', repository: updatedRepository });
  } catch (error) {
    console.error('Error toggling repository visibility:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for deleting a repository ---
async function deleteRepositoryById(req, res) {
  const { id } = req.params;
  try {
    const repository = await Repository.findByIdAndDelete(id);
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    await User.findByIdAndUpdate(repository.owner, { $pull: { repositories: repository._id } });
    res.json({ message: 'Repository deleted successfully' });
  } catch (error) {
    console.error('Error deleting repository:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- Controller for handling a push from the CLI ---
async function pushCommit(req, res) {
  const { id: repoId } = req.params;
  const { commitId, message, timestamp } = req.body;
  const files = req.files;
  try {
    for (const file of files) {
      const s3Params = {
        Bucket: S3_BUCKET,
        Key: `repos/${repoId}/${commitId}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      };
      await s3.upload(s3Params).promise();
    }
    const newCommit = { commitId, message, timestamp, author: req.user._id };
    const updatedRepository = await Repository.findByIdAndUpdate(
      repoId,
      { $push: { commits: newCommit } },
      { new: true }
    );
    if (!updatedRepository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    console.log(`Successfully pushed commit ${commitId} to repository ${repoId}`);
    res.status(200).json({ message: 'Push successful', commitId });
  } catch (error) {
    console.error('Error during push operation:', error);
    res.status(500).json({ message: 'Internal server error during push' });
  }
}

// --- NEW: Controller function to handle a pull from the CLI ---
async function pullRepoData(req, res) {
  const { id: repoId } = req.params;
  try {
    const repository = await Repository.findById(repoId).lean();
    if (!repository) {
      return res.status(404).json({ message: 'Repository not found' });
    }
    const commitsData = [];
    for (const commit of repository.commits) {
      const s3Prefix = `repos/${repoId}/${commit.commitId}/`;
      const s3Objects = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: s3Prefix }).promise();
      const filesData = [];
      if (s3Objects.Contents) {
        for (const s3Object of s3Objects.Contents) {
          const params = { Bucket: S3_BUCKET, Key: s3Object.Key, Expires: 300 };
          const downloadUrl = await s3.getSignedUrlPromise('getObject', params);
          filesData.push({
            fileName: path.basename(s3Object.Key),
            url: downloadUrl,
          });
        }
      }
      commitsData.push({
        commitId: commit.commitId,
        message: commit.message,
        timestamp: commit.timestamp,
        files: filesData,
      });
    }
    res.status(200).json(commitsData);
  } catch (error) {
    console.error('Error during pull operation:', error);
    res.status(500).json({ message: 'Internal server error during pull' });
  }
}

// --- Export all controller functions ---
module.exports = {
  createRepository,
  getAllRepositories,
  fetchRepositoryById,
  fetchRepositoryByName,
  fetchRepositoriesForCurrentUser,
  updateRepositoryById,
  toggleVisibilityById,
  deleteRepositoryById,
  pushCommit,
  pullRepoData, // The new function is exported here
};
