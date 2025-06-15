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
export const corsOptions = {
  //  origin: process.env!.FRONTEND_URL2,
   origin: process.env!.FRONTEND_URL2,
 credentials: true, 
 optionSuccessStatus: 200,
 methods: ['GET', 'PUT', 'POST', 'DELETE']
}

// Apply CORS middleware
app.use(cors(corsOptions));




app.set('trust proxy', 1) 

app.get("/", authenticateJWT, async (req: any, res: any) => {
  res.send(`Express + TypeScript Server ${req.user.firstname} `);
  

});

app.use("/", authRoutes );
app.use("/", chatRoutes );
app.use("/", profileRoutes );
app.use("/", contactRoutes );
app.use("/", groupRoutes );






export default httpServer;