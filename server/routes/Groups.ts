import express from 'express';
import {
createGroup,addGroupMember,  getGroups, getGroupMember, searchGroup
 } from "../controllers/Groups";
import { upload } from '../utils/storage';
 import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/creategroup', authenticateJWT, upload.fields([{ name: 'image', maxCount: 1 }]),  createGroup )

router.post('/add/groupmembers', authenticateJWT,   addGroupMember )
router.get('/getgroups', authenticateJWT,   getGroups )
router.get('/get/groupmembers', authenticateJWT,getGroupMember )
router.get('/search-group', authenticateJWT, searchGroup)


 
  

  






export default router;