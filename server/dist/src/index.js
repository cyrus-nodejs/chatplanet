"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = __importStar(require("./server"));
const connectDb_1 = require("../models/connectDb");
const socket_io_1 = require("socket.io");
const jwt_1 = require("../middlewares/jwt/jwt");
const cookie_1 = require("cookie");
const uuid_1 = require("uuid");
const redis_1 = require("./config/redis");
// Socket.IO: handle user connections
const PORT = process.env.PORT || 5000;
dotenv_1.default.config();
(async () => {
    await (0, redis_1.initRedis)();
    let users = {};
    const io = new socket_io_1.Server(server_1.default, {
        cors: server_1.corsOptions,
        transports: ["websocket", 'polling']
    });
    io.use((socket, next) => {
        const cookieHeader = socket.handshake.headers.cookie;
        if (!cookieHeader) {
            return next(new Error('Authentication error: No cookie'));
        }
        const cookies = (0, cookie_1.parse)(cookieHeader);
        const token = cookies.accessToken; // name must match res.cookie key
        if (!token) {
            return next(new Error('Authentication error: Token missing'));
        }
        try {
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            socket.user = decoded;
            next();
        }
        catch (err) {
            next(new Error('Authentication error: Invalid token'));
        }
    });
    io.on('connection', (socket) => {
        console.log(`Connected user: ${socket.id}`);
        socket.emit("welcome", { message: "Authenticated successfully" });
        server_1.default.on('connection', (socket) => {
            socket.setNoDelay(true);
        });
        // Handle user joining
        socket.on('login', async (sender_id) => {
            if (!sender_id || typeof sender_id !== 'string' || sender_id.trim() === '') {
                // console.warn('Invalid sender_id:', sender_id);
                // return socket.emit('loginError', 'Invalid user ID');
            }
            try {
                // verify user exists in DB
                const checkUserQuery = 'SELECT id FROM users WHERE id = $1';
                const result = await connectDb_1.pool.query(checkUserQuery, [sender_id]);
                if (result.rowCount === 0) {
                    return socket.emit('loginError', 'User not found');
                }
                users[sender_id] = socket.id;
                const sqlUpdate = `UPDATE users SET status = 'online', last_seen = NOW() WHERE id = $1`;
                await connectDb_1.pool.query(sqlUpdate, [sender_id]);
                io.emit('onlineUsers', users);
            }
            catch (err) {
                // console.log('loginError', err);
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
            connectDb_1.pool.query(query, [sender_id, receiver_id], (err, results) => {
                if (err) {
                    // console.error('Error fetching chat history', err);
                    return socket.emit('chatHistoryError', 'Could not retrieve chat history');
                }
                console.log('this is private chat history', results.rows);
                socket.emit('chatHistory', results.rows);
            });
        });
        // Handle private messages typing
        socket.on('private_typing', async (messageData) => {
            try {
                const { receiver_id, message, sender_id } = messageData;
                // Send the message to the receiver if they are online
                if (users[receiver_id]) {
                    io.to(users[receiver_id]).emit('private_typing', { sender_id });
                    // console.log(`Message sent to socket ID: ${users[receiver_id]}`);
                }
                else {
                    console.log(`Receiver ${receiver_id} is offline.`);
                }
            }
            catch (err) {
                console.log('Error handling private_message', err);
            }
        });
        socket.on('stop_private_typing', async (messageData) => {
            try {
                const { receiver_id, message, sender_id } = messageData;
                // Send the message to the receiver if they are online
                if (users[receiver_id]) {
                    io.to(users[receiver_id]).emit('stop_private_typing', { sender_id });
                    console.log(`Message sent to socket ID: ${users[receiver_id]}`);
                }
                else {
                    console.log(`Receiver ${receiver_id} is offline.`);
                }
            }
            catch (err) {
                console.log('Error handling private_message', err);
            }
        });
        // Handle private messages
        socket.on('private_message', async (messageData) => {
            try {
                const { receiver_id, message, sender_id } = messageData;
                console.log('message data', messageData);
                // Send the message to the receiver if they are online
                if (users[receiver_id]) {
                    io.to(users[receiver_id]).emit('private_message', { sender_id, message });
                    console.log(`Message sent to socket ID: ${users[receiver_id]}`);
                }
                else {
                    console.log(`Receiver ${receiver_id} is offline.`);
                }
                // Insert the message into the database
                const sqlInsert = `
      INSERT INTO private_messages (id, sender_id, receiver_id, message, status) 
      VALUES ($1, $2, $3, $4, $5)
    `;
                const values = [(0, uuid_1.v4)(), sender_id, receiver_id, message, 'delivered'];
                await connectDb_1.pool.query(sqlInsert, values);
                console.log(`Message from ${sender_id} to ${receiver_id} saved to DB.`);
            }
            catch (err) {
                console.log('Error handling private_message', err);
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
                const values = [(0, uuid_1.v4)(), sender_id, receiver_id, image, 'delivered'];
                // Use async/await with pool.query
                const result = await connectDb_1.pool.query(sqlInsert, values);
                console.log(`Media message inserted for receiver ${receiver_id}`);
                if (users[receiver_id]) {
                    io.to(users[receiver_id]).emit('private_message', {
                        sender_id,
                        media
                    });
                    console.log(`Media sent to socket ${users[receiver_id]}`);
                }
                else {
                    console.log(`User ${receiver_id} is not connected`);
                }
            }
            catch (err) {
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
                    (0, uuid_1.v4)(),
                    sender_id,
                    receiver_id,
                    JSON.stringify(filePayload), // store as JSON
                    'text', // message type
                    'delivered'
                ];
                await connectDb_1.pool.query(sqlInsert, values);
                console.log(`File message inserted for receiver ${receiver_id}`);
                // Send message to recipient if online
                if (users[receiver_id]) {
                    io.to(users[receiver_id]).emit('private_message', {
                        sender_id,
                        media: filePayload,
                        type: 'file'
                    });
                    console.log(`Files sent to socket ${users[receiver_id]}`);
                }
                else {
                    console.log(`User ${receiver_id} is not connected`);
                }
            }
            catch (err) {
                console.error("Error handling private_files:", err);
            }
        });
        // Join a group (room)
        socket.on('joinGroup', (group_id) => {
            if (group_id && typeof group_id === 'string') {
                socket.join(group_id);
                socket.emit('joinedGroup', group_id); // Notify the client
                console.log(`Socket ${socket.id} joined group: ${group_id}`);
            }
            else {
                socket.emit('error', 'Invalid group ID');
            }
        });
        // Handle group messages typing
        socket.on('group_typing', async (messageData) => {
            const { user_id, group_id, message } = messageData;
            console.log("Received group message:", messageData);
            // Optionally log success or message ID
            console.log("Message saved to DB for group:", group_id);
            // Broadcast message to all users in group
            io.to(group_id).emit("group_typing", messageData);
        });
        socket.on('stop_group_typing', async (messageData) => {
            const { user_id, group_id, message } = messageData;
            console.log("Received group message:", messageData);
            // Optionally log success or message ID
            console.log("Message saved to DB for group:", group_id);
            // Broadcast message to all users in group
            io.to(group_id).emit("stop_group_typing", messageData);
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
            connectDb_1.pool.query(sqlInsert, values, (err, result) => {
                if (err) {
                    console.error("Database insert error:", err);
                    socket.emit("error", "Failed to save message");
                    return;
                }
                // Optionally log success or message ID
                console.log("Message saved to DB for group:", group_id);
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
            connectDb_1.pool.query(sqlInsert, values, (err, result) => {
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
            connectDb_1.pool.query(sqlInsert, values, (err, result) => {
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
            connectDb_1.pool.query('SELECT * FROM group_messages WHERE group_id = $1 ORDER BY timestamp ASC', [group_id], (err, results) => {
                if (err) {
                    console.error("Error fetching chat history:", err);
                    socket.emit('error', 'Failed to retrieve group chat history');
                    return;
                }
                console.log('this is group chathistory', results.rows);
                socket.emit('groupChatHistory', results.rows);
            });
        });
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
                        connectDb_1.pool.query(sqlUpdate, values, (err, result) => {
                            if (err) {
                                console.error(`Error updating status for user ${userId}:`, err);
                            }
                            else {
                                console.log(`User ${userId} marked offline on disconnect.`);
                            }
                        });
                        break; // user found and handled, exit loop
                    }
                }
            }
            catch (err) {
                console.error("Error handling disconnect:", err);
            }
            // Optionally, log the socket disconnect event
            // console.log(`Socket ${socket.id} disconnected.`);
        });
    });
    //CREATE DATBASE CONNECTION
    const connectDB = () => {
        connectDb_1.pool.connect(async (err) => {
            if (err)
                throw err;
            console.log("Connected to the PostgreSQL database! ");
        });
    };
    connectDB();
    // Initialize Redis before starting the server
    server_1.default.listen(PORT, () => {
        console.log(`[server]: ChatPlanet Server Active!!! http://localhost:${PORT}`);
    });
})();
