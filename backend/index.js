const express = require('express');
const dotenv = require('dotenv'); // Importing dotenv to load environment variables from .env file
const cors = require('cors'); // Importing cors for enabling Cross-Origin Resource Sharing which helps in allowing requests from different origins and also for security purposes
const mongoose = require('mongoose'); // Importing mongoose for MongoDB object modeling
const bodyParser = require('body-parser'); // Importing body-parser to parse incoming request bodies in a middleware before your handlers, available under the req.body property
const http = require('http'); // Importing http module to create an HTTP server
const {Server} = require ('socket.io') // this is used to enable real-time communication between the server and clients using WebSockets
const mainRouter = require('./routes/main.Router'); 

const yargs = require('yargs');   // Importing yargs for command-line argument parsing
const { hideBin } = require('yargs/helpers'); // Hidebin is used to hide the first two arguments (node and script path) and use arguments directly

// Importing the controller functions for handling commands
const { initRepo } = require('./controllers/init');
const { addRepo } = require('./controllers/add'); 
const { commitRepo } = require('./controllers/commit'); 
const {pullRepo} = require('./controllers/pull');
const { pushRepo } = require('./controllers/push');
const { revertRepo } = require('./controllers/revert');

dotenv.config(); // Load environment variables from .env file

// Define the command-line interface with their respective commands and parameters
// Using yargs to create a command-line interface for the version control system
yargs(hideBin(process.argv))
.command('start', 'Start the CodeVault server', {},startServer) 
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
    }, (argv) => {revertRepo(argv.commitID)}) // Using an arrow function to pass the commitID argument to the revertRepo 
    .demandCommand(1, "You need atleast one command")
    .help().argv;

// Function to start the server
function startServer() {
    const app = express();
    const port = process.env.PORT || 3000; // Use the port from environment variables or default to 3000

    app.use(bodyParser.json()); // Middleware to parse JSON bodies
    app.use(express.json()); // Middleware to parse JSON bodies


    //setting up MongoDB connection
    const mongoURI = process.env.MONGODB_URI; 
    mongoose
    .connect(mongoURI)
    .then(() => {
        console.log('MongoDB connected successfully');
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

    app.use(cors({origin:'*'})); // Enable CORS so that the server can accept requests from different origins irrespective of the origin of the request
    app.use('/', mainRouter); // Use the main router for API routes

    let user="test";
    const httpServer = http.createServer(app); // Create an HTTP server using the Express app
    const io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins for WebSocket connections
            methods: ['GET', 'POST'] // Allow GET and POST methods
        }
    });
    io.on('connection', (socket) => {               // When a client connects this function is called
        socket.on('joinRoom', (userID) =>{         // Listen for the 'joinRoom' event from the client
            const user = socket.id;                 // Get the socket ID of the connected user
            user=userID;
            console.log("=====================");
            console.log(`User ${user} connected`);
            console.log("=====================");
            socket.join(userID);                  // Join the user to their specific room

        });
    });
    
const db= mongoose.connection; // Get the MongoDB connection object
//this is my line of code which starts here
    db.on('error', console.error.bind(console, 'MongoDB connection error:')); // Log any connection errors
//this is my line of code which ends here
    db.once('open', async () => {
        console.log('Crud operations are ready'); 

        //CRUD operations 
    });
    httpServer.listen(port, ()=>{
        console.log(`Server is running on port ${port}`); 
    });
}