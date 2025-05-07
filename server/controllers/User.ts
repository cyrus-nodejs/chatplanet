import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { uploadToCloudinary } from '../utils/cloudinary';

//Retrieve connected Users
export const getOnlineUsers = (req:any, res:any) => {

   const userId = req.user.id
   console.log(`userid ${userId}`)
    const sqlSearch = "SELECT * FROM users WHERE status = $1 AND NOT id = $2"
    
    const value = ['online', userId] 
    try{
    
         
                pool.query(sqlSearch, value, async (err, result:any) => {
                    if (err) {
                        return  res.json({success:false, message:"No useronline found "})   
                      }
                    console.log('onlineUsers found!')
                       

                         res.json({success:true, message:"online Users found!!", users:result.rows}) 
                })
                
                
    }catch(err){

    }

}


export const getAllUsers = (req:any, res:any) => {

     const sqlSearch = "SELECT * FROM users"
 
     try{
         
                 pool.query(sqlSearch, async (err, result:any) => {
                    if (err) {
                        return  res.json({success:false, message:"No allusers found !"})   
                      }
                     console.log('allusers found!')
                    //  console.log(result)
         res.json({success:true, message:"online Users found!", users:result.rows}) 
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
    const sqlSearch = `UPDATE users   SET profile_image = $1 WHERE  id = $2`

    try{
        let imageData = {}
  if(image){
      const results = await uploadToCloudinary(image, "chatplanetassets")
      imageData = results
  }
  console.log(imageData)
          
                
                const values = [JSON.stringify(imageData), userid]
                pool.query(sqlSearch, values, async (err, result:any) => {
                    if (err) {
                        console.log(err)
                        return  res.json({success:false, message:"Update  failed!"})   
                      }else{
                        console.log('profile image update success')
                        res.json({success:true, message:"Profile Image Update successful!"}) 
                      }
                          
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
    const sqlUpdate = `UPDATE users   SET about = $1  WHERE id = $2`
    const values = [about, userid]
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }
            
                

                pool.query(sqlUpdate, values, async (err, result:any) => {
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
    const sqlUpdate = `UPDATE users   SET country = $1  WHERE   id = $2`
    
    const values = [location, userid]
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }else{
           

                pool.query(sqlUpdate,values, async (err, result:any) => {
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
    const sqlUpdate = `UPDATE users SET mobile = $1  WHERE id = $2`
   
    const values = [mobile, userid]
    try{
        if (!userid){
            res.json({success:false, message:"No user found!"})
        }else{
         

                pool.query(sqlUpdate, values, async (err, result:any) => {
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