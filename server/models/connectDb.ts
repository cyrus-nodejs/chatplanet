// import mysql, { createPool } from 'mysql2';
import dotenv from "dotenv";
import {Client, Pool} from 'pg'
import fs from 'fs'
import path from 'path'
dotenv.config();

      //   const dbConfig = {
      //       host                  : 'localhost',
      //       user                  : process.env.DB_USER,
      //       password              : process.env.DB_PASSWORD,
      //         database             :process.env.DATABASE,
      //       // waitForConnections    : true,
      //       // connectionLimit       : 10,
      //       // maxIdle               : 10, // max idle connections, the default value is the same as `connectionLimit`
      //       // idleTimeout           : 60000, // idle connections timeout, in milliseconds, the default value 60000
      //       // queueLimit            : 0,
      //       // enableKeepAlive       : true,
      //       // keepAliveInitialDelay : 0,
      //     };
        
      // export  const pool =   mysql.createConnection(dbConfig)
         
        
    export   const pool = new Pool({
        user: process.env.user,  // Replace with your PostgreSQL username
        host: process.env.host,      // Replace with your database host
        database: process.env.database,  // Replace with your database name
        password: process.env.password,  // Replace with your password
        port: 23756, // Default PostgreSQL port
        ssl: {
          rejectUnauthorized: false,// Set to true for extra security or if required by your cloud provider
          // ca: fs.readFileSync(path.join(__dirname, '../certs/ca.pem')).toString(),
        }
      });

      