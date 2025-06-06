# 💬 ChatPlanet – MERN Chat App (with PostgreSQL)

A full-featured real-time chat application built using the **MERN stack** (React, Node, Express) with **PostgreSQL** as the database. Supports group and private messaging, JWT authentication, and Socket.IO-based live messaging.

---

## 📚 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Socket.IO Events](#-socketio-events)
- [License](#-license)

---

## ✨ Features

- ✅ User Authentication (JWT)
- 📬 Real-Time Private Messaging
- 👥 Real-Time Group Messaging
- 🎨 Responsive React UI with Tailwind CSS
- 👤 User Profiles with avatars
- ⚡ Socket.IO WebSocket Communication
- 🛡️ Secure, scalable PostgreSQL backend

---

## 🧱 Tech Stack

| Layer       | Tech Stack              |
|-------------|--------------------------|
| Frontend    | React.js, Tailwind CSS   |
| Backend     | Node.js, Express.js      |
| Database    | PostgreSQL               |
| Auth        | JWT (JSON Web Tokens)    |
| Realtime    | Socket.IO                |
| State (Opt) | Redux (optional)         |

---

## 📦 Installation

### Prerequisites

- Node.js (v16+)
- PostgreSQL
- `npm` or `yarn`

### Clone the Repository

```bash

git clone https://github.com/your-username/chatplanet.git
cd chatplanet
cd server
npm install

```

```
DB_HOST=localhost
DB_USER=your_pg_user
DB_PASSWORD=your_pg_password
DB_NAME=messaging_app
JWT_SECRET=your_jwt_secret

```

### Start the backend server:

```
npm start

```

### Frontend Setup:

```
cd client
npm install
npm start

```

```
The app will be available at:

Frontend: http://localhost:5173

Backend: http://localhost:5000
```

### Database Schema (PostgreSQL)
```
CREATE DATABASE messaging_app;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255),
  email VARCHAR(255),
  password VARCHAR(255),
  avatar_url VARCHAR(255)
);

CREATE TABLE groupchat (
  id SERIAL PRIMARY KEY,
  group_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT REFERENCES users(id)
);

CREATE TABLE private_messages (
  id SERIAL PRIMARY KEY,
  sender_id INT REFERENCES users(id),
  receiver_id INT REFERENCES users(id),
  group_id INT REFERENCES groupchat(id),
  message_text TEXT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

```

## API Endpoints

### Authentication

```
POST /api/register
POST /api/login
```
### Authentication

```
POST /api/groups/create
POST /api/add/groupmembers
GET  /api/groups
GET  /api/get/groupmembers

```
 
## Socket.IO Events

### Example: Private Messaging

#### Client emits:

```
socket.emit('private_message', {
  receiverId: '123',
  message: 'Hello there!'
});

```

### Server listens

```
socket.on('private_message', (data) => {
  // Save to DB and emit to receiver
});

```

### Receiver client:

```
socket.on('private_message', (data) => {
  // Save to DB and emit to receiver
});

```

## 📄 License
This project is licensed under the MIT License.
See the LICENSE file for more information.

## 🌐 Live Demo

- [ChatPlanet Live Demo](https://wen-chat.netlify.app)

## 📎 Related Links

- [React](https://reactjs.org/)
- [Socket.IO](https://socket.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [JWT](https://jwt.io/)