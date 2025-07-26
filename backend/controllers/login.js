const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const axios = require('axios');
const inquirer = require('inquirer'); // A library for interactive command-line prompts

// Path to a global config file in the user's home directory
const CONFIG_DIR = path.join(os.homedir(), '.codevault');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// This function will handle the login process
async function loginUser() {
  try {
    // 1. Use inquirer to prompt for email and password securely
    const credentials = await inquirer.prompt([
      { type: 'input', name: 'email', message: 'Enter your CodeVault email:' },
      { type: 'password', name: 'password', message: 'Enter your password:', mask: '*' },
    ]);

    // 2. Make an API call to your backend's login endpoint
    const response = await axios.post('http://localhost:3002/login', {
      email: credentials.email,
      password: credentials.password,
    });

    const { token } = response.data;
    if (!token) {
      console.error('Login failed. No token received.');
      return;
    }

    // 3. Save the token to the global config file
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    await fs.writeFile(CONFIG_FILE, JSON.stringify({ token }));

    console.log('✅ Login successful. Your authentication token has been saved.');
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
  }
}

module.exports = { loginUser };
