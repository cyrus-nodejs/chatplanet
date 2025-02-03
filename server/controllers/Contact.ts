import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';

//Create User contact list
export const addContact = (req:any, res:any) => {
    const { email} = req.body
    console.log(req.user)
  
           
    pool.connect(async (err) => {
                if (err) throw err;
                const sqlSearch = "Select * from users where email = ?"
                const search_query = mysql.format(sqlSearch,[email])            
        pool.query (search_query, (err, result:any)=> {
        if (err) throw err;
        console.log(result[0]) 
        const sqlInsert = "INSERT INTO contacts(id, userid, firstname, lastname, email) VALUES (?,?,?,?,?)"             
      const insert_query = mysql.format(sqlInsert,[req.user?.id, result[0].id, result[0].firstname, result[0].lastname, result[0].email])
        pool.query (insert_query, (err, result:any)=> {
          if (err){
            console.log(err)
          return res.json({success:false, message:"User not saved."}) 
          }
          console.log(`This is ${ result.affectedRows}`)
          res.json({success:true, message:"Contact added to database!"})
         })   
                        })
                        
                       }
            )
        }

    


//Rerieve User contactlist
export const getContact = async (req:any, res:any) => {
    const user = req.user.id
    console.log("I am getting contact")
    const sqlSearch = "SELECT * FROM contacts WHERE id = ?"
    const search_query = mysql.format(sqlSearch,[user])
    if (!user){
        res.json({success:false, message:"No user found!"})
    }
            pool.connect(async (err) => {
                if (err) {
                  return  res.json({success:false, message:"Connection Error "})   
                }
                pool.query(search_query, async (err, result:any) => {
                    if (err) {
                      return  res.json({success:false, message:"No contacts found "})   
                    }
                         console.log("get contact success")
             res.json({success:true, message:"Contacts ", contacts:result})     
                })
            
                })
            
}
