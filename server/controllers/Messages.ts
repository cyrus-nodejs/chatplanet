import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';

// API to get chat history between users
export const getPrivateMessages = (req:any, res:any) => {
    const { sender_id, receiver_id } = req.params;
 
    console.log(`get private message; ${sender_id}`, `${receiver_id}`)
    try{
      
        pool.query(
            'SELECT  sender_id, receiver_id, message, timestamp FROM private_messages WHERE sender_id = ? OR receiver_id = ? ORDER BY timestamp ASC',
            [sender_id, receiver_id],
            (err, results) => {
              if (err) throw err;
              res.json({success:true, message:"getting nessages", privatemessages:results})
            }
          );

       
  
    }catch(err){
 console.log(err)
    }  
}


// API to get group chat history between users
export const getGroupMessages = (req:any, res:any) => {
    const { sender_id, group_id } = req.params;
 
    console.log(`get group message; ${sender_id}`, `${group_id}`)
    try{
      
        pool.query(
            'SELECT  sender_id, group_id, message, timestamp FROM private_messages WHERE  group_id = ? ORDER BY timestamp ASC',
            [group_id],
            (err, results) => {
              if (err) throw err;
              res.json({success:true, message:"getting groups ", groupmessages:results})
            }
          );

       
  
    }catch(err){
 console.log(err)
    }  
}