# CodeVault 🔐

## A Beginner-Friendly Version Control System

CodeVault is an easy-to-use version control system designed for beginners who want to learn how Git and version control work without the complexity. It features both a **web interface** and a **CLI tool** for managing repositories, commits, and file versioning.

---

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Installation & Setup](#installation--setup)
- [Running Locally](#running-locally)
- [Deployed Application](#deployed-application)
- [CLI Usage](#cli-usage)
- [Project Structure](#project-structure)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 Overview

CodeVault simplifies version control by providing:
- **Web Application**: User-friendly browser interface with Material-UI components
- **CLI Tool**: Command-line interface for developers who prefer terminal-based workflows
- **Cloud Storage**: AWS S3 integration for file storage
- **Database Management**: MongoDB for data persistence
- **Authentication**: JWT-based secure authentication
- **Issue Tracking**: Built-in issue management system
- **Repository Management**: Public and private repositories with access control

---

## ✨ Features

### Core Features
- ✅ **User Authentication**: Signup, Login, Profile Management
- ✅ **Repository Management**: Create, View, Update, Delete repositories
- ✅ **File Version Control**: Add, Commit, Push, Pull, Revert operations
- ✅ **Issue Tracking**: Create and manage issues within repositories
- ✅ **Public/Private Repositories**: Control repository visibility
- ✅ **Commit History**: View and manage commit history
- ✅ **Multi-user Support**: Collaborate with other users
- ✅ **Cloud Storage**: All files stored securely on AWS S3
- ✅ **Material-UI Design**: Modern, responsive user interface

### Advanced Features
- 🔄 **Duplicate Commit Prevention**: Prevents duplicate commits during push operations
- 🔒 **Access Control**: Private repositories only accessible to owner
- 📱 **Public Repository Discovery**: View and access public repositories
- 🗂️ **Staging Area**: Stage files before committing (similar to Git)
- 📊 **Dashboard**: Overview of your repositories and suggested public repositories

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 18.x | UI Framework |
| **Vite** | 5.x | Build tool and dev server |
| **Material-UI (MUI)** | 5.x | Component library |
| **Axios** | 1.6.x | HTTP client for API calls |
| **React Router** | 6.x | Client-side routing |
| **CSS** | 3.x | Styling |
| **JavaScript** | ES6+ | Programming language |

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 14+ | JavaScript runtime |
| **Express.js** | 4.x | Web framework |
| **MongoDB** | 5.x+ | NoSQL database |
| **Mongoose** | 7.x+ | ODM for MongoDB |
| **JWT** | - | Authentication |
| **bcryptjs** | 2.x | Password hashing |
| **AWS SDK** | 2.x | S3 integration |

### CLI Package
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Node.js** | 14+ | JavaScript runtime |
| **Axios** | 1.6.x | HTTP client |
| **Inquirer** | 8.x | Interactive CLI prompts |
| **Yargs** | 17.x | Command-line argument parser |
| **UUID** | 9.x | Unique identifier generation |
| **Form-data** | 4.x | Multipart form data handling |

### Deployment
| Service | Purpose |
|---------|---------|
| **Render** | Backend deployment (https://codevault-pumm.onrender.com) |
| **Vercel/Netlify** | Frontend deployment (https://code-vault-plum.vercel.app/) |
| **MongoDB Atlas** | Cloud MongoDB database |
| **AWS S3** | File storage |

---

## 🏗️ Architecture

```
CodeVault
│
├── Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/ (Login, Signup)
│   │   │   ├── repo/ (Repository operations)
│   │   │   ├── dashboard/ (Dashboard view)
│   │   │   └── user/ (User profile)
│   │   ├── pages/
│   │   ├── api.js (API client)
│   │   └── authContext.jsx (Auth state management)
│   └── package.json
│
├── Backend (Express.js + MongoDB)
│   ├── routes/
│   │   ├── user.router.js
│   │   ├── repo.router.js
│   │   └── issue.router.js
│   ├── controllers/
│   │   ├── userController.js
│   │   ├── repoController.js
│   │   └── issueController.js
│   ├── models/
│   │   ├── userModel.js
│   │   ├── repoModel.js
│   │   └── issueModel.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── authorizeMiddleware.js
│   ├── config/
│   │   └── aws-config.js
│   ├── vcs/ (Version control logic)
│   │   ├── add.js
│   │   ├── commit.js
│   │   ├── push.js
│   │   ├── pull.js
│   │   ├── init.js
│   │   └── revert.js
│   ├── server.js (Entry point)
│   └── package.json
│
└── CLI Package (@amaanslyf/codevault-cli)
    ├── bin/
    │   └── codevault.js
    ├── lib/
    │   ├── config.js
    │   ├── api.js
    │   ├── commands/
    │   │   ├── login.js
    │   │   ├── init.js
    │   │   ├── add.js
    │   │   ├── commit.js
    │   │   ├── push.js
    │   │   ├── pull.js
    │   │   └── revert.js
    │   └── utils/
    │       └── logger.js
    └── package.json
```

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** v14 or higher
- **npm** v6 or higher
- **MongoDB** (local or MongoDB Atlas)
- **AWS S3 Bucket** with credentials
- **Git** (for version control)

### Step 1: Clone or Download the Project

```bash
git clone https://github.com/your-username/CodeVault.git
cd CodeVault
```

### Step 2: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key-make-it-long-and-random
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=your-s3-bucket-name
EOF

# Start backend server
npm start
# Server runs on http://localhost:3000
```

### Step 3: Frontend Setup

```bash
# Navigate to frontend folder
cd ../frontend

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
VITE_APP_API_URL=http://localhost:3000
EOF

# Start development server
npm run dev
# Frontend runs on http://localhost:5173
```

### Step 4: CLI Package Setup (Optional)

```bash
# Navigate to CLI folder
cd ../codevault-cli

# Install dependencies
npm install

# Link locally for testing
npm link

# Test
codevault --help
```

---

## 🚀 Running Locally

### Full Local Development

#### Terminal 1 - Backend:
```bash
cd backend
npm start
```

Expected output:
```
MongoDB connected successfully
Server running on port 3000
```

#### Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Press q to quit
```

#### Terminal 3 - CLI (Optional):
```bash
cd codevault-cli
codevault login
```

### Access Application
- **Web App**: http://localhost:5173
- **Backend API**: http://localhost:3000
- **API Docs**: http://localhost:3000 (routes available)

---

## 🌐 Deployed Application

### Live URLs
- **Web Application**: https://code-vault-plum.vercel.app/
- **Backend API**: https://codevault-pumm.onrender.com (same URL)

### Using the Deployed Application

1. **Visit**: https://code-vault-plum.vercel.app/
2. **Sign Up**: Create a new account
3. **Login**: Login with your credentials
4. **Create Repository**: Start creating and managing repositories
5. **Use CLI**: Developers can use the CLI tool pointing to this deployed backend

### Frontend Pointing to Deployed Backend

Update `frontend/.env`:
```env
VITE_APP_API_URL=https://codevault-pumm.onrender.com
```

Then run:
```bash
npm run dev
```

---

## 💻 CLI Usage

### Installation

```bash
npm install -g @amaanslyf/codevault-cli
```

### Commands

#### 1. Login
```bash
codevault login
# Enter email and password
# Token saved to ~/.codevault/config.json
```

#### 2. Initialize Repository
```bash
cd my-project
codevault init
# Creates .codevault folder
```

#### 3. Add Files
```bash
# Add single file
codevault add filename.txt

# Add all files
codevault add .
```

#### 4. Commit
```bash
codevault commit -m "Your commit message"
```

#### 5. Push
```bash
codevault push
# Uploads commits to server
```

#### 6. Pull
```bash
codevault pull
# Downloads commits from server
```

#### 7. Revert
```bash
codevault revert commit-id
# Reverts to specific commit
```

### Example Workflow
```bash
# Login
codevault login

# Create project folder
mkdir my-vcs-project
cd my-vcs-project

# Initialize
codevault init

# Create and add files
echo "Hello World" > app.js
codevault add .

# Commit
codevault commit -m "Initial commit"

# Push to server
codevault push

# View on web at https://code-vault-plum.vercel.app/
```

---

## 📁 Project Structure

### Backend Structure
```
backend/
├── routes/
│   ├── user.router.js       # User authentication routes
│   ├── repo.router.js       # Repository CRUD routes
│   ├── issue.router.js      # Issue management routes
│   └── main.router.js       # Main router
├── controllers/
│   ├── userController.js    # User logic
│   ├── repoController.js    # Repository logic
│   └── issueController.js   # Issue logic
├── models/
│   ├── userModel.js         # User schema
│   ├── repoModel.js         # Repository schema
│   └── issueModel.js        # Issue schema
├── middleware/
│   ├── authMiddleware.js    # JWT verification
│   └── authorizeMiddleware.js # Permission checks
├── vcs/
│   ├── add.js               # Stage files
│   ├── commit.js            # Create commits
│   ├── push.js              # Upload commits
│   ├── pull.js              # Download commits
│   ├── init.js              # Initialize repo
│   └── revert.js            # Revert commits
├── config/
│   └── aws-config.js        # AWS S3 configuration
├── server.js                # Express app entry
├── index.js                 # Server starter
└── package.json
```

### Frontend Structure
```
frontend/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Signup.jsx
│   │   ├── repo/
│   │   │   ├── CreateRepo.jsx
│   │   │   ├── ViewRepo.jsx
│   │   │   ├── CommitHistory.jsx
│   │   │   ├── FileList.jsx
│   │   │   └── CreateIssue.jsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── user/
│   │   │   └── Profile.jsx
│   │   ├── Navbar.jsx
│   │   └── Layout.jsx
│   ├── api.js               # Axios configuration
│   ├── authContext.jsx      # Auth state
│   ├── Routes.jsx           # Route definitions
│   ├── App.jsx              # Main app
│   ├── main.jsx             # Entry point
│   └── index.css
├── index.html
├── vite.config.js
└── package.json
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /login              # Login user
POST   /signup             # Register user
GET    /me                 # Get current user
PUT    /updateProfile/:id  # Update profile
DELETE /deleteProfile/:id  # Delete account
```

### Repository
```
POST   /repo/create              # Create repository
GET    /repo/all                 # Get all repositories
GET    /repo/public              # Get public repositories
GET    /repo/:id                 # Get repository by ID
GET    /repo/user/:userId        # Get user's repositories
PUT    /repo/:id                 # Update repository
PATCH  /repo/toggle/:id          # Toggle visibility
DELETE /repo/delete/:id          # Delete repository
POST   /repo/push/:id            # Push commits
GET    /repo/pull/:id            # Pull commits
```

### Issues
```
POST   /issue/create/:repoId     # Create issue
GET    /issue/all/:repoId        # Get all issues for repo
PUT    /issue/:id                # Update issue
DELETE /issue/:id                # Delete issue
```

---

## 🔧 Environment Variables

### Backend (.env)
```env
# Server
PORT=3000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codevault

# Authentication
JWT_SECRET=your-super-secret-jwt-key-make-it-very-long-and-random

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=ap-south-1
S3_BUCKET_NAME=codevault-storage

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_APP_API_URL=http://localhost:3000
# or for deployed:
VITE_APP_API_URL=https://codevault-pumm.onrender.com
```

### CLI (.env)
```env
CODEVAULT_API_URL=http://localhost:3000
# or for deployed:
CODEVAULT_API_URL=https://codevault-pumm.onrender.com
```

---

## 📊 Database Schema

### User Model
```javascript
{
  _id: ObjectId,
  username: String (unique, required),
  email: String (unique, required),
  password: String (hashed),
  repositories: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Repository Model
```javascript
{
  _id: ObjectId,
  name: String (unique, required),
  description: String,
  owner: ObjectId (User),
  visibility: Boolean (true=public, false=private),
  commits: [{
    commitId: String,
    message: String,
    timestamp: Date,
    author: ObjectId
  }],
  issues: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Issue Model
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String,
  status: String (open/closed),
  repository: ObjectId,
  creator: ObjectId (User),
  assignee: ObjectId (User),
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start
**Solution:**
```bash
# Check if port 3000 is in use
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill process or use different port
```

### Issue: MongoDB connection error
**Solution:**
- Verify MongoDB is running locally or check connection string for MongoDB Atlas
- Ensure firewall allows MongoDB connections
- Check IP whitelist in MongoDB Atlas

### Issue: AWS S3 errors
**Solution:**
- Verify AWS credentials are correct
- Check S3 bucket exists and is accessible
- Ensure IAM user has S3 permissions

### Issue: Frontend can't connect to backend
**Solution:**
- Check backend is running on correct port
- Update `.env` with correct API URL
- Clear browser cache
- Check CORS settings in backend

### Issue: Login fails on CLI
**Solution:**
- Ensure backend is running
- Verify credentials are correct
- Check API URL in `lib/config.js`
- Account must exist (signup on web first)

### Issue: Duplicate commits appearing
**Solution:**
- This has been fixed in the latest version
- Ensure repoController.js has the duplicate check
- Clear commits folder: `rm -rf .codevault/commits/*`

---

## 📈 Performance Optimization

- **Frontend**: Vite for fast build times and HMR
- **Backend**: Express middleware for efficient request handling
- **Database**: MongoDB indexes on frequently queried fields
- **Storage**: AWS S3 for scalable file storage
- **Caching**: JWT tokens for reduced database queries

---

## 🔐 Security Features

- ✅ **JWT Authentication**: Secure token-based authentication
- ✅ **Password Hashing**: bcryptjs for secure password storage
- ✅ **Access Control**: Private repositories protected
- ✅ **Authorization Middleware**: Verify user permissions
- ✅ **CORS**: Restrict API access to authorized domains
- ✅ **Environment Variables**: Sensitive data not hardcoded

---

## 🚀 Deployment Guide

### Deploy Backend on Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repository
5. Set environment variables
6. Deploy

### Deploy Frontend on Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import project
4. Set environment variable: `VITE_APP_API_URL=deployed-backend-url`
5. Deploy

---

## 📝 Future Enhancements

- [ ] Diff viewer for file changes
- [ ] Branch support
- [ ] Merge functionality
- [ ] Collaboration features
- [ ] Webhook integration
- [ ] Docker support
- [ ] Mobile app
- [ ] Real-time collaboration
- [ ] Advanced permission system

---

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the ISC License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@amaanslyf](https://github.com/amaanslyf)

---


## 🙏 Acknowledgments

- Material-UI for excellent component library
- Render for deployment
- MongoDB for database
- AWS for cloud storage
- Express.js community

---

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Material-UI Docs](https://mui.com)
- [Git Basics](https://git-scm.com/book/en/v2)

---

**Last Updated**: October 31, 2025
**Version**: 1.0.0
