import express from 'express';
import {
createGroup,addGroupMember,  getGroups, getGroupMember, searchGroup
 } from "../controllers/Groups";
import { upload } from '../utils/storage';
 import { authorizeJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/creategroup', authorizeJWT, upload.fields([{ name: 'image', maxCount: 1 }]),  createGroup )

router.post('/add/groupmembers', authorizeJWT,   addGroupMember )
router.get('/getgroups', authorizeJWT,   getGroups )
router.get('/get/groupmembers', authorizeJWT,getGroupMember )
router.get('/search-group', authorizeJWT, searchGroup)


 
  

  






export default router;