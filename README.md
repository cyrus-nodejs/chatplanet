mysql mern app socket.io chatting app  with group message and private messaging

Creating a chatting app with group messages and private messaging using MySQL, MERN stack (MongoDB, Express.js, React, Node.js), and Socket.io is a great project. Below is an outline and a few implementation steps for you to follow. I will break down the key components of the app and provide examples where possible.

Tech Stack:
MySQL for storing user data, messages, and group details.

Express.js and Node.js for backend.
React.js for frontend.
Socket.io for real-time communication.

Step-by-Step Implementation:
1. Database Schema (MySQL)
You need to design MySQL tables for users, messages, and groups.

Tables:

Users Table:
 id VARCHAR(255) UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image json DEFAULT NULL,
    mobile VARCHAR(255) DEFAULT NULL UNIQUE,
    country VARCHAR(255) DEFAULT NULL ,
    status ENUM('offline', 'online') DEFAULT 'offline',
    resettoken VARCHAR(255) DEFAULT NULL,
    date_created TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    INDEX (id),
    PRIMARY KEY (id)

Private_Messages Table:
 id INT AUTO_INCREMENT,
     userid INT NOT NULL,
     sender_id INT,
    receiver_id INT,
    message_text VARCHAR(255),
     media JSON,
    type ENUM('text', 'image', 'video', 'voice') DEFAULT 'text',
    status ENUM('sent', 'delivered', 'seen') DEFAULT 'sent',
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    PRIMARY KEY (id),
    INDEX (userid),
    FOREIGN KEY (userid) 
    REFERENCES users(id)

group_messages Table:

  group_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  media json,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (group_id, user_id),
  FOREIGN KEY (group_id)  REFERENCES groupchat(id),
  FOREIGN KEY (user_id)   REFERENCES users(id)

  groupchat Table:
  
 groupId VARCHAR(255) NOT NULL,
  name VARCHAR(255) UNIQUE,
   description   VARCHAR(255),
   createdBy VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (groupId)  REFERENCES group_chat(id),
  FOREIGN KEY (userId)   REFERENCES users(id)

    
group_member Table:

  group_id VARCHAR(255) NOT NULL,
  user_id VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  media json,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (group_id, user_id),
  FOREIGN KEY (group_id)  REFERENCES groupchat(id),
  FOREIGN KEY (user_id)   REFERENCES users(id)



  
2. Backend Setup (Node.js + Express + Socket.io)
Install dependencies: express, mysql2, socket.io, cors, jsonwebtoken (for authentication), etc.
Install Packages:

bash
Copy
npm init -y
npm install express socket.io mysql2 cors jsonwebtoken bcryptjs
Create an Express Server:

js
Copy

MySQL Queries to Save Messages:

js
Copy
const mysql = require('mysql2');
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'chat_db'
});

// Function to save messages to MySQL
const saveMessage = (message) => {
    const query = 'INSERT INTO messages (sender_id, receiver_id, group_id, message_text, timestamp) VALUES (?, ?, ?, ?, ?)';
    db.execute(query, [message.senderId, message.receiverId, message.groupId, message.messageText, message.timestamp]);
};
3. Frontend Setup (React)import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';
import mysql from 'mysql2';
import express, { Express, Request, Response } from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import { pool } from "../models/connectDb";
import authRoutes from '../routes/Auth'
import chatRoutes from '../routes/Messages'
import profileRoutes from '../routes/User'
import contactRoutes from '../routes/Contact'
import groupRoutes from '../routes/Groups'
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors"
import { authenticateJWT } from '../middlewares/jwt/jwt';
import cookieParser from 'cookie-parser';
import { uploadToCloudinary } from '../utils/cloudinary';

dotenv.config()
// const crypto = require("crypto")
// let token = crypto.randomBytes(64).toString('hex');
// console.log(token)


const app: Express = express();

const httpServer = createServer(app);
const port = process.env.PORT ;
const io = new Server(httpServer,  {
  cors: {
    origin: 'http://localhost:5173',  // replace with your React app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  },
  perMessageDeflate: {
    threshold: 1024,
  },
});


//  console.log(authenticator.generateKey())
      

    


// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.json({ limit: "100mb"}));
 app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));



const allowedOrigins = ['http://localhost:5173'];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true); // allow the request
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

// Use the CORS middleware with specific options
app.use(cors(corsOptions));



app.set('trust proxy', 1) 

app.get("/", authenticateJWT, (req: any, res: any) => {
 
  res.send(`Express + TypeScript Server ${req.user.firstname} `);
});

app.use("/", authRoutes );
app.use("/", chatRoutes );
app.use("/", profileRoutes );
app.use("/", contactRoutes );
app.use("/", groupRoutes );


//CREATE DATBASE CONNECTION
const connectDB = () => {
  pool.connect(async (err:any) => {
    if (err) throw err;
    console.log("DB connected successful: " );
    
  })
}

connectDB()


httpServer.listen(port, () => {
  console.log(`[server]: ChatPlanet Server Active!!! http://localhost:${port}`);
});



