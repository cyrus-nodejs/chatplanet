import express from 'express';
import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();
import {
   updateProfile, getProfile, getOnlineUsers
 } from "../controllers/User";




 router.put("/updateprofile", authenticateJWT, updateProfile);
 router.get('/onlineusers', authenticateJWT, getOnlineUsers )
router.get('/getprofile', authenticateJWT,  getProfile )

 
  

  






export default router;