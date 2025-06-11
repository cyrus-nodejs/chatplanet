import 'dotenv/config'
import { v4 as uuidv4 } from 'uuid';
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


dotenv.config()



const app: Express = express();
const httpServer = createServer(app);



// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.json({ limit: "100mb"}));
 app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

 // Cors configuration for server  Local host & web hosting services
const corsOptions = {
  //  origin: process.env!.FRONTEND_URL2,
   origin: process.env!.FRONTEND_URL,
 credentials: true, 
 optionSuccessStatus: 200,
 methods: ['GET', 'PUT', 'POST', 'DELETE']
}

// Apply CORS middleware
app.use(cors(corsOptions));




const io = new Server(httpServer, 
  {
    cors:corsOptions,
    transports: ["websocket", "polling"]
});




app.set('trust proxy', 1) 

app.get("/", authenticateJWT, async (req: any, res: any) => {
      const result = await pool.query('SELECT * FROM users');
    console.log('This results', result.rows);
  res.send(`Express + TypeScript Server ${req.user.firstname} `);
  

});

app.use("/", authRoutes );
app.use("/", chatRoutes );
app.use("/", profileRoutes );
app.use("/", contactRoutes );
app.use("/", groupRoutes );




// Socket.IO: handle user connections
let users : any = {};

io.on('connection', (socket) => {


 // Handle user joining
socket.on('login', async (sender_id) => {
  if (!sender_id || typeof sender_id !== 'string' || sender_id.trim() === '') {
    console.warn('Invalid sender_id:', sender_id);
    return socket.emit('loginError', 'Invalid user ID');
  }

  try {
    // verify user exists in DB
    const checkUserQuery = 'SELECT id FROM users WHERE id = $1';
    const result = await pool.query(checkUserQuery, [sender_id]);
    if (result.rowCount === 0) {
      return socket.emit('loginError', 'User not found');
    }

    users[sender_id] = socket.id;

    const sqlUpdate = `UPDATE users SET status = 'online', last_seen = NOW() WHERE id = $1`;
    await pool.query(sqlUpdate, [sender_id]);

    io.emit('onlineUsers', users);
  } catch (err) {
    console.log('loginError', err);
    socket.emit('loginError', 'Internal server error');
  }
});

  // Emit chat history when a user connects
socket.on('requestChatHistory', (data) => {
  const { sender_id, receiver_id } = data;

  // Validate input
  if (!sender_id || !receiver_id) {
    return socket.emit('chatHistoryError', 'Invalid sender or receiver ID');
  }

  const query = `
    SELECT * FROM private_messages
    WHERE (sender_id = $1 AND receiver_id = $2)
       OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY timestamp ASC
  `;

  pool.query(query, [sender_id, receiver_id], (err, results) => {
    if (err) {
      console.error('Error fetching chat history', err);
      return socket.emit('chatHistoryError', 'Could not retrieve chat history');
    }

    socket.emit('chatHistory', results.rows);
  });
});
    


// Handle private messages
socket.on('private_message', async (messageData) => {
  try {
    const { receiver_id, message, sender_id } = messageData;

    // Insert the message into the database
    const sqlInsert = `
      INSERT INTO private_messages (id, sender_id, receiver_id, message, status) 
      VALUES ($1, $2, $3, $4, $5)
    `;
    const values = [uuidv4(), sender_id, receiver_id, message, 'delivered'];

    await pool.query(sqlInsert, values);

    console.log(`Message from ${sender_id} to ${receiver_id} saved to DB.`);

    // Send the message to the receiver if they are online
    if (users[receiver_id]) {
      io.to(users[receiver_id]).emit('private_message', { sender_id, message });
      console.log(`Message sent to socket ID: ${users[receiver_id]}`);
    } else {
      console.log(`Receiver ${receiver_id} is offline.`);
    }

  } catch (err) {
    console.log('Error handling private_message', err)
  }
});



// Handle private message media
socket.on('private_media', async (mediaData) => {
  try {
    const { receiver_id, media, sender_id } = mediaData;

    // Check that required data is present
    if (!receiver_id || !sender_id || !media || !media.image) {
      console.error("Invalid media data received");
      return;
    }

    const image = media.image;
    const sqlInsert = `
      INSERT INTO private_messages(id, sender_id, receiver_id, media, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    
    const values = [uuidv4(), sender_id, receiver_id, image, 'delivered'];

    // Use async/await with pool.query
    const result = await pool.query(sqlInsert, values);
    console.log(`Media message inserted for receiver ${receiver_id}`);

    if (users[receiver_id]) {
      io.to(users[receiver_id]).emit('private_message', {
        sender_id,
        media
      });
      console.log(`Media sent to socket ${users[receiver_id]}`);
    } else {
      console.log(`User ${receiver_id} is not connected`);
    }

  } catch (err) {
    console.error("Error handling private_media:", err);
  }
});

// Handle private message files
 socket.on('private_files', async (fileData) => {
  try {
    const { receiver_id, files, sender_id } = fileData;

    // Basic validation
    if (!receiver_id || !sender_id || !files) {
      console.error("Invalid file data received");
      return;
    }

    // You should standardize what files look like (e.g., file URL or Base64 blob)
    const filePayload = files; // assuming files is a JSON object or array

    const sqlInsert = `
      INSERT INTO private_messages (id, sender_id, receiver_id, media, type, status)
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    const values = [
      uuidv4(),
      sender_id,
      receiver_id,
      JSON.stringify(filePayload), // store as JSON
      'text', // message type
      'delivered'
    ];

    await pool.query(sqlInsert, values);
    console.log(`File message inserted for receiver ${receiver_id}`);

    // Send message to recipient if online
    if (users[receiver_id]) {
      io.to(users[receiver_id]).emit('private_message', {
        sender_id,
        media: filePayload,
        type: 'file'
      });
      console.log(`Files sent to socket ${users[receiver_id]}`);
    } else {
      console.log(`User ${receiver_id} is not connected`);
    }

  } catch (err) {
    console.error("Error handling private_files:", err);
  }
});

   

  // Join a group (room)
socket.on('joinGroup', (group_id) => {
  if (group_id && typeof group_id === 'string') {
    socket.join(group_id);
    socket.emit('joinedGroup', group_id); // Notify the client
    console.log(`Socket ${socket.id} joined group: ${group_id}`);
  } else {
    socket.emit('error', 'Invalid group ID');
  }
});
 
  // Handle group messages
socket.on('group_message', (messageData) => {
  const { user_id, group_id, message } = messageData;
  console.log("Received group message:", messageData);

  const sqlInsert = `
    INSERT INTO group_messages (group_id, user_id, message) 
    VALUES ($1, $2, $3)
  `;
  const values = [group_id, user_id, message];

  pool.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error("Database insert error:", err);
      socket.emit("error", "Failed to save message");
      return;
    }

    // Optionally log success or message ID
    console.log("Message saved to DB for group:", group_id);

    // Broadcast message to all users in group
    io.to(group_id).emit("group_message", messageData);
  });
});

    // Handle group media
