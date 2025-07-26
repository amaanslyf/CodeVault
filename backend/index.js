const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const mainRouter = require('./routes/main.Router');

const yargs = require('yargs');
const { hideBin } = require('yargs/helpers');

// --- NEW: Import the login controller ---
// This function handles the new "login" command from the terminal.
const { loginUser } = require('./controllers/login');

// Importing the controller functions for the other commands.
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add');
const { commitRepo } = require('./controllers/commit');
const { pullRepo } = require('./controllers/pull');
const { pushRepo } = require('./controllers/push');
const { revertRepo } = require('./controllers/revert');

dotenv.config();

// Define the command-line interface with their respective commands and parameters.
yargs(hideBin(process.argv))
  .command('start', 'Start the CodeVault server', {}, startServer)
  // --- NEW: Add the login command ---
  // This allows users to authenticate from the terminal before using other commands.
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

// Function to start the server
function startServer() {
  const app = express();
  const port = process.env.PORT || 3000;

  app.use(bodyParser.json());
  app.use(express.json());

  // Setting up MongoDB connection
  const mongoURI = process.env.MONGODB_URI;
  mongoose
    .connect(mongoURI)
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });

  app.use(cors(({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })));
  app.use('/', mainRouter); // Use the main router for API routes

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
  });

  io.on('connection', (socket) => {
    socket.on('joinRoom', (userID) => {
      const user = userID || socket.id;
      console.log("=====================");
      console.log(`User ${user} connected`);
      console.log("=====================");
      socket.join(user);
    });
  });

  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));
  db.once('open', async () => {
    console.log('CRUD operations are ready');
  });

  httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
