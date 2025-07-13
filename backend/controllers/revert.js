const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const readdir = promisify(fs.readdir); // Promisify the readdir function for asynchronous file reading
const copyFile = promisify(fs.copyFile); // Promisify the copyFile function for asynchronous file copying

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), '.CodeVault');
    const commitsPath = path.join(repoPath, 'commits');
    try {
        const commitDir = path.join(commitsPath, commitID);
        const files = await readdir(commitDir); // Read the files in the commit directory
        const parentDir = path.resolve(repoPath, '..'); // Get the parent directory of the commit directory
        for (const file of files) {
            await copyFile(
                path.join(commitDir, file), // Source file path in the commit directory
                path.join(parentDir, file) // Destination file path in the parent directory
            );
        }
        console.log(`Reverted to commit ${commitID} successfully.`);
    } catch (error) {
        console.error("Error in reverting:", error);

    }

}
module.exports = { revertRepo };