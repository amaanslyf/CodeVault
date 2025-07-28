const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');
const Repository = require('../models/repoModel');
const Issue = require('../models/issueModel');
const { s3, S3_BUCKET } = require('../config/aws-config');


// --- SIGNUP: Create a new user ---
async function signup(req, res) {
  const { username, password, email } = req.body;
  try {
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });
    if (newUser) {
      // --- FIX #1: Use the standardized 'JWT_SECRET' and '_id' payload ---
      const token = jwt.sign({ _id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.status(201).json({
        token,
        userId: newUser._id,
        username: newUser.username,
        email: newUser.email,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during signup:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- LOGIN: Authenticate a user ---
async function login(req, res) {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      // --- FIX #1: Use the standardized 'JWT_SECRET' and '_id' payload ---
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({
        token,
        userId: user._id,
        username: user.username,
        email: user.email,
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- GET ALL USERS (DEPRECATED) ---
// This function is kept for reference but its route will be removed for security.
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}
async function getMe(req, res) {
  // The user object is attached to req by the authMiddleware
  // We can send it directly, as it already excludes the password.
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching own user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- MODIFIED: GET USER PROFILE now returns a filtered public profile ---
async function getUserProfile(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password').populate('repositories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // --- FIX #3: Create a safe public profile to avoid leaking sensitive data ---
    const publicProfile = {
      _id: user._id,
      username: user.username,
      // Only include repositories that are public
      repositories: user.repositories.filter(repo => repo.visibility === true)
    };
    
    res.json(publicProfile);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- UPDATE USER PROFILE: Update a user's password ---
// NOTE: Your existing authorization check here is excellent. No changes needed.
async function updateUserProfile(req, res) {
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only update your own profile.' });
  }

  const { id } = req.params;
  const { password } = req.body;
  if (!password || password.length < 6) {
    return res.status(400).json({ message: 'Password is required and must be at least 6 characters' });
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error updating password:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- DELETE USER PROFILE: Delete a user ---
// NOTE: Your cascading delete logic here is excellent and robust. No changes needed.
async function deleteUserProfile(req, res) {
  const userId = req.params.id;

  if (req.user._id.toString() !== userId) {
    return res.status(403).json({ message: 'Forbidden: You can only delete your own profile.' });
  }

  try {
    const userRepositories = await Repository.find({ owner: userId });
    if (userRepositories.length > 0) {
      const repoIds = userRepositories.map(repo => repo._id);
      await Issue.deleteMany({ repository: { $in: repoIds } });
      for (const repoId of repoIds) {
        const s3Prefix = `repos/${repoId}/`;
        const listedObjects = await s3.listObjectsV2({ Bucket: S3_BUCKET, Prefix: s3Prefix }).promise();
        if (listedObjects.Contents.length > 0) {
          const deleteParams = {
            Bucket: S3_BUCKET,
            Delete: { Objects: listedObjects.Contents.map(({ Key }) => ({ Key })) },
          };
          await s3.deleteObjects(deleteParams).promise();
        }
      }
      await Repository.deleteMany({ owner: userId });
    }
    await Issue.updateMany({ author: userId }, { $set: { author: null } });
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User profile and all associated data have been deleted successfully.' });
  } catch (error) {
    console.error('Error during full user deletion:', error);
    res.status(500).json({ message: 'Internal server error during the deletion process.' });
  }
}




module.exports = {
  getMe,
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,

};
