import mysql, { createPool } from 'mysql2';
import dotenv from "dotenv";

dotenv.config();

        const dbConfig = {
            host                  : 'localhost',
            user                  : process.env.DB_USER,
            password              : process.env.DB_PASSWORD,
              database             :process.env.DATABASE,
            // waitForConnections    : true,
            // connectionLimit       : 10,
            // maxIdle               : 10, // max idle connections, the default value is the same as `connectionLimit`
            // idleTimeout           : 60000, // idle connections timeout, in milliseconds, the default value 60000
            // queueLimit            : 0,
            // enableKeepAlive       : true,
            // keepAliveInitialDelay : 0,
          };
        
      export  const pool =   mysql.createConnection(dbConfig)
         
        




