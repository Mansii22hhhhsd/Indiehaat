# Freelancer Platform - MERN Stack

A basic freelancer platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- JWT Authentication (Login/Register)
- User Profiles for Freelancers
- Dashboard with stats
- Profile management

## Project Structure

- `/backend` - Node.js/Express.js server
- `/frontend` - React.js client application

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed locally or MongoDB Atlas account
- Basic knowledge of terminal/command line

### Backend Setup

1. Navigate to the backend directory:
   ```
   cd backend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env` file in the backend directory with the following variables:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   
   Note: Replace `your_mongodb_connection_string` with your MongoDB connection string 
   and `your_jwt_secret_key` with a secure random string.

4. Start the backend server:
   ```
   npm run server
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```
   cd frontend
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the React development server:
   ```
   npm start
   ```

4. The application should now be running at http://localhost:3000

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get token
- `GET /api/auth/user` - Get authenticated user details

### Profile
- `GET /api/profile/me` - Get current user's profile
- `PUT /api/profile` - Update user profile
- `GET /api/profile` - Get all profiles
- `GET /api/profile/:user_id` - Get profile by user ID