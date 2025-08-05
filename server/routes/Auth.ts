import express from 'express';

const router = express.Router();
import {
  Register, Login, LogOut,
  ForgotPassword, ResetPassword, refreshAccessToken, twoFactorLogin, getAuthUser
 } from "../controllers/Auth";
 import {authorizeJWT } from '../middlewares/jwt/jwt';






router.get('/user', authorizeJWT,  getAuthUser  )
router.get('/logout', authorizeJWT,  LogOut  )

router.post("/register", Register);
router.post("/login", Login );
router.post("/login/2fa",   twoFactorLogin );


router.post('/forgotpassword',  ForgotPassword )
router.post('/resetpassword/:token',  ResetPassword  )

router.post("/refresh-token",   refreshAccessToken );
 
  

  






export default router;