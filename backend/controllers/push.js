// backend/controllers/push.js (REPLACE FULL FILE)

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');
const FormData = require('form-data');
const dotenv = require('dotenv'); // --- NEW: Import dotenv

// Load environment variables for this CLI command
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Construct the server URL dynamically
const API_URL = `http://localhost:${process.env.PORT || 3000}`; // --- NEW: Use dynamic API_URL

// --- Define paths for local and global configuration ---
const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');
const COMMITS_PATH = path.join(LOCAL_REPO_PATH, 'commits');
const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.codevault', 'config.json');


// This is the main function for the 'push' command
async function pushRepo() {
    try {
        // 1. Read local and global config files to get repository ID and auth token
        let repositoryId, token;
        try {
            ({ repositoryId } = JSON.parse(await fs.readFile(LOCAL_CONFIG_FILE, 'utf8')));
            ({ token } = JSON.parse(await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8')));
        } catch (readErr) {
            if (readErr.code === 'ENOENT') {
                console.error('Error: Not a CodeVault repository or you are not logged in. Please run "codevault login" and "codevault init".');
                return;
            }
            throw readErr; // Re-throw other errors
        }

        if (!repositoryId || !token) {
            console.error('Error: Repository not initialized or user not logged in. Please run "codevault init" and "codevault login".');
            return;
        }

        // 2. Identify which commits need to be pushed
        let commitDirs = [];
        try {
            commitDirs = await fs.readdir(COMMITS_PATH);
        } catch (readErr) {
            if (readErr.code === 'ENOENT') {
                console.log('No local commits found. Nothing to push.');
                return;
            }
            throw readErr;
        }

        // Filter out non-directory entries (like .DS_Store on macOS)
        const validCommitDirs = [];
        for (const dir of commitDirs) {
            const fullPath = path.join(COMMITS_PATH, dir);
            const stats = await fs.stat(fullPath);
            if (stats.isDirectory()) {
                validCommitDirs.push(dir);
            }
        }
        commitDirs = validCommitDirs;

        if (commitDirs.length === 0) {
            console.log('Everything up-to-date. Nothing to push.');
            return;
        }


        console.log(`Pushing ${commitDirs.length} commit(s) to remote...`);


        // 3. Loop through each local commit and push it individually
        for (const commitId of commitDirs) {
            const commitPath = path.join(COMMITS_PATH, commitId);
            const commitDetails = JSON.parse(await fs.readFile(path.join(commitPath, 'commit.json'), 'utf8'));

            const formData = new FormData();
            formData.append('commitId', commitDetails.commitID);
            formData.append('message', commitDetails.message);
            formData.append('timestamp', commitDetails.date);


            // 4. Attach all files from the commit to the FormData
            const filesInCommit = await fs.readdir(commitPath);
            for (const fileName of filesInCommit) {
                if (fileName !== 'commit.json') { // Ensure commit.json itself isn't pushed as a file
                    const filePath = path.join(commitPath, fileName);
                    const fileContent = await fs.readFile(filePath);
                    formData.append('files', fileContent, fileName); // Append file buffer with its name
                }
            }


            // 5. Make the authenticated API call to the backend push endpoint
            process.stdout.write(`   - Pushing commit ${commitId.substring(0, 8)}... `);
            await axios.post(
                `${API_URL}/repo/push/${repositoryId}`, // --- FIX: Use dynamic API_URL ---
                formData,
                {
                    headers: {
                        ...formData.getHeaders(), // Important for multipart/form-data
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            process.stdout.write('Done\n');

            // --- OPTIONAL: After successful push, delete the local commit directory ---
            // This is a simple way to prevent re-pushing. For a more robust solution,
            // you'd track the last pushed commit ID in the local config.
            // await fs.rm(commitPath, { recursive: true, force: true });
        }


        console.log('✅ Push complete.');


    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: Not a CodeVault repository or you are not logged in. Please run "codevault login" and "codevault init".');
        } else {
            console.error('Error pushing changes:', error.response?.data?.message || error.message);
        }
    }
}


module.exports = { pushRepo };