// Socket.IO: handle user connections
let users : any = {};

io.on('connection', (socket) => {


 // Handle user joining
 socket.on('login', (sender_id) => {
  try{
  users[sender_id] = socket.id;

    // Update online Users status in database
     const sqlUpdate = `UPDATE users   SET status = 'online', last_seen = NOW()  WHERE  id = '${sender_id}'`
    //  const insert_query = mysql.format(sqlUpdate,["online",  sender_id])
     pool.query(sqlUpdate, async (err:any, result:any) => {
      if (err) throw err;
          //  console.log(`${sender_id} socket active`)
      })
  io.emit('onlineUsers', users); // Emit connected users list
}catch(err){
  console.log(err)
}
});

try{
 // Emit chat history when a user connects
 socket.on('requestChatHistory', (data) => {
  const {sender_id, receiver_id} = data
  pool.query(
    'SELECT * FROM private_messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC',
    [sender_id, receiver_id, receiver_id, sender_id],
    (err, results) => {
      if (err) throw err;
      // console.log(`privateChatHistory: ${results}`)
      socket.emit('chatHistory', results);
    }
  );

})
}catch (err){
console.log(err)
}
   
    
 // Handle private messages
 socket.on('private_message', (messageData) => {
  try{
  const {  receiver_id, message, sender_id } = messageData;
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, message, status) VALUES (?,?,?,?,?)"
     const insert_query = mysql.format(sqlInsert,[uuidv4(), sender_id, receiver_id, message, 'delivered'])
            pool.query (insert_query, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.affectedRows}`)
            
             })
   if (users[receiver_id]) {
    io.to(users[receiver_id]).emit('private_message', { sender_id, message });
    console.log(`${message} sent to ${users[receiver_id]}`)
    console.log(receiver_id)
  }
}catch (err){
  console.log(err)
      }
   
});




// Handle private messages
 socket.on('private_media', (mediaData) => {
  try{
      
  const {  receiver_id, media, sender_id } = mediaData

  const image = media.image
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, media, status) VALUES (?,?,?,?,?)"
     const insert_query = mysql.format(sqlInsert,[uuidv4(), sender_id, receiver_id, image, 'delivered'])
            pool.query (insert_query, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.affectedRows}`)
            
             })
   if (users[receiver_id]) {
    io.to(users[receiver_id]).emit('private_message', { sender_id, media });
    console.log(`${media} sent to ${users[receiver_id]}`)
    console.log(receiver_id)
  }
}catch (err){
  console.log(err)
      }
   
});

