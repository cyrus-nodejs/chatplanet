import 'dotenv/config'
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


//  console.log(authenticator.generateKey())
      

    


// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.json({ limit: "100mb"}));
 app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));

 if (process.env.NODE_ENV === 'production') {

  const corsOptions = {
    origin: process.env!.FRONTEND_URL,
   credentials: true, 
   optionSuccessStatus: 200,
   methods: ['GET', 'PUT', 'POST', 'DELETE'],
  
  }
  
  app.use(cors(corsOptions));
  
  
 }
 else{

  const corsOptions = {
    origin: process.env!.FRONTEND_URL2,
   credentials: true, 
   optionSuccessStatus: 200,
   methods: ['GET', 'PUT', 'POST', 'DELETE'],
  
  }
  
  app.use(cors(corsOptions));
  
 }
 const io = new Server(httpServer,
  process.env.NODE_ENV === 'production' ?
  {
  
  cors: {
    origin:process.env!.FRONTEND_URL,  // replace with your React app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  },
  perMessageDeflate: {
    threshold: 1024,
  },
}: {
  
  cors: {
    origin:process.env!.FRONTEND_URL2,  // replace with your React app's URL
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type'],
    credentials: true
  },
  perMessageDeflate: {
    threshold: 1024,
  },
});


 

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
    console.log("Connected to the PostgreSQL database! " );
    
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
     const sqlUpdate = `UPDATE users   SET status = 'online', last_seen = NOW()  WHERE  id = $1`
    //  const insert_query = mysql.format(sqlUpdate,["online",  sender_id])
    const values = [sender_id]
     pool.query(sqlUpdate, values, async (err:any, result:any) => {
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
    'SELECT * FROM private_messages WHERE (sender_id = $1 AND receiver_id = $2) OR (sender_id = $3 AND receiver_id = $4) ORDER BY timestamp ASC',
    [sender_id, receiver_id, receiver_id, sender_id],
    (err, results) => {
      if (err) throw err;
      // console.log(`privateChatHistory: ${results}`)
      socket.emit('chatHistory', results.rows);
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
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, message, status) VALUES ($1,$2,$3,$4,$5)"
     const values =[uuidv4(), sender_id, receiver_id, message, 'delivered']
            pool.query (sqlInsert, values, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.rows}`)
            
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
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, media, status) VALUES ($1,$2,$3,$4,$5)"
     
     const values = [uuidv4(), sender_id, receiver_id, image, 'delivered']
            pool.query (sqlInsert, values, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.rows}`)
            
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
     const sqlInsert = "INSERT INTO private_messages(id, sender_id, receiver_id, files, status) VALUES ($1,$2,$3,$4,$5)"
     
     const values = [uuidv4(), sender_id, receiver_id, file, 'delivered']
            pool.query (sqlInsert, values, (err, result:any)=> {
              if (err) throw err;
              console.log(`This is ${ result.rows}`)
            
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

       const sqlInsert = "INSERT INTO group_messages( group_id, user_id, message) VALUES ($1,$2,$3)"
      
       const values = [ group_id, user_id, message]
              pool.query (sqlInsert, values, (err, result:any)=> {
                if (err) throw err;
              // console.log(`group message: ${result}`)
               })
          
    io.to(group_id).emit("group_message", messageData); // Broadcast to group
  });

    // Handle group messages
    socket.on('group_media', (mediaData) => {
      const { user_id, group_id, media } = mediaData;
      console.log(`socket ${mediaData}`)
  
         const sqlInsert = "INSERT INTO group_messages( group_id, user_id, media) VALUES ($1,$2,$3)"
         
         const values = [ group_id, user_id, media]
                pool.query (sqlInsert,values, (err, result:any)=> {
                  if (err) throw err;
                // console.log(`group message: ${result}`)
                 })
            
      io.to(group_id).emit("group_message", mediaData); // Broadcast to group
    });

      // Handle group messages
  socket.on('group_files', (fileData) => {
    const { user_id, group_id, files } = fileData;
    console.log(`socket ${fileData}`)

       const sqlInsert = "INSERT INTO group_messages( group_id, user_id, files) VALUES ($1,$2,$3)"
       const values = [ group_id, user_id, files]
              pool.query (sqlInsert, values, (err, result:any)=> {
                if (err) throw err;
              // console.log(`group message: ${result}`)
               })
          
    io.to(group_id).emit("group_message", fileData); // Broadcast to group
  });


 // Emit groupchat history when a user connects
 socket.on('requestGroupChatHistory', (group_id) => {
  try{

    pool.query(
      'SELECT * FROM group_messages WHERE group_id = $1  ORDER BY timestamp ASC',
      [group_id],
      (err, results) => {
        if (err) throw err;
        // console.log(`groupchathistory: ${results}`)
        socket.emit('groupChatHistory', results.rows);
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

  //  // Handle incoming offer
  //  socket.on("offer", (offer, toUserId) => {
  //   const toSocketId = users[toUserId];
  //   if (toSocketId) {
  //     io.to(toSocketId).emit("offer", offer);
  //   }
  // });

  // // Handle incoming answer
  // socket.on("answer", (answer, toUserId) => {
  //   const toSocketId = users[toUserId];
  //   if (toSocketId) {
  //     io.to(toSocketId).emit("answer", answer);
  //   }
  // });

  // // Handle ICE candidates
  // socket.on("ice-candidate", (candidate, toUserId) => {
  //   const toSocketId = users[toUserId];
  //   if (toSocketId) {
  //     io.to(toSocketId).emit("ice-candidate", candidate);
  //   }
  // });

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

