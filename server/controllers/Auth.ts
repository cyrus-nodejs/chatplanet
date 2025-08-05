import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { createAccessToken, createRefreshToken, forgotPasswordToken,  verifyRefreshToken } from '../middlewares/jwt/jwt';
import { contactEmail } from '../utils/nodemailer';
import { Request, Response, NextFunction } from 'express'
import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

import dotenv from "dotenv";

dotenv.config()


import {getRedisClient}  from '../src/config/redis'; // Assuming you're using Redis for MFA sessions

import { RequestHandler } from 'express';


//Signup and save new User to database
export const Register: RequestHandler = async (req: any, res: any): Promise<void> => {
  try {
    const { email, firstname, lastname, password, mobile } = req.body;

    if (!email || !firstname || !lastname || !password || !mobile) {
     return void  res.status(400).json({ success: false, message: 'All fields are required' });
        
    }

    // Check for existing user by email or mobile
    const existingUser = await pool.query(
      'SELECT email, mobile FROM users WHERE email = $1 OR mobile = $2',
      [email, mobile]
    );

    if (existingUser.rows.length > 0) {
      const user = existingUser.rows[0];
      const conflictField = user.email === email ? 'email' : 'mobile';
    return void   res.status(409).json({ success: false, message: `User with this ${conflictField} already exists` });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sqlInsert = `
      INSERT INTO users (id, firstname, lastname, email, mobile, password) 
      VALUES ($1, $2, $3, $4, $5, $6)
    ING id
    `;
    const values = [uuidv4(), firstname, lastname, email, mobile, hashedPassword];

    const result = await pool.query(sqlInsert, values);

  return void    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      userId: result.rows[0].id,
    });
  } catch (err: any) {
    console.error('Registration error:', err);

    if (err.code === '23505') {
       res.status(409).json({
        success: false,
        message: 'User with this email or mobile already exists',
      });
    }

  return void    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

// email password authentication

const mfaSessions: Record<string, { userId: number; expiresAt: number }> = {};

export const Login:RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  const redis = getRedisClient();


  if (!email || !password) {
    return  void res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rowCount === 0) {
      return void  res.status(401).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return void  res.status(403).json({ success: false, message: 'Incorrect email or password' });
    }

    // Generate MFA secret and OTP
    const secret = speakeasy.generateSecret({ name: 'ChatPlanet' });
    const mfaCode = speakeasy.totp({ secret: secret.base32, encoding: 'base32' });

    // Store MFA secret in Redis with sessionId
    const sessionId = uuidv4();
    await redis.setEx(`mfa:${sessionId}`, 900, JSON.stringify({
      userId: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
      secret: secret.base32
    })); // Expires in 15 mins

    // Send MFA code via email
    await contactEmail.sendMail({
      from: `ChatPlanet 👻 <${process.env.Email}>`,
      to: user.email,
      subject: '2FA CODE',
      html: `
        <p>Your one-time MFA code:</p>
        <h2>${mfaCode}</h2>
        <p>This code expires in 15 minutes.</p>
      `
    });
    console.log(`This is cookie ${sessionId} `)
    // Set sessionId as HTTP-only cookie
    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure:true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000
    });

    return void  res.json({ success: true, message: 'MFA code sent to your email' });
  } catch (err) {
    console.error('Login error:', err);
    return void  res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
//Multifactor authentication
  
export const twoFactorLogin:RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { mfacode } = req.body;
  const sessionId = req.cookies.sessionId  || req.headers.authorization?.split(' ')[1] ;
   console.log(sessionId)
    const redis = getRedisClient();

  if (!sessionId) {
    return void  res.status(400).json({ success: false, message: 'Session expired or invalid' });
  }

  if (!mfacode) {
    return void  res.status(400).json({ success: false, message: 'MFA code is required' });
  }

  try {
    const sessionData = await redis.get(`mfa:${sessionId}`);
    if (!sessionData) {
      return void  res.status(400).json({ success: false, message: 'MFA session expired' });
    }

    const userData = JSON.parse(sessionData);
    console.log(userData)
    // Verify MFA code
    const verified = speakeasy.totp.verify({
      secret: userData.secret,
      encoding: 'base32',
      token: mfacode,
      window: 1
    });

    if (!verified) {
      return void  res.status(401).json({ success: false, message: 'Invalid MFA code' });
    }

    // Remove MFA session
    await redis.del(`mfa:${sessionId}`);

    // Clear session cookie
    res.clearCookie('sessionId', {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

      const userPayload =  {
      id: userData.userId,
      email: userData.email,
      firstname: userData.firstname,
      lastname: userData.lastname
    }

    // Generate JWT
    const accessToken = createAccessToken(userPayload);
     const refreshToken = createRefreshToken(userPayload);

    // Set JWT as cookie 
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'none',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
    
    delete userData.secret; // remove sensitive info

    return void  res.status(200).json({ success: true, message: 'Login successful', user: userData });
  } catch (err) {
    console.error('MFA verify error:', err);
    return void  res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
   

export const refreshAccessToken:RequestHandler = async (req:Request, res:Response): Promise<void> => {
  const redis = getRedisClient();
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return void res.status(401).json({ success: false, message: 'No refresh token provided' });

  try {
    const decoded = verifyRefreshToken(refreshToken);
if (decoded) {
    // Check if token matches stored one in Redis
    const storedToken = await redis.get(`refresh:${decoded?.id}`);
    if (storedToken !== refreshToken) {
      return void res.status(403).json({ success: false, message: 'Invalid refresh token' });
    }


const userPayload =  {
      id:  decoded.id,
      email: decoded.email,
      firstname: decoded.firstname,
      lastname: decoded.lastname
    }
    const newAccessToken = createAccessToken(userPayload);

      

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 15 * 60 * 1000,
    });
  return void res.json({ success: true, message: 'Token refreshed' });
}
  
  
  } catch (err) {
    return void res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
  }
};
    // Forgot password
export const ForgotPassword:RequestHandler = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  try {
    const sqlSearch = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    pool.query(sqlSearch, values, async (err, result:any) => {
      if (err) {
        console.error("SQL Search Error:", err);
       res.status(500).json({ success: false, message: "Server error. Try again later." });
      }

      if (result?.length === 0) {
       res.status(404).json({ success: false, message: "No user found with this email." });
      }

      const user = result[0];
      const token = forgotPasswordToken(user.id); // Generate a secure token

      const sqlUpdate = "UPDATE users SET resettoken=? WHERE id=?";
      pool.query(sqlUpdate, [token, user.id], async (err, updateResult) => {
        if (err) {
          console.error("Token Update Error:", err);
         res.status(500).json({ success: false, message: "Failed to set reset token." });
        }

        // Send the reset email
        try {
          await contactEmail.sendMail({
            from: '"SoundPlanet 👻" <adeyemiemma45@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `
              <p>Hello ${user.firstname},</p>
              <p>We received a any to reset your password. Click the link below to reset it:</p>
              <a href="${process.env.FRONTEND_URL}/resetpassword/${token}">Reset Password</a>
              <p>If you didn’t any this, please ignore this email.</p>
            `,
          });

         res.status(200).json({ success: true, message: "A password reset link has been sent to your email." });
        } catch (emailErr) {
          console.error("Email Send Error:", emailErr);
         res.status(500).json({ success: false, message: "Failed to send reset email." });
        }
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
   res.status(500).json({ success: false, message: "Internal server error." });
  }
};
// reset password
export const ResetPassword = async (req: Request, res: Response) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!token) {
   res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    // Verify JWT token
    jwt.verify(token, process.env.FORGOT_PASSWORD!, async (err: any, decoded: any) => {
      if (err) {
       res.status(401).json({ success: false, message: "Invalid or expired token!" });
      }

      // Find user by token
      const sqlSearch = "SELECT * FROM users WHERE resettoken = ?";
      pool.query(sqlSearch, [token], async (err, result: any) => {
        if (err) {
          console.error("SQL Search Error:", err);
         res.status(500).json({ success: false, message: "Server error." });
        }

        if (result.length === 0) {
         res.status(404).json({ success: false, message: "Token not found or already used." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear the token
        const sqlUpdate = "UPDATE users SET password = ?, resettoken = NULL WHERE resettoken = ?";
        pool.query(sqlUpdate, [hashedPassword, token], (err, updateResult) => {
          if (err) {
            console.error("Password Update Error:", err);
           res.status(500).json({ success: false, message: "Failed to update password." });
          }

         res.status(200).json({ success: true, message: "Password has been reset successfully." });
        });
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
   res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Retrieve authenticated User
export const getAuthUser = async (req: Request, res: Response) => {
  if (!req.user) {
   res.status(401).json({ success: false, message: "No user found" });
     return;
  }

  console.log(`Authenticated user: ${req.user.firstname}`);

 res.status(200).json({
    success: true,
    message: `Welcome ${req.user.firstname}`,
    user: req.user,
  });
};

  
export const LogOut = async (req:any, res:any) => {
    const redis = getRedisClient();
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) {
    try {
      const decoded = verifyRefreshToken(refreshToken);
      await redis.del(`refresh:${decoded?.id}`);
    } catch {}
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  return res.json({ success: true, message: 'Logged out successfully' });
};

  