// Handle private messages
 socket.on('private_files', (fileData) => {
  try{
  const {  receiver_id, files, sender_id } = fileData;
  const file = files.Files
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, files, status) VALUES (?,?,?,?,?)"
     const insert_query = mysql.format(sqlInsert,[uuidv4(), sender_id, receiver_id, file, 'delivered'])
            pool.query (insert_query, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.affectedRows}`)
            
             })
   if (users[receiver_id]) {
    io.to(users[receiver_id]).emit('private_message', { sender_id, files });
    console.log(`${files} sent to ${users[receiver_id]}`)
    console.log(receiver_id)
  }
}catch (err){
  console.log(err)
      }
   
});
   

  // Join a group (room)
  socket.on('joinGroup', (group_id) => {
    socket.join(group_id);
    // console.log(`User joined group: ${group_id}`);
  });


 
  // Handle group messages
  socket.on('group_message', (messageData) => {
    const { user_id, group_id, message } = messageData;
    console.log(`socket ${messageData}`)

       const sqlInsert = "INSERT INTO group_messages( group_id, user_id, message) VALUES (?,?,?)"
       const insert_query = mysql.format(sqlInsert,[ group_id, user_id, message])
              pool.query (insert_query, (err, result:any)=> {
                if (err) throw err;
              // console.log(`group message: ${result}`)
               })
          
    io.to(group_id).emit("group_message", messageData); // Broadcast to group
  });

    // Handle group messages
    socket.on('group_media', (mediaData) => {
      const { user_id, group_id, media } = mediaData;
      console.log(`socket ${mediaData}`)
  
         const sqlInsert = "INSERT INTO group_messages( group_id, user_id, media) VALUES (?,?,?)"
         const insert_query = mysql.format(sqlInsert,[ group_id, user_id, media])
                pool.query (insert_query, (err, result:any)=> {
                  if (err) throw err;
                // console.log(`group message: ${result}`)
                 })
            
      io.to(group_id).emit("group_message", mediaData); // Broadcast to group
    });

      // Handle group messages
  socket.on('group_files', (fileData) => {
    const { user_id, group_id, files } = fileData;
    console.log(`socket ${fileData}`)

       const sqlInsert = "INSERT INTO group_messages( group_id, user_id, files) VALUES (?,?,?)"
       const insert_query = mysql.format(sqlInsert,[ group_id, user_id, files])
              pool.query (insert_query, (err, result:any)=> {
                if (err) throw err;
              // console.log(`group message: ${result}`)
               })
          
    io.to(group_id).emit("group_message", fileData); // Broadcast to group
  });


 // Emit groupchat history when a user connects
 socket.on('requestGroupChatHistory', (group_id) => {
  try{

    pool.query(
      'SELECT * FROM group_messages WHERE group_id = ?  ORDER BY timestamp ASC',
      [group_id],
      (err, results) => {
        if (err) throw err;
        // console.log(`groupchathistory: ${results}`)
        socket.emit('groupChatHistory', results);
      }
    );
  
}catch (err){

}

})
 

  // Leave group (room)
  socket.on('leaveGroup', (group_id) => {
    socket.leave(group_id);
    // console.log(`User left group: ${group_id}`);
  });

  // Handle disconnect

    socket.on('disconnect', () => {
      try{
      for (let userId in users) {
        if (users[userId] === socket.id) {
          delete users[userId];
            // console.log("DB connected successful: " );
            // Update online Users status in database
            const sqlUpdate = `UPDATE users   SET status = 'offline',  last_seen = NOW()  WHERE  id = '${userId}'`
            // const insert_query = mysql.format(sqlUpdate,["offline", userId])
            pool.query(sqlUpdate, async (err:any, result:any) => {
             if (err) throw err;
                //  console.log(`${users[userId]} disconnected`)
             })
          
     
          break;
        }
      }
      // console.log(`User ${socket.id} disconnected`);
    }catch (err){
    
    }
   
    });

});
Install dependencies: react, axios (for API calls), socket.io-client (for real-time communication).
Install Packages:

bash
Copy
npm install react socket.io-client axios
Connect to Socket.io in React:

js
Copy
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';

const ChatApp = () => {
    const [socket, setSocket] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [roomId, setRoomId] = useState(''); // Group or private chat room ID

    useEffect(() => {
        const newSocket = socketIOClient('http://localhost:5000');
        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('receiveMessage', (msg) => {
                setMessages((prevMessages) => [...prevMessages, msg]);
            });
        }
    }, [socket]);

    const sendMessage = () => {
        if (socket) {
            const messageData = {
                senderId: 1, // Replace with actual user ID
                receiverId: 2, // Replace with receiver ID or null for group messages
                groupId: roomId,
                messageText: message,
                timestamp: new Date().toISOString(),
            };
            socket.emit('sendMessage', messageData);
            setMessages((prevMessages) => [...prevMessages, messageData]);
            setMessage('');
        }
    };

    return (
        <div>
            <h2>Chat</h2>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <p>{msg.messageText}</p>
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatApp;
4. User Authentication
You’ll need JWT-based authentication for users (login, registration). Below is an example of how you could authenticate users in the backend.

User Authentication in Express:

js
Copy
import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import mysql from 'mysql2';
import { createAccessToken, forgotPasswordToken, create2FAtoken } from '../middlewares/jwt/jwt';
import { contactEmail } from '../utils/nodemailer';

import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

// email password authentication
export const LoginUser  = async (req:any, res:any, next:any) =>{
    const { email, password} = req.body
    console.log(email, password)
          const sqlSearch = "Select * from users where email = ?"
          const search_query = mysql.format(sqlSearch,[email]) //mysql prepared statement
           pool.query (search_query, async (err, result:any) => {
              if (err){
    return res.json({success:false, message:"Cannot find user!"}) 
              }else{
                 if ( await bcrypt.compare(password, result[0].password)) {
        const secret = speakeasy.generateSecret({name: "Chatplanet"});
      const mfaCode = speakeasy.totp({secret: secret.base32,encoding: 'base32'});
               await contactEmail.sendMail({
                  from: '"ChatPlanet 👻" adeyemiemma45@gmail.com>', // sender address
                  to: `${result[0].email}`, // list of receivers
                  subject: "2FA CODE", // Subject line
                  text: "Hello world?", // plain text body
                  html: `You are receiving this email because a request was made for a one-time code that can be used for authentication.
      Please enter the following code for verification:
      ${mfaCode} . MFA Code valid for 15 minutes
      If you did not request this change, please change your password or use the chat in the ChatPlanet Interface to contact us.`, // html body
                });
                const data = {id: result[0].id,  email:result[0].email, firstname: result[0].firstname, lastname:result[0].lastname, key:secret.base32}
                const token = create2FAtoken(data)
              res.cookie("token", token , {withCredentials: true,httpOnly:false});
                 res.json({success:true, message:`MFA code sent to ${result[0].email}`})
                } else{
                
                res.json({success:false, message:"Password doesn't match"})
                }
                
                
              }
               
        }  ) 
    
    
   
 
    }
5. Group and Private Messaging
For group messaging, users will join rooms via Socket.io based on the group ID. All members of the group will be able to see the messages.
For private messaging, users will directly message each other, and only the sender and receiver will see the message.
Conclusion
This is a basic structure for building a chatting app with Socket.io, MERN stack, and MySQL. You'll need to enhance it with features like user authentication, handling errors, and better UI design.

Real-time messaging works with Socket.io.
MySQL stores messages and user data.
The React frontend interacts with the backend and listens to real-time updates.
Let me know if you need more specifics for any part of the app!





