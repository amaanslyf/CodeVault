// backend/controllers/commit.js (REPLACE FULL FILE)

const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commitRepo(message) {
    // --- FIX: Consistent local repository folder name ---
    const repoPath = path.resolve(process.cwd(), '.codevault');
    const stagingPath = path.join(repoPath, 'staging');
    const commitsPath = path.join(repoPath, 'commits');
    const latestCommitPath = path.join(repoPath, 'HEAD'); // To track the latest commit easily

    try {
        const commitID = uuidv4(); // Generate a unique commit ID
        const commitDir = path.join(commitsPath, commitID); // Create a directory for the commit

        await fs.mkdir(commitDir, { recursive: true }); // Ensure commit directory exists

        let filesToCommit = [];
        try {
            filesToCommit = await fs.readdir(stagingPath); // Read files from staging area
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('No changes to commit: Staging area is empty.');
                return;
            }
            throw err; // Re-throw other errors
        }

        if (filesToCommit.length === 0) {
            console.log('No changes to commit: Staging area is empty.');
            return;
        }

        const committedFilesManifest = []; // To store details of files included in this commit

        for (const file of filesToCommit) {
            const sourceFilePath = path.join(stagingPath, file);
            const destinationFilePath = path.join(commitDir, file);
            await fs.copyFile(sourceFilePath, destinationFilePath);
            committedFilesManifest.push(file); // Add filename to manifest
        }

        // Create a commit file with the commit message, ID, date, and included files
        const commitMetadata = {
            message,
            commitID,
            date: new Date().toISOString(),
            files: committedFilesManifest, // Store the list of files that were part of this commit
            previousCommitID: null // We'll add logic to get this later for true history
        };

        // If there's a HEAD (last commit), link it to this new commit
        try {
            const lastCommitID = await fs.readFile(latestCommitPath, 'utf8');
            commitMetadata.previousCommitID = lastCommitID.trim();
        } catch (readErr) {
            // No previous commit, or file not found - first commit
        }

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify(commitMetadata, null, 2));

        // --- NEW: Update HEAD to point to this new commit ---
        await fs.writeFile(latestCommitPath, commitID);

        // --- FIX: Clear staging area contents, don't remove the directory itself ---
        for (const file of filesToCommit) {
            await fs.unlink(path.join(stagingPath, file)); // Delete file from staging
        }
        
        console.log(`✅ Changes committed successfully with ID: ${commitID.substring(0, 8)}`);

    } catch (err) {
        console.error("Error committing changes:", err.message);
    }
}

module.exports = { commitRepo };
