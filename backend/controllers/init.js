const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');
const dotenv = require('dotenv'); 

dotenv.config({ path: path.resolve(__dirname, '../.env') }); 


const API_URL = `http://localhost:${process.env.PORT || 3000}`; 



const GLOBAL_CONFIG_FILE = path.join(os.homedir(), '.codevault', 'config.json');

const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');


async function initRepo() {
    try {
        const repoName = path.basename(process.cwd()); // Use current directory name as repo name


        // Read the saved authentication token from the global config file
        let globalConfig;
        try {
            const configData = await fs.readFile(GLOBAL_CONFIG_FILE, 'utf8');
            globalConfig = JSON.parse(configData);
        } catch (e) {
            console.error('Error: You are not logged in. Please run "codevault login" first.');
            return;
        }


        if (!globalConfig.token) {
            console.error('Error: Authentication token not found. Please run "codevault login" first.');
            return;
        }


        // Make an authenticated API call to the backend to create the repository
        console.log(`Initializing repository "${repoName}" on CodeVault...`);
        const response = await axios.post(
            `${API_URL}/repo/create`, 
            { name: repoName, description: 'Initialized from CLI' }, 
            { headers: { Authorization: `Bearer ${globalConfig.token}` } } // Auth header
        );


        const { repository } = response.data;
        if (!repository || !repository._id) {
            console.error('Failed to initialize repository on the server.');
            return;
        }


        // Create the local .codevault directory and config file
        await fs.mkdir(LOCAL_REPO_PATH, { recursive: true });
        
        // Write the new repository's ID into the local config file
        // This links the local folder to the remote repository
        const localConfig = { repositoryId: repository._id };
        await fs.writeFile(LOCAL_CONFIG_FILE, JSON.stringify(localConfig, null, 2));


        console.log(`✅ Repository "${repoName}" initialized successfully.`);
        console.log(`   Local directory is now linked to remote repository ID: ${repository._id}`);


    } catch (error) {
        console.error('Error initializing repository:', error.response?.data?.message || error.message, error);
    }
}


module.exports = { initRepo };
