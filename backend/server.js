const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const http = require('http');
const { Server } = require('socket.io');
const mainRouter = require('./routes/main.Router');

// --- NOTE: dotenv.config() is called here to load environment variables for the server ---
dotenv.config();

// This function contains all the original server startup logic
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

// --- NEW: Export the startServer function so it can be used by index.js ---
module.exports = { startServer };
