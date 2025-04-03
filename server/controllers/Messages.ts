import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';



export const addRecentChat = async (req:any, res:any) => {
    const { receiver_id} = req.body
     const userid = req.user?.id
     const sqlInsert = `INSERT INTO recentchat( receiver_id, user_id) VALUES ($1,$2)`             
     
    console.log(`add recentchat: ${receiver_id}`, {userid})
    const values = [ receiver_id, userid ]
        pool.query (sqlInsert, values, (err, result:any)=> {
          if (err){
            console.log(err.stack)
          return res.json({success:false, message:"Cannot add to recentchat!"}) 
          }
          console.log(`recentchat added!`)
          console.log(result.rows)
          res.json({success:true, message:"recentchat added"})
         })   
         
        }

    
        // API to get group chat history between users
export const getRecentChat = (req:any, res:any) => {
  const userid = req.user.id
  // Emit groupchat history when a user connect
try{

  pool.query(
    'SELECT  * FROM recentchat WHERE user_id = $1  ORDER BY timestamp ASC',
    [userid],
    (err, results) => {
      if (err) {
        return  res.json({success:false, message:"Failed to fetch Data!"})   
      }
       console.log(`recentchat: ${results.rows}`)
      res.json({success:true, message:'success', recentchat:results.rows})
    
    }
  );

}catch (err){
  console.log(err)
  return  res.json({success:false, message:"Network error!"})  
}




}


