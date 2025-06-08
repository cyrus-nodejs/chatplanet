import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt'
import { createAccessToken, forgotPasswordToken, create2FAtoken } from '../middlewares/jwt/jwt';
import { contactEmail } from '../utils/nodemailer';

import speakeasy from 'speakeasy'
import jwt from 'jsonwebtoken'

//Signup and save new User to database
export const Register = async (req: any, res: any) => {
  try {
    const { email, firstname, lastname, password, mobile } = req.body;

    if (!email || !firstname || !lastname || !password || !mobile) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const sqlInsert = `
      INSERT INTO users (id, firstname, lastname, email, mobile, password) 
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id
    `;
    const values = [uuidv4(), firstname, lastname, email, mobile, hashedPassword];

    const result = await pool.query(sqlInsert, values);

    return res.status(201).json({ success: true, message: 'User registered successfully!', userId: result.rows[0].id });
  } catch (err: any) {
    console.error('Registration error:', err);

    if (err.code === '23505') { // unique_violation
      return res.status(409).json({ success: false, message: 'User with this email already exists' });
    }

    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// email password authentication


export const Login = async (req: any, res: any) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password required' });
  }

  try {
    const sqlSearch = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(sqlSearch, [email]);

    if (result.rowCount === 0) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect email or password' });
    }

    // Generate MFA secret per user — should actually be stored per-user in DB for reuse
    const secret = speakeasy.generateSecret({ name: 'ChatPlanet' });
    const mfaCode = speakeasy.totp({
      secret: secret.base32,
      encoding: 'base32'
    });

   
// Store secret in DB
await pool.query(
  'UPDATE users SET mfa_secret = $1 WHERE id = $2',
  [secret.base32, user.id]
);
    await contactEmail.sendMail({
      from: `ChatPlanet 👻 <${process.env.Email}>`,
      to: user.email,
      subject: '2FA CODE',
      html: `
        <p>You requested a one-time code for authentication:</p>
        <h2>${mfaCode}</h2>
        <p>This code is valid for 15 minutes.</p>
        <p>If you didn’t request this, please secure your account.</p>
      `
    });

    const tokenData = {
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname,
    };

    const token = create2FAtoken(tokenData);

    res.cookie('token', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'none'
    });

    return res.json({
      success: true,
      message: `MFA code sent to ${user.email}`,
       token:token
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};
//Multifactor authentication
    export const twoFactorLogin  = async (req:any, res:any, next:any) =>{
          const {  mfacode } = req.body;
           const userId= req.user.id
           console.log(`this is ${req.user}`)
  if (!userId || !mfacode) {
    return res.status(400).json({ success: false, message: 'MFA code and user ID are required' });
  }

  try {
    // Step 1: Get the stored MFA secret
    const result = await pool.query(
      'SELECT id, email, firstname, lastname, mfa_secret FROM users WHERE id = $1',
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const user = result.rows[0];
  
    if (!user.mfa_secret) {
      return res.status(400).json({ success: false, message: 'MFA not initiated or expired' });
    }

    // Step 2: Verify the MFA code
    const verified = speakeasy.totp.verify({
      secret: user.mfa_secret,
      encoding: 'base32',
      token: mfacode,
      window: 1, // allows ±30s drift
    });



    if (!verified) {
      return res.status(401).json({ success: false, message: 'Invalid MFA code' });
    }

    // Step 3: Clean up MFA secret 
    await pool.query('UPDATE users SET mfa_secret = NULL WHERE id = $1', [user.id]);

    // Step 4: Create a session token (e.g., full auth token)
    const accessToken = createAccessToken({
      id: user.id,
      email: user.email,
      firstname: user.firstname,
      lastname: user.lastname
    });

    // Step 5: Set cookie or return token
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    return res.json({ success: true, message: 'MFA verified. Login successful!', user:req.user, accessToken:accessToken });

  } catch (err) {
    console.error('verifyMFA error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
    }

   
    // Forgot password
export const ForgotPassword = async (req: any, res: any) => {
  const { email } = req.body;

  try {
    const sqlSearch = "SELECT * FROM users WHERE email = ?";
    const values = [email];

    pool.query(sqlSearch, values, async (err, result:any) => {
      if (err) {
        console.error("SQL Search Error:", err);
        return res.status(500).json({ success: false, message: "Server error. Try again later." });
      }

      if (result?.length === 0) {
        return res.status(404).json({ success: false, message: "No user found with this email." });
      }

      const user = result[0];
      const token = forgotPasswordToken(user.id); // Generate a secure token

      const sqlUpdate = "UPDATE users SET resettoken=? WHERE id=?";
      pool.query(sqlUpdate, [token, user.id], async (err, updateResult) => {
        if (err) {
          console.error("Token Update Error:", err);
          return res.status(500).json({ success: false, message: "Failed to set reset token." });
        }

        // Send the reset email
        try {
          await contactEmail.sendMail({
            from: '"SoundPlanet 👻" <adeyemiemma45@gmail.com>',
            to: email,
            subject: "Reset Your Password",
            html: `
              <p>Hello ${user.firstname},</p>
              <p>We received a request to reset your password. Click the link below to reset it:</p>
              <a href="${process.env.FRONTEND_URL}/resetpassword/${token}">Reset Password</a>
              <p>If you didn’t request this, please ignore this email.</p>
            `,
          });

          return res.status(200).json({ success: true, message: "A password reset link has been sent to your email." });
        } catch (emailErr) {
          console.error("Email Send Error:", emailErr);
          return res.status(500).json({ success: false, message: "Failed to send reset email." });
        }
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};
// reset password
export const ResetPassword = async (req: any, res: any) => {
  const { password } = req.body;
  const { token } = req.params;

  if (!token) {
    return res.status(400).json({ success: false, message: "Token is required" });
  }

  try {
    // Verify JWT token
    jwt.verify(token, process.env.FORGOT_PASSWORD!, async (err: any, decoded: any) => {
      if (err) {
        return res.status(401).json({ success: false, message: "Invalid or expired token!" });
      }

      // Find user by token
      const sqlSearch = "SELECT * FROM users WHERE resettoken = ?";
      pool.query(sqlSearch, [token], async (err, result: any) => {
        if (err) {
          console.error("SQL Search Error:", err);
          return res.status(500).json({ success: false, message: "Server error." });
        }

        if (result.length === 0) {
          return res.status(404).json({ success: false, message: "Token not found or already used." });
        }

        // Hash the new password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Update password and clear the token
        const sqlUpdate = "UPDATE users SET password = ?, resettoken = NULL WHERE resettoken = ?";
        pool.query(sqlUpdate, [hashedPassword, token], (err, updateResult) => {
          if (err) {
            console.error("Password Update Error:", err);
            return res.status(500).json({ success: false, message: "Failed to update password." });
          }

          return res.status(200).json({ success: true, message: "Password has been reset successfully." });
        });
      });
    });
  } catch (error) {
    console.error("Unexpected Error:", error);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
};

//Retrieve authenticated User
export const getAuthUser = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "No user found" });
  }

  console.log(`Authenticated user: ${req.user.firstname}`);

  return res.status(200).json({
    success: true,
    message: `Welcome ${req.user.firstname}`,
    user: req.user,
  });
};
  //Retrieve authenticated User
export const LogOut = async (req: any, res: any) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "No user found" });
  }

  res.clearCookie('accessToken', {
    httpOnly: true,
    secure: true,       // set true if HTTPS
    sameSite: 'None',   // adjust according to your client setup
  });

  console.log('Cookie cleared');
  return res.status(200).json({ success: true, message: 'Logout success!' });
};
  
  



