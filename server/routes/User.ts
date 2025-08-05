import express from 'express';
import { authorizeJWT } from '../middlewares/jwt/jwt';
const router = express.Router();
import {
    getOnlineUsers, getAllUsers, updateAbout, updateLocation, UpdateProfileImage, updatePhoneContact
 } from "../controllers/User";
import { upload } from '../utils/storage';


 

 router.post("/updateimage", authorizeJWT, upload.fields([{ name: 'image', maxCount: 1 }]), UpdateProfileImage);
 router.post("/updatebio", authorizeJWT, updateAbout);
 router.post("/updatelocation", authorizeJWT, updateLocation);
 router.post("/updatemobile", authorizeJWT, updatePhoneContact);
 router.get('/onlineusers', authorizeJWT, getOnlineUsers )
 router.get('/allusers', authorizeJWT, getAllUsers )


 
  

  






export default router;