import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';

//Create User contact list
export const addContact = async (req:any, res:any) => {
    const { email} = req.body
    console.log(req.user)
  
                const sqlSearch = "Select * from users where email = $1"
                const value = [email] 
                          
        pool.query (sqlSearch, value, (err, result:any)=> {
        if (err) throw err;
        console.log(result.rows[0]) 
        const sqlInsert = "INSERT INTO contacts(id, userid, firstname, lastname, email, mobile) VALUES ($1,$2,$3,$4,$5,$6)"             
        const values = [req.user?.id, result.rows[0]?.id, result.rows[0]?.firstname, result.rows[0]?.lastname, result.rows[0]?.email, result.rows[0]?.mobile] 
      
        pool.query (sqlInsert, values, async (err, result:any)=> {
          if (err){
            console.log(err)
          return res.json({success:false, message:"User not saved."}) 
          }
          console.log(result.rows[0])
          console.log(`contact added to database`)
          res.json({success:true, message:"Contact added to database!"})
         })   
                        })
                        
                       
          
        }

    


//Retrieve User contactlist
export const getContact = async (req:any, res:any) => {
    const user = req.user.id
    console.log("I am getting contact")
    const sqlSearch = "SELECT * FROM contacts WHERE id = ?"
    const search_query = mysql.format(sqlSearch,[user])
    if (!user){
        res.json({success:false, message:"No user found!"})
    }
   
                pool.query(search_query, async (err, result:any) => {
                    if (err) {
                      return  res.json({success:false, message:"No contacts found "})   
                    }else{
                      console.log(result.rows)
                      console.log("get contact success")
          res.json({success:true, message:"Contacts ", contacts:result.rows})
                    }

                       
                })
            
                
            
}
