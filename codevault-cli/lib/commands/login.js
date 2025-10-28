const inquirer = require('inquirer');
const fs = require('fs').promises;
const { apiLogin } = require('../api');
const { GLOBAL_CONFIG_DIR, GLOBAL_CONFIG_FILE } = require('../config');

async function loginUser() {
  try {
    const answers = await inquirer.prompt([
      { type: 'input', name: 'email', message: 'Enter your CodeVault email:' },
      { type: 'password', name: 'password', message: 'Enter your password:', mask: '*' }
    ]);

    console.log('Logging in...');
    const data = await apiLogin(answers.email, answers.password);

    await fs.mkdir(GLOBAL_CONFIG_DIR, { recursive: true });
    const config = { token: data.token, userId: data.userId };
    await fs.writeFile(GLOBAL_CONFIG_FILE, JSON.stringify(config, null, 2));

    console.log('✅ Login successful!');
  } catch (error) {
    console.error('❌ Login failed:', error.message);
    process.exit(1);
  }
}

module.exports = { loginUser };
