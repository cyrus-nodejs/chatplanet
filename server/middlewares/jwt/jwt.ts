
import jwt from 'jsonwebtoken'
import { NextFunction  } from "express";
import { verifyToken } from 'authenticator';



 //Create JWT for Two factor Authentication
export const create2FAtoken = (data:{id:string, email:string, firstname:string, lastname:string}) => {
  return jwt.sign(data, process.env.TWOFACODE_TOKEN!,  {
    expiresIn:process.env.TWOFACODE_EXPIRATION!,
  })
  }
  
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstname: string;
    lastname: string;
  };

}


// Create Forgot Password JWT 
  export const forgotPasswordToken = (id:string) => {
    return jwt.sign({id}, process.env.FORGOT_PASSWORD_TOKEN!,  {
      expiresIn:'35m',
    })
    }
  



interface AccessTokenPayload {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

interface RefreshTokenPayload {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}


export const createAccessToken = (payload: AccessTokenPayload): string => {
  return jwt.sign(payload, process.env.ACCESSTOKEN! as string, {
    expiresIn: process.env.JWT_ACCESS_EXPIRATION! || '15m', // Short-lived token
  });
};

export const createRefreshToken = (payload: RefreshTokenPayload): string => {
  return jwt.sign(payload, process.env.REFRESHTOKEN as string, {
    expiresIn: process.env.JWT_REFRESH_EXPIRATION! || '7d', // Long-lived token
  });
};

export const verifyAccessToken = (token: string): AccessTokenPayload | null => {
  try {
    return jwt.verify(token, process.env.ACCESSTOKEN as string) as AccessTokenPayload;
  } catch (error) {
    return null;
  }
};

export const verifyRefreshToken = (token: string): RefreshTokenPayload | null => {
  try {
    return jwt.verify(token, process.env.REFRESHTOKEN as string) as RefreshTokenPayload;
  } catch (error) {
    return null;
  }
};


 

export const authorizeJWT = (req:any,  res:any, next:any) => {
const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];
console.log(token)
  if (!token) {
    return res.status(401).json({ success: false, message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESSTOKEN as string) as AuthenticatedRequest['user'];
    req.user = decoded;
   
    next();
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
  
}

// Create Change Password JWT 
    export const changePasswordToken = (id:any) => {
      return jwt.sign({id}, process.env.CHANGE_PASSSWORD_TOKEN!,  {
        expiresIn:'5m',
      })
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










