const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { MongoClient } = require('mongodb');
var ObjectId = require('mongodb').ObjectId;  // Import ObjectId from mongodb to use it for querying
const dotenv = require('dotenv');
dotenv.config();
const uri = process.env.MONGODB_URI;

let client;
async function connectClient() {  // Connect to MongoDB
    if (!client) {
        client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true }); // Create a new MongoClient instance where the two parameters means that we are not using any deprecated features
        await client.connect();
    }
}


async function signup(req, res) {
    const { username, password, email } = req.body;
    try {
        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ username });  // Check if user already exists
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);  // Generate a salt for hashing
        const hashedPassword = await bcrypt.hash(password, salt);  // Hash the password with the salt
        const newUser = {
            username,
            password: hashedPassword,
            email,
            repositories: [],
            followedUsers: [],
            starRepos: []
        }
        const result = await usersCollection.insertOne(newUser);  // Insert the new user into the database

        const token = jwt.sign({ id: result.insertedId }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });  // Create a JWT token for the user
        res.json({ token });
    } catch (error) {
        console.error('Error during signup:', error.message);
        res.status(500).send('Internal server error');
    }


}

async function login(req, res) {
    const { email, password } = req.body;
    try {
        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ email });  // Check if user already exists
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const isMatch = await bcrypt.compare(password, user.password);  // Compare the password with the hashed password
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });  // Create a JWT token for the user
        res.json({ token, userId: user._id });
    } catch (error) {
        console.error('Error during login:', error.message);
        res.status(500).send('Internal server error');
    }
}

async function getAllUsers(req, res) {
    try {
        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        const users = await usersCollection.find({}).toArray();  // Fetch all users from the database and toArray() is used as we are fetching multiple users (documents)
        res.json(users);

    } catch (error) {
        console.error('Error fetching users:', error.message);
        res.status(500).send('Internal server error');
    }
}

async function getUserProfile(req, res) {
    const currentId = req.params.id;
    try {
        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        const user = await usersCollection.findOne({ _id: new ObjectId(currentId) });  // Fetch user by ID
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.send(user);
    } catch (error) {
        console.error('Error fetching user profile:', error.message);
        res.status(500).send('Internal server error');
    }

}

async function updateUserProfile(req, res) {
    const currentId = req.params.id;
    const { email , password} = req.body;
    try {

        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        let updateFields={email};
        if (password){
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);  // Hash the new password if provided
            updateFields.password = hashedPassword;  
        }
        const result = await usersCollection.findOneAndUpdate(
            { _id: new ObjectId(currentId) },  // Find user by ID
            { $set: updateFields },  // Update the email field
            { returnDocument: 'after' }  // Return the updated document
        );
        if (!result.value) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.send(result.value); 
    }catch (error) {
        console.error('Error updating user profile:', error.message);
        res.status(500).send('Internal server error');
    }   
}

async function deleteUserProfile(req, res) {
    const currentId = req.params.id;
    try{

        //establishing connection to MongoDB and selecting the database and collection
        await connectClient();
        const db = client.db('CodeVault');
        const usersCollection = db.collection('users');

        const result = await usersCollection.deleteOne({ _id: new ObjectId(currentId) });  // Delete user by ID
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User profile deleted successfully' });
    }catch (error) {
        console.error('Error deleting user profile:', error.message);
        return res.status(500).send('Internal server error');
    }
}

module.exports = {
    getAllUsers,
    signup,
    login,
    getUserProfile,
    updateUserProfile,
    deleteUserProfile
};