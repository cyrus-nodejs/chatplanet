import dotenv from 'dotenv';
import httpServer from './server';
import {pool} from '../models/connectDb'
const PORT = process.env.PORT || 5000;
import { createServer } from "http";

dotenv.config()




//CREATE DATBASE CONNECTION
const connectDB = () => {
  pool.connect(async (err:any) => {
    if (err) throw err;
    console.log("Connected to the PostgreSQL database! " );
    
  })
}

connectDB()


httpServer.listen(PORT, () => {
  console.log(`[server]: ChatPlanet Server Active!!! http://localhost:${PORT}`);
});

