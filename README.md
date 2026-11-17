PocketPhone
==========

ABOUT THE PROJECT
-----------------
PocketPhone is a second-hand smartphone marketplace project designed to help people buy and sell pre-owned phones. It provides a platform where users can explore the marketplace, while sellers can share details about the devices they want to sell.

The main idea behind this project is to give used phones a new life instead of letting them remain unused.

Currently, the frontend mainly contains the marketplace landing page. Live phone listings and complete buying or selling transactions are not available yet.

KEY FEATURES
------------
- Marketplace landing page with different sections introducing PocketPhone.
- Navigation to the phone section, sell page and login page.
- 3D phone model displayed on the landing page.
- Sell flow where users can select a phone brand and continue to the next step.
- Login form with required-field and email validation, along with a password visibility option.
- Backend APIs for user registration, login and profile management.
- Password hashing and JWT-based authentication.


TECH STACK
----------

Frontend

- React 19
- Vite
- React Router
- Three.js, React Three Fiber and Drei for the 3D phone model

Backend

- Node.js
- Express 5
- MongoDB with Mongoose
- bcryptjs for password hashing
- JSON Web Tokens for authentication
- dotenv for environment configuration
- CORS middleware


PROJECT STRUCTURE
-----------------

    .
    ├── backend/
    │   └── src/
    │       ├── config/       MongoDB connection
    │       ├── controllers/  Authentication and user profile logic
    │       ├── middleware/   JWT authentication
    │       ├── models/       Database models
    │       ├── routes/       API routes
    │       └── server.js     Backend server
    ├── public/
    │   ├── images/           Phone images
    │   └── models/           3D phone model
    ├── src/
    │   ├── components/       Landing page sections and shared UI
    │   ├── pages/            Login, sell and not-found pages
    │   ├── App.jsx           Frontend routes
    │   └── main.jsx          Frontend entry point
    ├── package.json          Frontend dependencies
    └── README.md

The dist folder contains the generated frontend build files. It is not part of the source code.


GETTING STARTED
---------------
Prerequisites
- Node.js and npm
- MongoDB running locally or an available MongoDB connection URI

Install dependencies separately for the frontend and backend. Both should be run in separate terminals.

FRONTEND SETUP
--------------
Open a terminal in the project root directory and run:

    npm install
    npm run dev

Vite will show the local development URL in the terminal.

To create a production build, run:

    npm run build


BACKEND SETUP
-------------
Open another terminal and move into the backend directory:

    cd backend
    npm install
    npm run dev

The development server uses nodemon and runs on port 5000 by default.

To start the backend without nodemon, run npm start from the backend directory.


ENVIRONMENT VARIABLES
---------------------
Create a .env file inside the backend folder and add your own configuration:

    MONGO_URI=your_mongodb_connection_uri
    JWT_SECRET=your_secret_key
    PORT=5000

MONGO_URI is used to connect to MongoDB, while JWT_SECRET is used for authentication.

PORT is optional and defaults to 5000. Keep your actual environment values private and never upload your .env file to GitHub.

API OVERVIEW
------------
The following backend endpoints are currently implemented:

| Method | Endpoint | Description | Authentication |
|--------|----------|-------------|----------------|
| GET | / | Backend health status | No |
| POST | /api/auth/register | Register a new user | No |
| POST | /api/auth/login | Login and receive a JWT | No |
| GET | /api/users/me | Get the logged-in user's profile | Yes |
| PUT | /api/users/me | Update the user's name or email | Yes |

The profile endpoints require a valid JWT token in the Authorization header.