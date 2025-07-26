const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/userModel');

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
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
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
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
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

// --- GET ALL USERS: Fetch all users ---
async function getAllUsers(req, res) {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- GET USER PROFILE: Fetch a single user profile ---
async function getUserProfile(req, res) {
  const { id } = req.params;
  try {
    const user = await User.findById(id).select('-password').populate('repositories');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// --- UPDATE USER PROFILE: Update a user's password ---
async function updateUserProfile(req, res) {
  // --- NEW: Authorization Check ---
  // Verify that the logged-in user's ID (from the token) matches the ID in the URL.
  // This prevents a logged-in user from changing another user's password.
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
async function deleteUserProfile(req, res) {
  // --- NEW: Authorization Check ---
  // Verify that the logged-in user's ID (from the token) matches the ID in the URL.
  // This prevents a logged-in user from deleting another user's account.
  if (req.user._id.toString() !== req.params.id) {
    return res.status(403).json({ message: 'Forbidden: You can only delete your own profile.' });
  }

  const { id } = req.params;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Consider also deleting user's repositories here.
    res.json({ message: 'User profile deleted successfully' });
  } catch (error) {
    console.error('Error deleting user profile:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
}

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
};
