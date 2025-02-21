import express from 'express';
import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();
import {
    getOnlineUsers, getAllUsers, updateAbout, updateLocation, UpdateProfileImage, updatePhoneContact
 } from "../controllers/User";
import { upload } from '../utils/storage';


 

 router.post("/updateimage", authenticateJWT, upload.fields([{ name: 'image', maxCount: 1 }]), UpdateProfileImage);
 router.post("/updatebio", authenticateJWT, updateAbout);
 router.post("/updatelocation", authenticateJWT, updateLocation);
 router.post("/updatemobile", authenticateJWT, updatePhoneContact);
 router.get('/onlineusers', authenticateJWT, getOnlineUsers )
 router.get('/allusers', authenticateJWT, getAllUsers )


 
  

  






export default router;