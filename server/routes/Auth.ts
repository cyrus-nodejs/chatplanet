import express from 'express';

const router = express.Router();
import {
  RegisterUser, LoginUser,
  ForgotPassword, ResetPassword, twoFactorLogin, getAuthUser
 } from "../controllers/Auth";
 import {authorizeJWT, authenticateJWT } from '../middlewares/jwt/jwt';






router.post('/', authenticateJWT,  getAuthUser  )
 router.post("/register", RegisterUser);
router.post("/login", LoginUser );
router.post("/login/2fa", authorizeJWT,  twoFactorLogin );
router.post('/forgotpassword',  ForgotPassword )
router.post('/resetpassword/:token',  ResetPassword  )


 
  

  






export default router;