#!/usr/bin/env node

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

const { loginUser } = require('../lib/commands/login');
const { initRepo } = require('../lib/commands/init');
const { addRepo } = require('../lib/commands/add');
const { commitRepo } = require('../lib/commands/commit');
const { pushRepo } = require('../lib/commands/push');
const { pullRepo } = require('../lib/commands/pull');
const { revertRepo } = require('../lib/commands/revert');

yargs(hideBin(process.argv))
  .command('login', 'Authenticate with your CodeVault account', {}, loginUser)
  .command('init', 'Initialize a new repository', {}, initRepo)
  .command('add <file>', 'Add a file to the repository', (yargs) => {
    yargs.positional('file', {
      describe: 'File to add to the staging area',
      type: 'string'
    })
  }, (argv) => { addRepo(argv.file) })
  .command('commit', 'Commit the staged changes', (yargs) => {
    yargs.option('m', {
      alias: 'message',
      describe: 'Commit message',
      type: 'string',
      demandOption: true
    })
  }, (argv) => { commitRepo(argv.message) })
  .command('push', 'Push commits to the remote repository', {}, pushRepo)
  .command('pull', 'Pull commits from the remote repository', {}, pullRepo)
  .command('revert <commitId>', 'Revert to a specific commit', (yargs) => {
    yargs.positional('commitId', {
      describe: 'Commit ID to revert to',
      type: 'string'
    })
  }, (argv) => { revertRepo(argv.commitId) })
  .demandCommand(1, 'You need at least one command')
  .help()
  .argv;
