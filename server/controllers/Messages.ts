import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';
// API to get chat history between users
export const getPrivateMessages = (req:any, res:any) => {
    const { sender_id, receiver_id } = req.params;
 
    console.log(`get private message; ${sender_id}`, `${receiver_id}`)
    try{
    

        
     pool.connect(async (err:any) => {
       if (err) throw err;
       pool.query(
         'SELECT * FROM private_messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY timestamp ASC',
         [sender_id, receiver_id, receiver_id, sender_id],
         (err, results) => {
          if (err) {
            return  res.json({success:false, message:"No private messages founnd"})   
          }
           console.log(`privateChatHistory: ${results}`)
         res.json({success:true, message:'success', privatemessages:results})
         }
       );
     
     })
     }catch (err){
      console.log(err)
           return  res.json({success:false, message:"Network error!"})  
     }
        
}


// API to get group chat history between users
export const getGroupMessages = (req:any, res:any) => {
    const { sender_id, group_id } = req.params;
 
    console.log(`get group message; ${sender_id}`, `${group_id}`)
    // Emit groupchat history when a user connects

  try{
  pool.connect(async (err:any) => {
    if (err) throw err;
    pool.query(
      'SELECT * FROM group_messages WHERE group_id = ?  ORDER BY timestamp ASC',
      [group_id],
      (err, results) => {
        if (err) {
          return  res.json({success:false, message:"No group messages found!"})   
        }
         console.log(`groupchathistory: ${results}`)
        res.json({success:true, message:'success', groupmessages:results})
      
      }
    );
  })
}catch (err){
  console.log(err)
  return  res.json({success:false, message:"Network error!"})  
}


 

}


export const addRecentChat = async (req:any, res:any) => {
    const { receiver_id} = req.body
     const userid = req.user?.id
     const sqlInsert = `INSERT INTO recentchat( receiver_id, user_id) VALUES (?,?)`             
     const insert_query = mysql.format(sqlInsert,[ receiver_id, userid ])
    console.log(`add recentchat: ${receiver_id}`, {userid})
  
    const userExists :any =  pool.query('SELECT * FROM recentchat WHERE receiver_id = ?', [receiver_id]);
    if (userExists.length > 0) {
        return res.json({success:true, message: 'success' });
    }
        pool.query (insert_query, (err, result:any)=> {
          if (err){
            console.log(err)
          return res.json({success:false, message:"Cannot add to recentchat!"}) 
          }
          console.log(`recentchat added!`)
          res.json({success:true, message:"recentchat added"})
         })   
         
        }

    
        // API to get group chat history between users
export const getRecentChat = (req:any, res:any) => {
  const userid = req.user.id
  // Emit groupchat history when a user connect
try{

  pool.query(
    'SELECT  * FROM recentchat WHERE user_id = ?  ORDER BY timestamp ASC',
    [userid],
    (err, results) => {
      if (err) {
        return  res.json({success:false, message:"Failed to fetch Data!"})   
      }
       console.log(`recentchat: ${results}`)
      res.json({success:true, message:'success', recentchat:results})
    
    }
  );

}catch (err){
  console.log(err)
  return  res.json({success:false, message:"Network error!"})  
}




}


