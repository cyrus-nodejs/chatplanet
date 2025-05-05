import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { createAccessToken, forgotPasswordToken, create2FAtoken } from '../middlewares/jwt/jwt';
import { contactEmail } from '../utils/nodemailer';

import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

//Signup and save new User to database
export const RegisterUser  = async (req:any, res:any) =>{
const { email, firstname, lastname, password, mobile} = req.body

console.log(req.body)
const salt = await bcrypt.genSalt();
const hashedPassword = await bcrypt.hash(password, salt);

//connect to Postgresql server

 const sqlInsert = "INSERT INTO users(id, firstname, lastname, email, mobile, password) VALUES ($1,$2,$3,$4,$5,$6)"
 const values = [uuidv4(), firstname, lastname, email, mobile, hashedPassword] 
        pool.query (sqlInsert, values , (err, result:any)=> {
          if (err){
            console.log(err)
          return res.json({success:false, message:'User Canot be reigistered!'}) 
          }
          console.log(`This is ${ result.rows}`)
          res.json({success:true, message:"User Saved! Success!"})
         })
      
        
    
}

// email password authentication
export const LoginUser  = async (req:any, res:any, next:any) =>{
    const { email, password} = req.body
    console.log(email, password)
          const sqlSearch = "Select * from users where email = $1"
          const values = [email] 
           //Postgresql prepared statement
           pool.query (sqlSearch, values, async (err, result:any) => {
              if (err){
    return res.json({success:false, message:err.stack}) 
              }else{
                 console.log(result.rows[0]?.password)
                 if ( await bcrypt.compare(password,  result.rows[0]?.password)) {
        const secret = speakeasy.generateSecret({name: "Chatplanet"});
      const mfaCode = speakeasy.totp({secret: secret.base32,encoding: 'base32'});
               await contactEmail.sendMail({
                  from: `ChatPlanet 👻  ${process.env.Email} >`, // sender address
                  to: `${result.rows[0]?.email}`, // list of receivers
                  subject: "2FA CODE", // Subject line
                  text: "Hello world?", // plain text body
                  html: `You are receiving this email because a request was made for a one-time code that can be used for authentication.
      Please enter the following code for verification:
      ${mfaCode} . MFA Code valid for 15 minutes
      If you did not request this change, please change your password or use the chat in the ChatPlanet Interface to contact us.`, // html body
                });
                const data = {id: result.rows[0]?.id,  email:result.rows[0]?.email, firstname: result.rows[0]?.firstname, lastname:result.rows[0]?.lastname, key:secret.base32}
                const token = create2FAtoken(data)
                 res.cookie("token", token ,  {withCredentials:true, httpOnly:true, secure:true, sameSite:"none" } )
                 res.json({success:true, message:`MFA code sent to ${result.rows[0]?.email}`})
                } 
                else{
            
                res.json({success:false, message:"Password doesn't match"})
                }
                
                
              }
               
        }  ) 
    
    
   
 
    }

//Multifactor authentication
    export const twoFactorLogin  = async (req:any, res:any, next:any) =>{
         const {mfacode} = req.body
         console.log(`mfacode = ${mfacode}`)
        const token = req.cookies?.token
         try{
         if(!mfacode){
          res.json({success:false,  message:`Please enter MFA code!!`})
         }else{
        if (!token){
           return res.json({success:false,  message:"Login required"})
        }else{
          console.log(`2fwt == ${token}`)
        jwt.verify(token, process.env.TWOFACODE_TOKEN!, async (err:any, data:any) => {
           if(err){
            console.log('expired!')
               return res.json({success:false,  message:`Invalid or expired!`})
           }else{
            console.log(data.key, mfacode)
            const isValid = speakeasy.totp.verify({
              secret: data.key,
              encoding: 'base32',
              token: mfacode,
              window: 6
          });
          console.log(isValid)
          if (isValid) {
            // Successful 2FA, proceed to authentication
            const user = {id: data.id,  email:data.email, firstname: data.firstname, lastname:data.lastname}
                 const accessToken = createAccessToken(user)
                   res.cookie("accessToken", accessToken,   {
                     withCredentials:true, 
                     httpOnly:true, 
                     secure:true, 
                     sameSite:"none" 
                 } );

                 console.log('token matches!')
               res.json({success:true, message:`2fAcode Matches! Login success. `, token:accessToken})
        } else {
            // Invalid 2FA code
            res.status(400).json({ success: false, message: 'Invalid 2FA code' });
        }
        next()
           }
         
        })
      }
      }
      }catch(err){
        
      }
      
    
    }

   
    // Forgot password
