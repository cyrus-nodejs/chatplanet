import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { uploadToCloudinary } from '../utils/cloudinary';

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
                    if (err) {
                        return  res.json({success:false, message:"No useronline found "})   
                      }
                    console.log('onlineUsers found!')
                       

                         res.json({success:true, message:"online Users found!!", users:result}) 
                })
                
                })
    }catch(err){

    }

}


export const getAllUsers = (req:any, res:any) => {

     const sqlSearch = "SELECT * FROM users   "
 
 
     try{
             pool.connect(async (err) => {
                 if (err) throw err;
                 pool.query(sqlSearch, async (err, result:any) => {
                    if (err) {
                        return  res.json({success:false, message:"No allusers found !"})   
                      }
                     console.log('allusers found!')
                    //  console.log(result)
         res.json({success:true, message:"online Users found!", users:result}) 
                 })
                 
                 })
     }catch(err){
 
     }
 
 }
 




// Get user profile
export const UpdateProfileImage = async (req:any, res:any) => {
    if (!req.files) {
        // No file was uploaded
        return res.json({ success:false, message: "No file uploaded" });
      }
    
    console.log(req.files)
    
 
      // File upload successful
      const image = req.files['image'][0].path
      console.log(image)
    const userid = req.user.id
    const sqlSearch = `UPDATE users   SET profile_image = ?  WHERE  id = ?`

    try{
        let imageData = {}
  if(image){
      const results = await uploadToCloudinary(image, "chatplanetassets")
      imageData = results
  }
  console.log(imageData)
          
                const search_query = mysql.format(sqlSearch,[imageData, userid])
                pool.query(search_query, async (err, result:any) => {
                    if (err) {
                        console.log(err)
                        return  res.json({success:false, message:"Update  failed!"})   
                      }
                          console.log('profile image update success')
                         res.json({success:true, message:"Profile Image Update successful!"}) 
                })
            
    }catch(err){
        console.log(err)
        return  res.json({success:false, message:"Network error!"})  
    }

}


//upate user profile
export const updateAbout = (req:any, res:any) => {
    const { about } = req.body
    const userid = req.user.id
    const sqlUpdate = `UPDATE users   SET about = ?  WHERE id = ?`
    const insert_query = mysql.format(sqlUpdate,[about, userid])
  
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }
            
                

                pool.query(insert_query, async (err, result:any) => {
                    if (err) {
                        console.log(err)
                        return  res.json({success:false, message:"Update  failed!"})   
                      }
                          console.log(' Update success!')
                    
                         res.json({success:true, message:" Profile Update Successful !"})
                        })
                
                

        

    }catch(err){
        console.log(err)
        return  res.json({success:false, message:"Network error!"})  
    }
    
}



export const updateLocation = (req:any, res:any) => {
    const { location } = req.body
    console.log(location)
    const userid = req.user.id
    const sqlUpdate = `UPDATE users   SET country = ?  WHERE   id = ?`
    const insert_query = mysql.format(sqlUpdate,[location, userid])
  
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }else{
           

                pool.query(insert_query, async (err, result:any) => {
                    if (err) {
                        console.log(err)
                        return  res.json({success:false, message:"Update  failed!"})   
                      }
                          console.log(' Update success!')
                    
                         res.json({success:true, message:"Country Updated Success!"})
                        })
                
        }
    }catch(err){
        console.log(err)
        return  res.json({success:false, message:"Network error!"})  
    }
    
}










export const updatePhoneContact = (req:any, res:any) => {
    const { mobile } = req.body
    console.log(mobile)
    const userid = req.user.id
    const sqlUpdate = `UPDATE users SET mobile = ?  WHERE id = ?`
    const insert_query = mysql.format(sqlUpdate,[mobile, userid])
  
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }else{
         

                pool.query(insert_query, async (err, result:any) => {
                    if (err) {
                        console.log(err)
                        return  res.json({success:false, message:"Update  failed!"})   
                      }
                          console.log(' Update success!')
                    
                         res.json({success:true, message:"Phone Contact Update Success!!"})
                        })
                
        }
    }catch(err){
        console.log(err)
        return  res.json({success:false, message:"Network error!"})  
    }
    
}