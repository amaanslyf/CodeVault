const fs = require('fs').promises; // Importing the file system module to handle file operations asynchronously
const path = require('path'); 
const {v4:uuidv4} = require('uuid'); // Importing uuidv4 to generate unique commit IDs
async function commitRepo(message) {
    const repoPath = path.resolve(process.cwd(), '.CodeVault'); 
    const stagingPath = path.join(repoPath, 'staging'); 
    const commitsPath = path.join(repoPath, 'commits');
    try{
        const commitID = uuidv4(); // Generate a unique commit ID
        const commitDir= path.join(commitsPath, commitID); // Create a directory for the commit using the unique ID inside the commits directory
        await fs.mkdir(commitDir, { recursive: true }); // Create the commit directory if it doesn't exist
        const files = await fs.readdir(stagingPath); // Read the files from the staging area
        for(const file of files) {
            await fs.copyFile(path.join(stagingPath, file), path.join(commitDir, file)); // Copy each file from the staging area to the commit directory
        }
        await fs.writeFile(path.join(commitDir, "commit.json"), JSON.stringify({ message, commitID, date: new Date().toISOString() })); // Create a commit file with the commit message, ID, and timestamp
       //my own additon starts here
        await fs.rm(stagingPath, { recursive: true }); // Remove the staging area after committing
        //my own addition ends here
        console.log(`Changes committed successfully with ID: ${commitID}`);

    }catch(err){
        console.error("Error committing changes:", err); 
    }
}
module.exports = { commitRepo };