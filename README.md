# MEAP Project Management System

A web application for organizing and tracking progress of the MEAP capstone project. Built with React, Express, and MongoDB.

## Features

- Blog post management with markdown support
- Research paper tracking system
- User authentication for admin access
- Public access to blog posts and research papers
- Markdown support for blog posts and paper notes

## Tech Stack

### Frontend
- React
- Chakra UI
- React Router
- Axios

### Backend
- Express.js
- MongoDB
- JWT Authentication
- Markdown-it

## Project Structure

```
meaplog/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   └── utils/
│   └── public/
└── backend/           # Express backend application
    ├── models/
    ├── routes/
    ├── controllers/
    └── middleware/
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
2. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```
3. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```
4. Create a .env file in the backend directory with the following variables:
   ```
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   PORT=5000
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend development server:
   ```bash
   cd frontend
   npm start
   ```

The application will be available at `http://localhost:3000`

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new admin user
- POST /api/auth/login - Login user

### Blog Posts
- GET /api/blog - Get all blog posts
- GET /api/blog/:id - Get a specific blog post
- POST /api/blog - Create a new blog post (admin only)
- PUT /api/blog/:id - Update a blog post (admin only)
- DELETE /api/blog/:id - Delete a blog post (admin only)

### Research Papers
- GET /api/papers - Get all research papers
- GET /api/papers/:id - Get a specific paper
- POST /api/papers - Add a new paper (admin only)
- PUT /api/papers/:id - Update a paper (admin only)
- DELETE /api/papers/:id - Delete a paper (admin only)
- PUT /api/papers/:id/read - Mark paper as read/unread
- PUT /api/papers/:id/notes - Update paper notes
