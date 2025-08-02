const axios = require('axios');
const inquirer = require('inquirer');
const fs = require('fs').promises;
const path = require('path');
const os = require('os');
const dotenv = require('dotenv');


dotenv.config({ path: path.resolve(__dirname, '../.env') });

const API_URL = `http://localhost:${process.env.PORT || 3000}`;

async function loginUser() {
  try {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'email', message: 'Enter your CodeVault email:' },
      { type: 'password', name: 'password', message: 'Enter your password:', mask: '*' },
    ]);

    const response = await axios.post(`${API_URL}/login`, {
      email: answers.email,
      password: answers.password,
    });

    const configDir = path.join(os.homedir(), '.codevault');
    await fs.mkdir(configDir, { recursive: true });
    const configPath = path.join(configDir, 'config.json');
    const config = { token: response.data.token, userId: response.data.userId };
    await fs.writeFile(configPath, JSON.stringify(config, null, 2));

    console.log('✅ Login successful. Your authentication token has been saved.');
  } catch (error) {
    if (error.response) {
      console.error(`Login failed: ${error.response.data.message}`);
    } else if (error.request) {
      console.error(`Login failed: Cannot connect to the CodeVault server at ${API_URL}. Is it running?`);
    } else {
      console.error('Login failed:', error.message);
    }
  }
}

module.exports = { loginUser };
