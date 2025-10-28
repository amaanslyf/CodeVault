// lib/utils/logger.js
const chalk = require('chalk');

function success(message) {
  console.log(chalk.green('✅ ' + message));
}

function error(message) {
  console.log(chalk.red('❌ ' + message));
}

function info(message) {
  console.log(chalk.blue('ℹ ' + message));
}

function warning(message) {
  console.log(chalk.yellow('⚠ ' + message));
}

module.exports = {
  success,
  error,
  info,
  warning
};
