import express from 'express';

const router = express.Router();
import {
  RegisterUser, LoginUser, LogOut,
  ForgotPassword, ResetPassword, twoFactorLogin, getAuthUser
 } from "../controllers/Auth";
 import {authorizeJWT, authenticateJWT } from '../middlewares/jwt/jwt';






router.get('/user', authenticateJWT,  getAuthUser  )
router.get('/logout', authenticateJWT,  LogOut  )
 router.post("/register", RegisterUser);
router.post("/login", LoginUser );
router.post("/login/2fa", authorizeJWT,  twoFactorLogin );
router.post('/forgotpassword',  ForgotPassword )
router.post('/resetpassword/:token',  ResetPassword  )


 
  

  






export default router;