import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';


//Retrieve connected Users
export const getOnlineUsers = (req:any, res:any) => {

   const userId = req.user.id
   console.log(`userid ${userId}`)
    const sqlSearch = "SELECT * FROM users WHERE status = ? AND NOT id = ?"
    const search_query = mysql.format(sqlSearch,['online', userId] )

    try{
            pool.connect(async (err) => {
                if (err) throw err;
                pool.query(search_query, async (err, result:any) => {
                    if (err) throw err;
                    console.log('onlineUsers found!')
                          console.log(result)

                         res.json({success:true, message:"online Users found!!", users:result}) 
                })
                
                })
    }catch(err){

    }

}




// Get user profile
export const getProfile = (req:any, res:any) => {
    const user = req.user
    const sqlSearch = "SELECT * FROM users WHERE id = ?"
    const search_query = mysql.format(sqlSearch,[user.id])
    console.log(req.user.firstname)
    
    if (!user){
        res.json({success:false, message:"No user found!"})
    }
    
    try{
            pool.connect(async (err) => {
                if (err) throw err;
                pool.query(search_query, async (err, result:any) => {
                    if (err) throw err;
                          console.log(result[0])
                         res.json({success:true, message:"Profile found!", profile:result[0]}) 
                })
                
                })
    }catch(err){

    }

}


//upate user profile
export const updateProfile = (req:any, res:any) => {
    const { image, mobile,   country } = req.body
    const user = req.user
    const sqlUpdate = `UPDATE users   SET image = ?, mobile = ?, country = ?,  WHERE  id = ?`
    const insert_query = mysql.format(sqlUpdate,[image, mobile, country, user.id])
    const sqlUpdate2 = `UPDATE contacts   SET image = ?, mobile = ?, country = ?,  WHERE  userid = ?`
    const insert_query2 = mysql.format(sqlUpdate2,[image, mobile, country, user.id])
    

   
    try{
        if (!user){
            res.json({success:false, message:"No user found!"})
        }else{
            pool.connect(async (err) => {
                if (err) throw err

                pool.query(insert_query, async (err, result:any) => {
                    if (err) throw err;
                    pool.query(insert_query2, async (err, result:any) => {
                        if (err) throw err
                            })
                       
                         res.json({success:true, message:"Updated Profile!"})
                        })
                       
                
                
                
                })
                
                
        
         
        }

    }catch(err){

    }
    
}