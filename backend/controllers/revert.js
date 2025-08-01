const fs = require('fs').promises; 
const path = require('path');

async function revertRepo(commitID) {
    const repoPath = path.resolve(process.cwd(), '.codevault');
    const commitsPath = path.join(repoPath, 'commits');
    const projectRoot = process.cwd(); 

    try {
        const commitDir = path.join(commitsPath, commitID);

        // Check if the commit directory exists
        try {
            await fs.access(commitDir);
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`Error: Commit ID "${commitID}" not found locally.`);
                return;
            }
            throw err; 
        }
        
        // Read the commit metadata to get the list of files for this commit
        const commitMetadata = JSON.parse(await fs.readFile(path.join(commitDir, 'commit.json'), 'utf8'));
        const filesToRevert = commitMetadata.files; 

        if (!filesToRevert || filesToRevert.length === 0) {
            console.log(`Commit ${commitID} has no tracked files to revert.`);
            return;
        }

        console.log(`Reverting to commit ${commitID.substring(0, 8)}...`);

        // Clean up current working directory first (use with caution!) 
        // This is a more aggressive revert that removes untracked files and replaces all.
        // let currentProjectFiles = await fs.readdir(projectRoot);
        // for (const file of currentProjectFiles) {
        //     if (file !== '.codevault') { // Don't delete your repo's config!
        //         await fs.rm(path.join(projectRoot, file), { recursive: true, force: true });
        //     }
        // }
        // console.log("Cleaned current working directory.");


        for (const file of filesToRevert) {
            const sourceFilePath = path.join(commitDir, file);
            const destinationFilePath = path.join(projectRoot, file); 
            
            try {
                await fs.copyFile(sourceFilePath, destinationFilePath);
                console.log(`  - Copied ${file}`);
            } catch (copyErr) {
                console.error(`  - Failed to copy ${file}: ${copyErr.message}`);
            }
        }
        
        console.log(`✅ Reverted to commit ${commitID.substring(0, 8)} successfully.`);

    } catch (error) {
        console.error("Error in reverting:", error.message);
    }
}
module.exports = { revertRepo };
