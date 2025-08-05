import 'dotenv/config'

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
import cors from "cors"
import { authorizeJWT } from '../middlewares/jwt/jwt';
import cookieParser from 'cookie-parser';
 import cron from 'node-cron';
import axios from 'axios';
// import redisClient from './config/redis'

dotenv.config()







const app: Express = express();
const httpServer = createServer(app);



// Middleware
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
 app.use(bodyParser.json({ limit: "100mb"}));
 app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));


// // ✅ Ensure Redis is connected before starting the server
// redisClient.on('connect', () => {
//   console.log('✅ Redis is connected');
// });

// redisClient.on('error', (err) => {
//   console.error('❌ Redis error:', err);
// });




cron.schedule('*/1440 * * * *', async () => {
  try {
    const url = process.env.SERVER_URL!;
    await axios.get(url);
    console.log('Ping sent to:', url);
  } catch (err) {
    console.error('Ping failed', err);
  }
});
 // Cors configuration for server  Local host & web hosting services
export const corsOptions = {
   origin: process.env!.FRONTEND_URL,
 credentials: true, 
 optionSuccessStatus: 200,
 methods: ['GET', 'PUT', 'POST', 'DELETE']
}





// Apply CORS middleware
app.use(cors(corsOptions));




app.set('trust proxy', 1) 

app.get("/", authorizeJWT, async (req: any, res: any) => {
  res.send(`Express + TypeScript Server ${req.user.firstname} `);
  

});

app.use("/", authRoutes );
app.use("/", chatRoutes );
app.use("/", profileRoutes );
app.use("/", contactRoutes );
app.use("/", groupRoutes );






export default httpServer;