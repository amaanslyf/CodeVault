// backend/controllers/pull.js (REPLACE FULL FILE)

const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');
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


// This is the main function for the 'pull' command
async function pullRepo() {
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
            throw readErr;
        }

        if (!repositoryId || !token) {
            console.error('Error: Repository not initialized or user not logged in.');
            return;
        }

        console.log('Fetching remote history...');
        // 2. Make an authenticated API call to the backend pull endpoint
        const response = await axios.get(
            `${API_URL}/repo/pull/${repositoryId}`, // --- FIX: Use dynamic API_URL ---
            { headers: { Authorization: `Bearer ${token}` } }
        );


        const remoteCommits = response.data;
        if (remoteCommits.length === 0) {
            console.log('Repository is empty or up-to-date.');
            return;
        }


        console.log(`Found ${remoteCommits.length} commit(s). Downloading files...`);

        // --- FIX #3: Don't remove existing local commits. Only add/update. ---
        // Create COMMITS_PATH if it doesn't exist (no need to remove it first)
        await fs.mkdir(COMMITS_PATH, { recursive: true });

        // Get existing local commit IDs to compare
        let localCommitIds = new Set();
        try {
            const existingCommitDirs = await fs.readdir(COMMITS_PATH);
            for (const dir of existingCommitDirs) {
                const fullPath = path.join(COMMITS_PATH, dir);
                const stats = await fs.stat(fullPath);
                if (stats.isDirectory()) {
                    localCommitIds.add(dir);
                }
            }
        } catch (err) {
            if (err.code !== 'ENOENT') { // Ignore if directory simply doesn't exist
                console.warn('Warning: Could not read local commits directory:', err.message);
            }
        }

        let newCommitsCount = 0;

        // 4. Iterate through each commit from the server's response
        for (const commit of remoteCommits) {
            const commitDir = path.join(COMMITS_PATH, commit.commitId);
            const commitMetadataFile = path.join(commitDir, 'commit.json');

            // Check if commit already exists locally
            if (localCommitIds.has(commit.commitId)) {
                console.log(`  - Commit ${commit.commitId.substring(0,8)} already exists locally. Checking for updates...`);
                // For a simple pull, we can overwrite existing files to ensure latest version
                // Or you could implement a more sophisticated diff/merge
            } else {
                console.log(`  - New commit ${commit.commitId.substring(0,8)} found. Downloading...`);
                newCommitsCount++;
            }
            
            await fs.mkdir(commitDir, { recursive: true });


            // Download each file for the commit using the secure, temporary URL
            for (const file of commit.files) {
                const filePath = path.join(commitDir, file.fileName);
                process.stdout.write(`    - Downloading ${file.fileName}... `);
                try {
                    const fileResponse = await axios.get(file.url, { responseType: 'arraybuffer' });
                    await fs.writeFile(filePath, fileResponse.data);
                    process.stdout.write('Done\n');
                } catch (fileErr) {
                    console.error(`Failed to download ${file.fileName}: ${fileErr.message}`);
                }
            }

            // Re-create the local commit.json metadata file
            // --- FIX #4: Ensure commitMetadata aligns with what commit.js writes ---
            const commitMetadata = {
                commitID: commit.commitId,
                message: commit.message,
                date: commit.timestamp,
                files: commit.files.map(f => f.fileName), // Store just filenames
                previousCommitID: commit.previousCommitID || null, // Include previous commit ID if available from remote
            };
            await fs.writeFile(commitMetadataFile, JSON.stringify(commitMetadata, null, 2));
        }

        // --- Update HEAD to point to the latest remote commit if any new commits were pulled ---
        if (remoteCommits.length > 0) {
            const latestRemoteCommit = remoteCommits[0]; // Assuming response is sorted by newest first from backend
            const headPath = path.join(LOCAL_REPO_PATH, 'HEAD');
            await fs.writeFile(headPath, latestRemoteCommit.commitId);
            console.log(`Local HEAD updated to ${latestRemoteCommit.commitId.substring(0,8)}.`);
        }

        console.log(`✅ Pull complete. ${newCommitsCount} new commit(s) downloaded.`);


    } catch (error) {
        if (error.code === 'ENOENT') {
            console.error('Error: Not a CodeVault repository or you are not logged in. Please run "codevault login" and "codevault init".');
        } else {
            console.error('Error pulling changes:', error.response?.data?.message || error.message);
        }
    }
}


module.exports = { pullRepo };
