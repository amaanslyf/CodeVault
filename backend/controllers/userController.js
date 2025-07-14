const signup = (req, res) => {
    console.log('User signup');
}

const login = (req, res) => {
    console.log('User login');
}

const getAllUsers = (req, res) => {
    res.send('Fetching all users');
}

const getUserProfile = (req, res) => {
    console.log('Fetching user profile');
}

const updateUserProfile = (req, res) => {
    console.log('Updating user profile');
}

const deleteUserProfile = (req, res) => {
    console.log('Deleting user profile');
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};