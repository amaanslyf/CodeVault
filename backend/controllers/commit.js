const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), '.codevault');
    const stagingPath = path.join(repoPath, 'staging');
    const commitsPath = path.join(repoPath, 'commits');
    const latestCommitPath = path.join(repoPath, 'HEAD'); // To track the latest commit easily

    try {
        const commitID = uuidv4(); 
        const commitDir = path.join(commitsPath, commitID); 

        await fs.mkdir(commitDir, { recursive: true }); 

        let filesToCommit = [];
        try {
            filesToCommit = await fs.readdir(stagingPath); 
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.log('No changes to commit: Staging area is empty.');
                return;
            }
            throw err; 
        }

        if (filesToCommit.length === 0) {
            console.log('No changes to commit: Staging area is empty.');
            return;
        }

        const committedFilesManifest = []; 

        for (const file of filesToCommit) {
            const sourceFilePath = path.join(stagingPath, file);
            const destinationFilePath = path.join(commitDir, file);
            await fs.copyFile(sourceFilePath, destinationFilePath);
            committedFilesManifest.push(file); 
        }

        // Create a commit file with the commit message, ID, date, and included files
        const commitMetadata = {
            message,
            commitID,
            date: new Date().toISOString(),
            files: committedFilesManifest, // Store the list of files that were part of this commit
            previousCommitID: null 
        };

        try {
            const lastCommitID = await fs.readFile(latestCommitPath, 'utf8');
            commitMetadata.previousCommitID = lastCommitID.trim();
        } catch (readErr) {
        
        }

        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify(commitMetadata, null, 2));
        await fs.writeFile(latestCommitPath, commitID);

        //Clear staging area contents, don't remove the directory itself ---
        for (const file of filesToCommit) {
            await fs.unlink(path.join(stagingPath, file)); 
        }
        
        console.log(`✅ Changes committed successfully with ID: ${commitID.substring(0, 8)}`);

    } catch (err) {
        console.error("Error committing changes:", err.message);
    }
}

module.exports = { commitRepo };
