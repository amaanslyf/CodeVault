const os = require('os');
const path = require('path');

// ✅ UPDATE THIS LINE with your deployed backend URL
const API_URL = process.env.CODEVAULT_API_URL || 'https://codevault-pumm.onrender.com';

const GLOBAL_CONFIG_DIR = path.join(os.homedir(), '.codevault');
const GLOBAL_CONFIG_FILE = path.join(GLOBAL_CONFIG_DIR, 'config.json');
const LOCAL_REPO_PATH = path.resolve(process.cwd(), '.codevault');
const LOCAL_CONFIG_FILE = path.join(LOCAL_REPO_PATH, 'config.json');
const STAGING_PATH = path.join(LOCAL_REPO_PATH, 'staging');
const COMMITS_PATH = path.join(LOCAL_REPO_PATH, 'commits');

module.exports = {
  API_URL,
  GLOBAL_CONFIG_DIR,
  GLOBAL_CONFIG_FILE,
  LOCAL_REPO_PATH,
  LOCAL_CONFIG_FILE,
  STAGING_PATH,
  COMMITS_PATH
};
