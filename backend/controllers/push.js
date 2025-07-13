const fs = require('fs').promises;
const path = require('path');
const {s3,S3_BUCKET} = require('../config/aws-config');

async function pushRepo() {
    const repoPath = path.resolve(process.cwd(), '.CodeVault');
    const commitsPath = path.join(repoPath, 'commits');
    try{
        const commitDirs =await fs.readdir(commitsPath);
        for (const commitDir of commitDirs) {                   // Iterate over each commit directory
            const commitPath = path.join(commitsPath, commitDir);
            const files = await fs.readdir(commitPath);
            for (const file of files) {                           // Iterate over each file in the commit directory 
                const filePath = path.join(commitPath, file);
                const fileContent = await fs.readFile(filePath);
                const params = {
                    Bucket: S3_BUCKET,
                    Key: `commits/${commitDir}/${file}`,         // Upload the file to the S3 bucket under the 'commits' directory with the commit ID as a subdirectory
                    Body: fileContent
                };
                    await s3.upload(params).promise(); // Upload the file to S3
                    console.log(`File ${file} from commit ${commitDir} pushed to S3 bucket ${S3_BUCKET}`);
                    
            }
        }
        

    }catch(err) {
        console.error("Error pushing changes to the remote repository:", err);
    }
}
module.exports = { pushRepo };