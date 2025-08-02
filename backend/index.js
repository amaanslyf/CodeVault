const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');
const dotenv = require('dotenv');

const { startServer } = require('./server');

const { loginUser } = require('./controllers/login');
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pullRepo } = require('./controllers/pull');
const { pushRepo } = require('./controllers/push');
const { revertRepo } = require('./controllers/revert');

dotenv.config();

yargs(hideBin(process.argv))
  .command('start', 'Start the CodeVault server', {}, startServer)
  .command('login', 'Authenticate with your CodeVault account', {}, loginUser)
  .command('init', 'Initialize a new repository', {}, initRepo)
  .command('add <file>', 'Add a file to the repository', (yargs) => {
    yargs.positional('file', {
      describe: 'File to add to the staging area',
      type: 'string'
    })
  }, (argv) => { addRepo(argv.file) })
  .command('commit <message>', 'Commit changes to the repository', (yargs) => {
    yargs.positional('message', {
      describe: 'Commit message',
      type: 'string'
    })
  }, (argv) => { commitRepo(argv.message) })
  .command('pull', 'Pull changes from the remote repository', {}, pullRepo)
  .command('push', 'Push changes to the remote repository', {}, pushRepo)
  .command('revert <commitID>', 'Revert to a previous commit', (yargs) => {
    yargs.positional('commitID', {
      describe: 'ID of the commit to revert to',
      type: 'string'
    })
  }, (argv) => { revertRepo(argv.commitID) })
  .demandCommand(1, "You need at least one command")
  .help().argv;