export const ForgotPassword = async (req:any, res:any ) => {
  const {email} = req.body

  try {
    
      const sqlSearch = "SELECT * FROM users WHERE email = ?"
      const values = [email]
     
       pool.query (sqlSearch, values, async (err, result:any) => {
        if (err) {
          return  res.json({success:false, message:"User does not exist "})   
        }
        const user = result[0]
        console.log(user)
           const token = forgotPasswordToken(user.id)
           console.log(token)
           const sqlUpdate = `UPDATE users SET resettoken=?  `

           pool.query(sqlUpdate,[token], async (err, result) => {
            if (err) {
              return  res.json({success:false, message:"Token reset error "})   
            }
             console.log(result + " record(s) updated");
             await contactEmail.sendMail({
              from: '"SoundPlanet 👻" adeyemiemma45@gmail.com>', // sender address
              to: `${email}`, // list of receivers
              subject: "Forgot Password Link", // Subject line
              text: "Hello world?", // plain text body
              html: `Hello ${user.firstname}, We have received a request to reset your password. Please reset your password using the link below.",
                ${process.env.FRONTEND_URL}/resetpassword/${token},
                Reset Password`, // html body
            });
           
            res.json({success:true, message:"A password reset link has been sent to your email.", token:token }); 
           });
      
        //end of User exists i.e. results.length==0
       }) //end of connection.query()
    
  }catch (error){
      console.log(error)
      
  }
 
}

// reset password
export const ResetPassword = async (req:any, res:any  ) => {
  const { password} = req.body
  const { token} = req.params;
  console.log(token, password)

  try {
     if (token){
      jwt.verify(token, process.env.FORGOT_PASSWORD!, async  (err: any, data: any) =>{
        if(err){
          return res.json({success:false,  message:`Invalid token or expired!`})
      }
   
        const sqlSearch = "SELECT * FROM users WHERE resettoken = ?"g
        const values = [token]
        pool.query(sqlSearch, values, async (err, result:any) => {
            if (err) throw (err)
                console.log(result.length)
                if (result.length == 0) {
                 
                 console.log("------> No token found")
                 res.json({success:false, message:"No token found"}) 
                } 
                else {
                  const sqlUpdate = `UPDATE users SET password=${password} `
                  // const insert_query = mysql.format(sqlInsert,[password])
                  pool.query (sqlUpdate, (err, result:any)=> {
                 
                 if (err) throw (err)
              
                console.log ("--------> password reset success!")
                 console.log(result.insertId)
                  const deleteToken =  `DELETE FROM users WHERE resettoken=${token}`
                  pool.query (deleteToken, (err, result:any)=> {
                
                    if (err) throw (err)
                      console.log('reset token deleted!')
                  })
                 res.json({success:true, message:"Paasword reset success!"})
                })
               }
              })
        
    })
  }
  
    
     
  }catch (error){
      console.log(error)
      
  }
 
}


//Retrieve authenticated User
export const  getAuthUser = async (req:any,  res:any) => {
  if (!req.user){
   return res.json({ success: false, message:`No User Found`})
  }
   res.json({ success: true, message:`Welcome ${req.user.firstname}`, user: req.user })

  }
  
  



