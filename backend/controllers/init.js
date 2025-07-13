const fs = require('fs').promises; // Importing the file system module to handle file operations asynchronously
const path = require('path');
async function initRepo() {
    const repoPath = path.resolve(process.cwd(), '.CodeVault');  // Get the current working directory and append '.CodeVault' folder which will be used as the repository and is hidden from the user
    const commitsPath = path.join(repoPath, 'commits'); // Path to the commits directory which is inside the repository

    try {
        await fs.mkdir(repoPath, { recursive: true }); // Create the repository directory if it doesn't exist
        await fs.mkdir(commitsPath, { recursive: true }); // Create the commits directory inside the repository
        await fs.writeFile(path.join(repoPath, "config.json"), JSON.stringify({ bucket: process.env.S3_BUCKET })); // Create a config file inside the repository with the S3 bucket name
        console.log("Repository initialized successfully at", repoPath);
    } catch (err) {
        console.error("Error initializing repository:", err);
    }
}
module.exports = { initRepo };