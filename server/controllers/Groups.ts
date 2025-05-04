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
       
       const sqlSearch = `INSERT INTO groupchat(id, name, description, createdBy, group_image) VALUES ($1,$2,$3,$4,$5)`
     
       try{
           let imageData = {}
     if(image){
         const results = await uploadToCloudinary(image, "chatplanetassets")
         imageData = results
     }
     console.log(imageData)
                   const values = [uuidv4(), name, description, userid, imageData]
                   pool.query(sqlSearch, values, async (err, result:any) => {
                       if (err) {
                           console.log(err)
                           return  res.json({success:false, message:"!"})   
                         }
                             console.log('Group created successful!')
                            res.json({success:true, message:"Group created successful!"}) 
                  
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
       
        const sqlSearch = `SELECT * FROM group_member WHERE group_id = $1 AND user_id = $2`
   
               const values = [group_id, user_id]
                pool.query(sqlSearch, values, async (err, result:any) => {
                    if (err) {
                      console.log(err)
                      return  res.json({success:false, message:'Cannot fetch groups!'})   
                    }else if (result.length > 0){
                          return res.json({success:true, message: 'Contact exist already in group' });
                        }else{
                        const sqlInsert = `INSERT INTO group_member(group_id, user_id) VALUES ($1, $2)`           
                       
                        const values = [group_id, user_id]
                    pool.query (sqlInsert, values, (err, result:any)=> {
                      if (err){
                        console.log(err.stack)
                      return res.json({success:false, message:`cannaot add member to group`}) 
                      }
                      console.log('contact added to group')
                      res.json({success:true, message:"contact added to group", groupContact:result.rows})
                     })        
                        }    
                })


        }
                      
                
                              
        
                          
                
        
    



// Retreive group 
export const getGroups = async (req:any, res:any) => {
    const userId = req.user.id
    console.log("I am getting group")
    const sqlSearch = `SELECT * FROM groupchat`
    //  const search_query = mysql.format(sqlSearch,[userId])

         
                pool.query(sqlSearch, async (err, result:any) => {
                    if (err) {
                      return  res.json({success:false, message:"No groups found "})   
                    }
                         console.log('group success')
                       console.log(result.rows)
                res.json({success:true, message:"get groups success !", groups:result.rows})     
                })
                
                
            
}


// Retreive group 
export const getGroupMember = async (req:any, res:any) => {
  const userid = req.user.id
  console.log("I am getting group")
  const sqlSearch = `SELECT * FROM group_member WHERE user_id  = $1`
              const values = [userid]
              pool.query(sqlSearch, values, async (err, result:any) => {
                  if (err) {
                    return  res.json({success:false, message:"no group members found "})   
                  }
                       console.log(`groupmember: ${result}`)
              res.json({success:true, message:" Fetch group members!!", groupmembers:result.rows})     
              })
            
              
          
}
