
import jwt from 'jsonwebtoken'
import { NextFunction  } from "express";

// Create JWT for Two factor Authorization
 export const createAccessToken = (data:{id:string, email:string, firstname:string, lastname:string}) => {
return jwt.sign(data, process.env.ACCESSTOKEN!,  {
  expiresIn:process.env.JWT_ACCESS_EXPIRATION!,
})
} 

 //Create JWT for Two factor Authentication
export const create2FAtoken = (data:{id:string, email:string, firstname:string, lastname:string, key:string|undefined}) => {
  return jwt.sign(data, process.env.TWOFACODE_TOKEN!,  {
    expiresIn:process.env.TWOFACODE_EXPIRATION!,
  })
  }
  

// Create Forgot Password JWT 
  export const forgotPasswordToken = (id:string) => {
    return jwt.sign({id}, process.env.FORGOT_PASSWORD_TOKEN!,  {
      expiresIn:'35m',
    })
    }
  

// Create Change Password JWT 
    export const changePasswordToken = (id:any) => {
      return jwt.sign({id}, process.env.CHANGE_PASSSWORD_TOKEN!,  {
        expiresIn:'5m',
      })
      }
  
  
      //verify JWT accessToken
export const authenticateJWT = (req:any, res:any, next:any) => {
  const accessToken = req.cookies.accessToken
if (!accessToken){
  return res.json({success:false,  message:"No  token found, authorization denied!"})
}
 // Verify the token using the secret key
  jwt.verify(accessToken, process.env.ACCESSTOKEN!, async (err:any, user:any) => {
    if(err){
      res.json({ success: false, message:`Invalid or expired token` })
    }
         // Attach the user to req.user
      req.user = user
       next(); 
       // Proceed to the next middleware or route handle
    
 })

};

   
 

export const authorizeJWT = (req:any,  res:any, next:any) => {
  // Fetching Token from request header
  const token = req.cookies.token

if (!token){
   return res.json({success:false,  message:"Login required!"})
}else{
  jwt.verify(token, process.env.TWOFACODE_TOKEN!, async (err:any, user:any) => {
    if(err){
        return res.json({success:false,  message:`Invalid or expired access token!`})
    }
    next(); 
    // Proceed to the next middleware or route handle
 })
}


}





export const verifyForgotPassword= (req:any,  res:any, next:NextFunction) => {
const forgotPasswordtoken = req.cookies.token
//    console.log(`verifytoken => ${token}`)
if (!forgotPasswordtoken ){
   return res.json({success:false,  message:"Not Authorized! Token does not exist"})
}
jwt.verify(forgotPasswordtoken , process.env.FORGOT_PASSWORD_TOKEN!, async (err:any, data:any) => {
   if(err){
       return res.json({success:false,  message:`Cannot verify token + ${err}`})
   
   }else{
       const user = req.user
       if (user) return res.json({ success: true, message:`Welcome ${user.username}`, user: user.username })
           else return res.json({ success: false, message:"Not Authorized!" })
   }

})
next()  
}

