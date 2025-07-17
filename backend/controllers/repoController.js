const mongoose = require('mongoose');
const Repository = require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');
async function createRepository(req, res) {
    const { owner, name, issues, content, description, visibility } = req.body;
    try {
        if (!name) {
            return res.status(400).json({ message: 'Repository name is required' });
        }
        if (!mongoose.Types.ObjectId.isValid(owner)) {   //this checks if the owner ID is a valid MongoDB ObjectId 
            return res.status(400).json({ message: 'Invalid owner ID' });
        }
        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });
        const result = await newRepository.save();
        res.status(201).json({ message: 'Repository created successfully', repository: result._id });
    } catch (error) {
        console.error('Error creating repository:', error);
        res.status(500).json({ message: 'Internal server error' });
    }

};

async function getAllRepositories(req, res) {
    try {
        const repositories = await Repository.find().populate('owner').populate('issues');  //populate is used to replace the specified paths in the document with documents from other collections
        res.json(repositories)
    } catch (error) {
        console.error('Error fetching repositories:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function fetchRepositoryById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.find({ _id: id }).populate('owner').populate('issues');
        res.json(repository);
    } catch (error) {
        console.error('Error fetching repository:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function fetchRepositoryByName(req, res) {
     const { name } = req.params;
     try {
        const repository = await Repository.find({ name }).populate('owner').populate('issues');
        res.json(repository);
     }catch (error) {
        console.error('Error fetching repository:', error);
        res.status(500).json({ message: 'Internal server error' }); 
     }
        
}

async function fetchRepositoriesForCurrentUser(req, res) {
    const userId= req.user;                                //it gets logged in user ID from the request object stored in req.user
    try {
        const repositories = await Repository.find({ owner: userId });
        if (!repositories || repositories.length === 0) {
            return res.status(404).json({ message: 'No repositories found for this user' });
        }
        res.json(repositories);
    }catch (error) {
        console.error('Error fetching repositories for user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function updateRepositoryById(req, res) {
    const { id } = req.params;
    const {content , description,} = req.body;
    try {
        const repository = await Repository.findById(id);
        if (!repository ) {
            return res.status(404).json({ message: 'Repository not found' });
        }
        repository.content.push(content);
        repository.description = description;

        const updatedRepository = await repository.save();
        res.json({ message: 'Repository updated successfully', repository: updatedRepository });
    }catch (error) {
        console.error('Error updating repository:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
        
}

async function toggleVisibilityById(req, res) {
    const {id} = req.params;
    try {
        const repository = await Repository.findById(id);
        if (!repository) {
            return res.status(404).json({ message: 'Repository not found' });
        }
        repository.visibility = !repository.visibility; // Toggle visibility
        const updatedRepository = await repository.save();
        res.json({ message: 'Repository visibility toggled successfully', repository: updatedRepository });
    }catch (error) {
        console.error('Error toggling repository visibility:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

async function deleteRepositoryById(req, res) {
    const { id } = req.params;
    try {
        const repository = await Repository.findByIdAndDelete(id);
        if (!repository) {
            return res.status(404).json({ message: 'Repository not found' });
        }
        res.json({ message: 'Repository deleted successfully' });
    } catch (error) {
        console.error('Error deleting repository:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = {
    createRepository,
    getAllRepositories,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoriesForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById
}

