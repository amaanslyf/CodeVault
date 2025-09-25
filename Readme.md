# 🚀 CodeVault - A Git-like Version Control System for Beginners

<div align="center">

![CodeVault Logo](https://img.shields.io/badge/CodeVault-v1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green.svg)
![Node.js](https://img.shields.io/badge/node.js-v18+-blue.svg)
![React](https://img.shields.io/badge/react-v19.1.0-blue.svg)
![MongoDB](https://img.shields.io/badge/mongodb-v6.17.0-green.svg)

**A beginner-friendly version control system with a modern web interface and familiar Git-like commands**

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📖 About

**CodeVault** is a comprehensive version control system designed specifically for beginners who want to learn Git concepts without the complexity. It provides both a **beautiful web interface** and **familiar command-line tools** that mirror Git functionality, making it the perfect stepping stone for developers new to version control.

### 🎯 Why CodeVault?

- **🎓 Beginner-Friendly**: Simplified Git concepts with clear visual feedback
- **🌐 Modern Web Interface**: Intuitive dashboard with Material UI components  
- **⚡ Terminal Integration**: Git-like commands (`codevault init`, `add`, `commit`, `push`)
- **📁 Repository Management**: Create, clone, and manage repositories with ease
- **🔍 Visual Commit History**: Track changes with an interactive commit timeline
- **🐛 Issue Tracking**: Built-in bug and feature request management
- **🔐 Access Control**: Public and private repository support
- **☁️ Cloud Storage**: AWS S3 integration for file storage
- **🚀 Real-time Updates**: Socket.io for live collaboration features

---

## ✨ Features

### 🎮 Web Interface
- **Modern Dashboard**: Overview of all your repositories with search and filtering
- **Repository Browser**: Explore files, commits, and issues in a GitHub-like interface
- **Interactive Terminal**: Execute Git-like commands directly in the browser
- **User Management**: Complete authentication system with profiles
- **Issue Tracking**: Create, assign, and manage project issues
- **Real-time Notifications**: Live updates for repository activities

### 💻 Command Line Interface
```bash
# Initialize a new repository
codevault init

# Add files to staging area
codevault add filename.txt
codevault add .

# Commit changes
codevault commit "Your commit message"

# Push to remote repository
codevault push

# Pull latest changes
codevault pull

# Revert to previous commit
codevault revert commitId

# User authentication
codevault login
```

### 🔧 Core Functionality
- **Version Control**: Track file changes with commit history
- **Branching Simulation**: Basic branching concepts for beginners
- **Remote Repositories**: Push/pull operations to cloud storage
- **Collaboration**: Multi-user support with access permissions
- **File Management**: Upload, download, and organize project files
- **Backup & Restore**: Revert to any previous commit state

---

## 🏗️ Architecture

CodeVault follows a **modern full-stack architecture**:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (React + Vite)                │
├─────────────────────────────────────────────────────────────┤
│  • Material UI Components    • Real-time Terminal          │
│  • Repository Dashboard      • Interactive Git Commands    │
│  • Authentication System     • Issue Management            │
└─────────────────────────────────────────────────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │    REST API       │
                    │  (Express.js)     │
                    └─────────┬─────────┘
                              │
                    ┌─────────▼─────────┐
                    │    Database       │
                    │   (MongoDB)       │
                    └───────────────────┘
                              │
                    ┌─────────▼─────────┐
                    │   File Storage    │
                    │    (AWS S3)       │
                    └───────────────────┘
```

### Tech Stack

**Backend:**
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Document database
- **Mongoose** - ODM for MongoDB
- **Socket.io** - Real-time communication
- **AWS S3** - Cloud file storage
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

**Frontend:**
- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Material UI** - Component library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Context API** - State management

**CLI Tools:**
- **Yargs** - Command-line argument parsing
- **Inquirer** - Interactive command prompts
- **Form-data** - File upload handling

---

## 📋 Prerequisites

Before installing CodeVault, ensure you have:

- **Node.js** v18 or higher
- **MongoDB** (local installation or MongoDB Atlas)
- **AWS Account** (for S3 file storage)
- **Git** (for cloning the repository)

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/codevault.git
cd codevault
```

### 2. Backend Setup
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure your `.env` file:**
```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/codevault

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key-id
AWS_SECRET_ACCESS_KEY=your-aws-secret-access-key
AWS_REGION=us-east-1
S3_BUCKET_NAME=codevault-files
```

### 3. Frontend Setup
```bash
# Navigate to frontend directory (in a new terminal)
cd frontend

# Install dependencies
npm install

# Create environment file (optional)
echo "VITE_APP_API_URL=http://localhost:3000" > .env
```

### 4. Database Setup
Make sure MongoDB is running:
```bash
# For local MongoDB
mongod

# Or using MongoDB service (Linux/Mac)
sudo service mongod start
```

---

## 🎯 Usage

### Starting the Application

1. **Start the Backend Server:**
```bash
cd backend
npm start
```
The server will start on `http://localhost:3000`

2. **Start the Frontend Development Server:**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`

### Using the Web Interface

1. **Create an Account**: Visit `http://localhost:5173/signup`
2. **Login**: Navigate to `http://localhost:5173/login`
3. **Create Repository**: Click "Create Repository" on the dashboard
4. **Upload Files**: Use the web interface to upload and manage files
5. **View Commits**: Explore the commit history and file changes
6. **Manage Issues**: Create and track project issues

### Using the Command Line

1. **Install CLI globally** (optional):
```bash
cd backend
npm link
```

2. **Login to your account:**
```bash
codevault login
```

3. **Initialize a new repository:**
```bash
mkdir my-project
cd my-project
codevault init
```

4. **Add and commit files:**
```bash
echo "Hello World" > hello.txt
codevault add hello.txt
codevault commit "Add hello world file"
```

5. **Push to remote:**
```bash
codevault push
```

---

## 📚 API Documentation

### Authentication Endpoints
```
POST   /signup              - Create new user account
POST   /login               - User authentication
GET    /me                  - Get current user profile
PUT    /updateProfile/:id   - Update user profile
DELETE /deleteProfile/:id   - Delete user account
```

### Repository Endpoints
```
GET    /repo/all            - Get all repositories
GET    /repo/public         - Get public repositories
GET    /repo/user/:userId   - Get user's repositories
GET    /repo/viewrepo/:id   - Get repository details
POST   /repo/create         - Create new repository
PUT    /repo/update/:id     - Update repository
PUT    /repo/toggle/:id     - Toggle repository visibility
DELETE /repo/delete/:id     - Delete repository
POST   /repo/push/:id       - Push files to repository
GET    /repo/pull/:id       - Pull repository data
```

### Issue Management Endpoints
```
GET    /issue/all/:repoId   - Get all issues for repository
GET    /issue/:id           - Get specific issue
POST   /issue/create/:repoId - Create new issue
PUT    /issue/update/:id    - Update issue
DELETE /issue/delete/:id    - Delete issue
```

---

## 📁 Project Structure

```
codevault/
├── backend/
│   ├── controllers/         # Request handlers
│   │   ├── userController.js
│   │   ├── repoController.js
│   │   ├── issueController.js
│   │   ├── login.js         # CLI login handler
│   │   ├── init.js          # Repository initialization
│   │   ├── add.js           # File staging
│   │   ├── commit.js        # Commit creation
│   │   ├── push.js          # Push to remote
│   │   └── pull.js          # Pull from remote
│   ├── models/              # Database schemas
│   │   ├── userModel.js
│   │   ├── repoModel.js
│   │   └── issueModel.js
│   ├── routes/              # API routes
│   │   ├── main.router.js
│   │   ├── user.router.js
│   │   ├── repo.router.js
│   │   └── issue.router.js
│   ├── middleware/          # Custom middleware
│   │   ├── authMiddleware.js
│   │   └── authorizeMiddleware.js
│   ├── config/              # Configuration files
│   │   └── aws-config.js
│   ├── index.js            # CLI entry point
│   ├── server.js           # Server configuration
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/      # React components
    │   │   ├── auth/        # Authentication components
    │   │   ├── dashboard/   # Dashboard components
    │   │   ├── repo/        # Repository components
    │   │   ├── user/        # User profile components
    │   │   └── terminal/    # Terminal interface
    │   ├── theme/           # Material UI theme
    │   ├── authContext.jsx  # Authentication context
    │   ├── api.js          # API client
    │   ├── Routes.jsx      # Route configuration
    │   ├── Layout.jsx      # App layout
    │   └── main.jsx        # App entry point
    ├── public/             # Static assets
    └── package.json
```

---

## 🔧 Configuration

### Environment Variables

**Backend (.env)**:
- `MONGODB_URI` - Database connection string
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret key for JWT tokens
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `AWS_REGION` - AWS region
- `S3_BUCKET_NAME` - S3 bucket name

**Frontend (.env)** (optional):
- `VITE_APP_API_URL` - Backend API URL

### AWS S3 Setup
1. Create an AWS account and S3 bucket
2. Set up IAM user with S3 permissions
3. Configure bucket CORS policy:
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## 🚀 Development

### Running in Development Mode

**Backend with auto-reload:**
```bash
cd backend
npm install -g nodemon
nodemon index.js start
```

**Frontend with hot reload:**
```bash
cd frontend
npm run dev
```

### Building for Production

**Frontend build:**
```bash
cd frontend
npm run build
```

**Serve frontend build:**
```bash
npm run preview
```

---

## 🧪 Testing

Currently, CodeVault includes basic testing setup. To run tests:

```bash
# Backend tests
cd backend
npm test

# Frontend tests  
cd frontend
npm test
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** and test thoroughly
4. **Commit your changes**: `git commit -m 'Add amazing feature'`
5. **Push to the branch**: `git push origin feature/amazing-feature`
6. **Open a Pull Request**

### Development Guidelines
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test your changes before submitting
- Use meaningful commit messages

---

## 📝 License

This project is licensed under the **ISC License** - see the [LICENSE](LICENSE) file for details.

---

## 🔄 Changelog

### v1.0.0 (Current)
- ✅ Complete web interface with Material UI
- ✅ Git-like CLI commands implementation
- ✅ Repository management with file uploads
- ✅ User authentication and profiles
- ✅ Issue tracking system
- ✅ Real-time terminal interface
- ✅ AWS S3 integration
- ✅ Responsive design

### Upcoming Features
- 🔄 Docker containerization
- 🔄 Enhanced branching support
- 🔄 Collaborative editing
- 🔄 Advanced search and filtering
- 🔄 Repository templates
- 🔄 Integration with external Git providers

---

<div align="center">

**Made with ❤️ by [Abdulshakkur Shaikh](https://github.com/yourusername)**

[![GitHub Stars](https://img.shields.io/github/stars/yourusername/codevault?style=social)](https://github.com/yourusername/codevault)
[![GitHub Forks](https://img.shields.io/github/forks/yourusername/codevault?style=social)](https://github.com/yourusername/codevault)

</div>