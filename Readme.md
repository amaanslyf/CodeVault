CodeVault: A Full-Stack Version Control System
CodeVault is a minimal, full-stack GitHub-like version control system built from the ground up. It features a custom command-line interface (CLI) for Git-like operations and a complete React-based web interface for repository visualization, issue tracking, and user management.

Project Status: Complete
License: MIT

Table of Contents
About The Project

Core Features

Tech Stack & Architecture

Getting Started

Prerequisites

Installation & Setup

Usage Guide

Using the CLI

Using the Web Application

Project Status

About The Project
This project was built to understand the core architectural principles behind version control systems like Git and hosting platforms like GitHub. It separates local versioning (handled by the CLI) from remote storage and collaboration (handled by the web server and web app).

The system allows users to:

Initialize repositories from a custom CLI.

Perform local operations like add and commit.

push commits to a central server where files are stored in Amazon S3 and metadata is stored in MongoDB.

pull changes from the remote server to sync local history.

View repositories, commit history, file lists, and manage issues through a modern React web interface.

Core Features
Secure RESTful API: A backend built with Node.js and Express, secured with JWT-based authentication and ownership-based authorization.

Custom CLI: A powerful command-line interface built with yargs that mimics core Git commands (login, init, add, commit, push, pull).

React Web Application: A complete Single Page Application (SPA) for a rich user experience, including:

User signup and login.

A dashboard to view personal and suggested repositories.

A repository viewer with tabs for code and issues.

A commit history viewer and a list of files per commit.

A fully functional issue tracker.

Cloud Storage Integration: Uses Amazon S3 for scalable and secure storage of all repository file contents.

MongoDB Database: Leverages MongoDB Atlas for storing all metadata related to users, repositories, commits, and issues.

Tech Stack & Architecture
Tech Stack
Backend:

Node.js, Express.js

MongoDB, Mongoose

Amazon S3 (aws-sdk)

JSON Web Tokens (jsonwebtoken), bcrypt.js

Yargs, Multer, Inquirer

Frontend:

React, React Router

Axios

Primer React (for GitHub-like UI components)

Database: MongoDB Atlas

Cloud Storage: Amazon S3

Architecture
The project is a classic client-server application with three main components:

Backend Server (Node.js/Express): The central brain of the application. It handles all business logic, authenticates users, manages metadata in MongoDB, and orchestrates file uploads/downloads with Amazon S3.

CLI Client (Node.js/Yargs): The "Git" part of the project. It allows users to perform version control operations from their terminal. It communicates exclusively with the Backend Server's API for remote operations (login, init, push, pull).

Web Client (React): The "GitHub" part of the project. It provides a graphical user interface for interacting with the platform. It also communicates exclusively with the Backend Server's API.

Getting Started
Follow these instructions to get a local copy up and running.

Prerequisites
You will need the following software and accounts installed on your machine:

Node.js (v16 or later)

npm

A free MongoDB Atlas account for your database.

An AWS account with an S3 bucket created.

Installation & Setup
Clone the repository:

text
git clone https://your-repository-url/CodeVault.git
cd CodeVault
Install Backend Dependencies:

text
cd backend
npm install
Install Frontend Dependencies:

text
cd ../frontend
npm install
Set Up Backend Environment Variables:
In the backend directory, create a .env file and add the following keys. Do not commit this file to Git.

text
# Your MongoDB connection string
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/CodeVault?retryWrites=true&w=majority

# A secret key for signing JWTs (can be any long, random string)
JWT_SECRET_KEY=your_super_secret_key

# The port for the backend server
PORT=3002

# Your AWS credentials and S3 bucket name
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_s3_bucket_name
Usage Guide
1. Running the Application
Start the Backend Server:

text
# From the /backend directory
npm start
The server will be running on http://localhost:3002.

Start the Frontend Development Server:

text
# From the /frontend directory
npm run dev
The web application will be available at http://localhost:5173 (or another port if 5173 is in use).

2. Using the CLI
The CLI is run via node from your terminal.

Step 1: Login
First, you must log in to your CodeVault account.

text
node path/to/your/project/backend/index.js login
Follow the interactive prompts to enter your email and password. This saves an authentication token locally.

Step 2: Initialize a Repository
Create a new folder for your project, cd into it, and then run init.

text
mkdir my-first-project
cd my-first-project
node ../path/to/your/project/backend/index.js init
This creates the repository on the CodeVault server and links your local folder to it.

Step 3: Add and Commit Files
These operations are purely local.

text
# Create a new file
echo "Hello, CodeVault!" > readme.txt

# Add the file to staging
node ../path/to/your/project/backend/index.js add readme.txt

# Commit the staged changes
node ../path/to/your/project/backend/index.js commit -m "Add initial readme file"
Step 4: Push to Remote
Send your local commits to the server.

text
node ../path/to/your/project/backend/index.js push
Step 5: Pull from Remote
Sync your local repository with the version on the server.

text
node ../path/to/your/project/backend/index.js pull
3. Using the Web Application
Navigate to the running frontend application in your browser.

Sign up for a new account or Login with existing credentials.

You will be redirected to the Dashboard, where you can see your repositories.

Click "Create Repository" to create a new repository via the web form.

Click on any repository to go to the Repository View Page.

Use the "Code" tab to view the commit history and the files associated with each commit.

Use the "Issues" tab to view existing issues or submit a new one.

Use the "Settings" tab to manage the repository (e.g., delete it).

Visit the Profile page to manage your password or delete your account.