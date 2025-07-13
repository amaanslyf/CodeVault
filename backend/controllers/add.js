const fs = require('fs').promises; // Importing the file system module to handle file operations asynchronously
const path = require('path'); 
async function addRepo(filePath){
    const repoPath = path.resolve(process.cwd(), '.CodeVault');
    const stagingPath = path.join(repoPath, 'staging'); // Path to the staging area inside the repository
    try{
        await fs.mkdir(stagingPath, { recursive: true }); // Create the staging area directory if it doesn't exist
        const fileName = path.basename(filePath); // Get the base name of the file to be added
        await fs.copyFile(filePath, path.join(stagingPath, fileName)); // Copy the file to the staging area
        console.log(`File ${fileName} added to staging area`);
    }catch(err){
        console.error("Error adding file to staging area:", err); // Log any errors that occur during the file addition
    }

}
module.exports = {addRepo};