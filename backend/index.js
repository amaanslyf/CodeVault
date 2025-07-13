const yargs = require('yargs');   // Importing yargs for command-line argument parsing
const { hideBin } = require('yargs/helpers'); // Hidebin is used to hide the first two arguments (node and script path) and use arguments directly

// Importing the controller functions for handling commands
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add'); 
const { commitRepo } = require('./controllers/commit'); 
const {pullRepo} = require('./controllers/pull');
const { pushRepo } = require('./controllers/push');
const { revertRepo } = require('./controllers/revert');

// Define the command-line interface with their respective commands and parameters
// Using yargs to create a command-line interface for the version control system
yargs(hideBin(process.argv))
    .command('init', 'Initialize a new repository', {}, initRepo) 
    .command('add <file>', 'Add a file to the repository', (yargs) => {
        yargs.positional('file', {
            describe: 'File to add to the staging area',
            type: 'string'
        })
    }, (argv) => {addRepo(argv.file)}) // Using an arrow function to pass the file argument to the addRepo function
    .command('commit <message>', 'Commit changes to the repository', (yargs) => {
        yargs.positional('message', {
            describe: 'Commit message',
            type: 'string'
        })
    }, (argv) => {commitRepo(argv.message)}) // Using an arrow function to pass the message argument to the commitRepo
    .command('pull', 'Pull changes from the remote repository', {}, pullRepo)
    .command('push', 'Push changes to the remote repository', {}, pushRepo)
    .command('revert <commitID>', 'Revert to a previous commit', (yargs) => {
        yargs.positional('commitID', {
            describe: 'ID of the commit to revert to',
            type: 'string'
        })
    }, revertRepo)
    .demandCommand(1, "You need atleast one command")
    .help().argv;

