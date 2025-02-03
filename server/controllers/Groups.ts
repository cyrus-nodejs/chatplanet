import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';

import mysql from 'mysql2';

//Create Group by User
export const createGroup = (req:any, res:any) => {

    const { name} = req.body

    console.log(name)
    if (!name ) {
        return res.json({ success:false, message: 'All fields are required!' });
      }
    pool.connect(async (err) => {
                if (err) throw err;
                const sqlInsert = `INSERT INTO groupchat(id, name) VALUES (?,?)`           
                const insert_query = mysql.format(sqlInsert, [uuidv4(), name])
            pool.query (insert_query, (err, result:any)=> {
              if (err){
                console.log(err)
              return res.json({success:false, message:"Cannot create group"}) 
              }
              console.log('new group created')
              res.json({success:true, message:"New group created!", groups:result})
             })     
        
                     

                    })
        }



        export const addGroupMember = (req:any, res:any) => {
           const {group_id, user_id} = req.body
        console.log(`addgroup member ${req.body}`)
            pool.connect(async (err) => {
                        if (err) throw err;
                        const sqlInsert = `INSERT INTO group_members(group_id, user_id) VALUES (?,?)`           
                        const insert_query = mysql.format(sqlInsert, [group_id, user_id])
                    pool.query (insert_query, (err, result:any)=> {
                      if (err){
                        console.log(err)
                      return res.json({success:false, message:`${err}: error contacting `}) 
                      }
                      console.log('contact added to group')
                      res.json({success:true, message:"contact added to group", groupContact:result})
                     })     
                
                              
        
                            })
                }
        
    



// Retreive group 
export const getGroups = async (req:any, res:any) => {
    const userId = req.user.id
    console.log("I am getting group")
    const sqlSearch = `SELECT * FROM groupchat  WHERE name IS NOT NULL`
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
                // connection.release()
                })
            
}


// Retreive group c
export const getGroupMember = async (req:any, res:any) => {
  const {group_id} = req.params
        
  console.log("I am getting group")
  const sqlSearch = `SELECT * FROM group_members  WHERE group_id is = ?`
   const search_query = mysql.format(sqlSearch,[group_id])

          pool.connect(async (err) => {
              if (err) {
                return  res.json({success:false, message:"Connection Error "})   
              }
              pool.query(search_query, async (err, result:any) => {
                  if (err) {
                    return  res.json({success:false, message:"no group members found "})   
                  }
                       console.log(result)
              res.json({success:true, message:" groups members found!", groups:result})     
              })
              // connection.release()
              })
          
}