socket.on('group_media', (mediaData) => {
  const { user_id, group_id, media } = mediaData;

  if (!user_id || !group_id || !media) {
    socket.emit("error", "Invalid media message data");
    return;
  }

  console.log("Received media message:", mediaData);

  const sqlInsert = `
    INSERT INTO group_messages (group_id, user_id, media) 
    VALUES ($1, $2, $3)
  `;
  const values = [group_id, user_id, media];

  pool.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error("Error saving media message:", err);
      socket.emit("error", "Failed to save media message");
      return;
    }

    console.log("Media message saved for group:", group_id);

    // You may want to structure this differently for client handling:
    io.to(group_id).emit("group_message", mediaData);
  });
});

      // Handle group files
socket.on('group_files', (fileData) => {
  const { user_id, group_id, files } = fileData;

  // Validate input
  if (!user_id || !group_id || !files) {
    socket.emit("error", "Invalid file message data");
    return;
  }

  console.log("Received file message:", fileData);

  const sqlInsert = `
    INSERT INTO group_messages (group_id, user_id, files)
    VALUES ($1, $2, $3)
  `;
  const values = [group_id, user_id, files];

  pool.query(sqlInsert, values, (err, result) => {
    if (err) {
      console.error("Error saving file message:", err);
      socket.emit("error", "Failed to save file message");
      return;
    }

    console.log("File message saved for group:", group_id);

    io.to(group_id).emit("group_message", fileData);
  });
});

 // Emit groupchat history when a user connects
socket.on('requestGroupChatHistory', (group_id) => {
  if (!group_id) {
    socket.emit('error', 'Group ID is required for chat history');
    return;
  }

  pool.query(
    'SELECT * FROM group_messages WHERE group_id = $1 ORDER BY timestamp ASC',
    [group_id],
    (err, results) => {
      if (err) {
        console.error("Error fetching chat history:", err);
        socket.emit('error', 'Failed to retrieve group chat history');
        return;
      }

      socket.emit('groupChatHistory', results.rows);
    }
  );
})

  // Leave group (room)
socket.on('leaveGroup', (group_id) => {
  if (!group_id) {
    socket.emit('error', 'Group ID required to leave group');
    return;
  }

  socket.leave(group_id);
  socket.emit('leftGroup', group_id);
  console.log(`Socket ${socket.id} left group: ${group_id}`);
});
 
// Handle events for video call signaling, such as:
  socket.on('offer', (offer) => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', (answer) => {
    socket.broadcast.emit('answer', answer);
  });

  socket.on('ice-candidate', (candidate) => {
    socket.broadcast.emit('ice-candidate', candidate);
  });



socket.on('disconnect', () => {
  try {
    for (const userId in users) {
      if (users[userId] === socket.id) {
        // Remove user from users list
        delete users[userId];

        // Use parameterized query to avoid SQL injection
        const sqlUpdate = `UPDATE users SET status = $1, last_seen = NOW() WHERE id = $2`;
        const values = ['offline', userId];

        pool.query(sqlUpdate, values, (err, result) => {
          if (err) {
            console.error(`Error updating status for user ${userId}:`, err);
          } else {
            console.log(`User ${userId} marked offline on disconnect.`);
          }
        });

        break; // user found and handled, exit loop
      }
    }
  } catch (err) {
    console.error("Error handling disconnect:", err);
  }

  // Optionally, log the socket disconnect event
  console.log(`Socket ${socket.id} disconnected.`);
});

});


export default httpServer;