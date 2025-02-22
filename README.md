# MERN App with Group and Private Messaging

## Overview
This is a full-stack MERN application with group and private messaging features. It uses MySQL for relational data storage and provides users with real-time communication in a modern chat application. The app allows users to send messages to groups or privately to other users.

## Features
- **User Authentication**: Sign up, log in, and JWT-based authentication.
- **Group Messaging**: Create and join groups to send messages in real-time.
- **Private Messaging**: Send direct, private messages to other users.
- **Real-time Messaging**: WebSockets (Socket.IO) for real-time communication.
- **Responsive UI**: Designed with React for a smooth user experience on both desktop and mobile devices.
- **MySQL Database**: MySQL is used for storing user profiles, messages, and group data.
- **User Profiles**: Each user has a profile with a customizable username and avatar.

## Tech Stack
- **Frontend**: React.js, Redux (optional for state management)
- **Backend**: Node.js, Express.js
- **Database**: MySQL
- **Authentication**: JSON Web Tokens (JWT)
- **Real-time Communication**: Socket.IO
- **Styling**: Tailwind Css

## Installation

### Prerequisites
- Node.js (v16 or later)
- MySQL Database
- npm or yarn

### Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/cyrus-nodejs/chatplanet.git
   cd chatplanet
Backend Setup:

Navigate to the backend directory and install dependencies:

bash
copy
cd server
npm install
Create a .env file in the backend folder with the following content (modify accordingly):

bash
copy
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
v=messaging_app
JWT_SECRET=your_jwt_secret

Set up your MySQL database with the following structure:

sql
copy
CREATE DATABASE messaging_app;
-- Add tables for users, private_messages, and group_messages

Start the backend server:

bash
copy
cd server
npm start


Frontend Setup:
Navigate to the frontend directory and install dependencies:

bash
copy
cd client/chatpanet
npm install

Start the frontend server:
npm start
Access the Application:

The frontend will run on http://localhost:3000
The backend will run on http://localhost:5000

Database Schema:
bash
Copy
Users
id (INT, PK)
username (VARCHAR)
email (VARCHAR)
password (VARCHAR, hashed)
avatar_url (VARCHAR, optional)


private_messages

id (INT, PK)
sender_id (INT, FK to Users)
receiver_id (INT, FK to Users, NULLABLE for group messages)
group_id (INT, FK to Groups, NULLABLE for private messages)
message_text (TEXT)
timestamp (TIMESTAMP)

bash
copy
groupchat
id (INT, PK)
group_name (VARCHAR)
created_at (TIMESTAMP)
created_by (INT, FK to Users)


API Endpoints:
Authentication
POST /api/register: User registration
POST /api/login: User login

Groups
POST /api/groups/create: Create a new group
POST /api/add/groupmembers: Add groupmember
GET /api/groups: Get all uer group
GET /api/get/groupmembers: Get group members


Real-Time Features
Socket.IO
Establish a WebSocket connection for real-time messaging using Socket.IO on both the client and server sides.

Example Event:
bash
copy
Private Messaging:
Client emits: socket.emit('private_message', {receiverId, message});
Server listens: socket.on('private_message', (data) => { // handle message });
Clients listen for incoming messages using socket.on('new_message', (message) => { // display message });
Contributing
Feel free to open issues or submit pull requests for bug fixes, enhancements, or new features.

License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgements
Socket.IO for real-time messaging
MySQL for relational database management
JWT for secure authentication
React for building the frontend UI
pgsql
Copy

### Customization
- Replace `your-username` in the clone URL with your GitHub username.
- Modify the `.env` file settings based on your local MySQL configuration.
- If you have other specific dependencies or features, add them to the README.

Feel free to modify it according to your project’s exact structure!
