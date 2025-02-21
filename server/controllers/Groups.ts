import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';
import mysql from 'mysql2';

//Create Group by User
export const createGroup = async (req:any, res:any) => {
     
    const { name, description} = req.body
    console.log(req.body)
const userid = req.user.id
    if (!req.files) {
           // No file was uploaded
           return res.json({ success:false, message: "No file uploaded" });
         }
       
       console.log(req.files)
       
    
         // File upload successful
         const image = req.files['image'][0].path
         console.log(image)
       
       const sqlSearch = `INSERT INTO groupchat(id, name, description, createdBy, group_image) VALUES (?,?,?,?,?)`
   
       try{
           let imageData = {}
     if(image){
         const results = await uploadToCloudinary(image, "chatplanetassets")
         imageData = results
     }
     console.log(imageData)
               pool.connect(async (err) => {
                   if (err) throw err;
                   const search_query = mysql.format(sqlSearch,[uuidv4(), name, description, userid, imageData])
                   pool.query(search_query, async (err, result:any) => {
                       if (err) {
                           console.log(err)
                           return  res.json({success:false, message:"Update  failed!"})   
                         }
                             console.log('profile image update success')
                            res.json({success:true, message:"Profile Image Update successful!"}) 
                   })
                   })
       }catch(err){
           console.log(err)
           return  res.json({success:false, message:"Network error!"})  
       }
        }



        export const addGroupMember = (req:any, res:any) => {
          const userid = req.user.id
           const {group_id, user_id} = req.body
        console.log(`addgroup member ${req.body}`)
       
        const sqlSearch = `SELECT * FROM group_member WHERE group_id = ? AND user_id = ?`
     const search_query = mysql.format(sqlSearch,[group_id, user_id])

                pool.query(search_query, async (err, result:any) => {
                    if (err) {
                      console.log(err)
                      return  res.json({success:false, message:'Cannot fetch groups!'})   
                    }else if (result.length > 0){
                          return res.json({success:true, message: 'Contact exist already in group' });
                        }else{
                        const sqlInsert = `INSERT INTO group_member(group_id, user_id) VALUES (?,?)`           
                        const insert_query = mysql.format(sqlInsert, [group_id, user_id])
                    pool.query (insert_query, (err, result:any)=> {
                      if (err){
                        console.log(err)
                      return res.json({success:false, message:`${err}: error contacting `}) 
                      }
                      console.log('contact added to group')
                      res.json({success:true, message:"contact added to group", groupContact:result})
                     })        
                        }    
                })


        }
                      
                
                              
        
                          
                
        
    



// Retreive group 
export const getGroups = async (req:any, res:any) => {
    const userId = req.user.id
    console.log("I am getting group")
    const sqlSearch = `SELECT * FROM groupchat`
     const search_query = mysql.format(sqlSearch,[userId])

            pool.connect(async (err) => {
                if (err) {
                  return  res.json({success:false, message:"Connection Error "})   
                }
                pool.query(sqlSearch, async (err, result:any) => {
                    if (err) {
                      return  res.json({success:false, message:"No groups found "})   
                    }
                         console.log('group success')
                       
                res.json({success:true, message:"get groups success !", groups:result})     
                })
                
                })
            
}


// Retreive group c
export const getGroupMember = async (req:any, res:any) => {
  const userid = req.user.id
  console.log("I am getting group")
  const sqlSearch = `SELECT * FROM group_member WHERE user_id  = ?`
   const search_query = mysql.format(sqlSearch,[userid])
              pool.query(search_query, async (err, result:any) => {
                  if (err) {
                    return  res.json({success:false, message:"no group members found "})   
                  }
                       console.log(`groupmember: ${result}`)
              res.json({success:true, message:" Fetch group members!!", groupmembers:result})     
              })
            
              
          
}
