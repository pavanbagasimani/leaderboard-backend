Real-time Leaderboard API
This is the backend for a real-time leaderboard application. It handles user authentication, score submissions, and broadcasts live leaderboard updates to clients using WebSockets.

Technologies Used
Node.js: Server-side runtime environment.

Express.js: Web framework for handling API routes.

Socket.IO: Enables real-time, bidirectional communication.

PostgreSQL: Primary database for user and score data.

Redis: In-memory data store used for caching.

Docker: Containerization platform for running services.

JWT & Bcrypt: For secure user authentication.

Getting Started
Follow these steps to get the server running on your local machine.

Prerequisites
Node.js and npm installed.

Docker installed and running.

Installation
Clone the repository:

Bash

git clone https://github.com/pavanbagasimani/leaderboard-backend.git
Navigate to the project directory:

Bash

cd leaderboard-backend
Install dependencies:

Bash

npm install
Create a .env file in the root directory:

PORT=4000
MONGO_URI=mongodb://127.0.0.1:27017/leaderboard_dev
JWT_SECRET=devsecret123
REDIS_URL=redis://127.0.0.1:6379

Running the Services
Start the Redis Docker container:

Bash

docker run --name leaderboard-redis -p 6379:6379 -d redis
Start the backend server:

Bash

npm start
The API will be available at http://localhost:4000.

API Endpoints
The API provides the following endpoints for the frontend to consume:

POST /api/auth/register - Registers a new user.

POST /api/auth/login - Authenticates a user and returns a JWT.

GET /api/config - Fetches available regions and modes.

POST /api/leaderboard/score - Submits a new score for the authenticated user.
