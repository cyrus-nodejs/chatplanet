import express from 'express';
import {
createGroup,addGroupMember,  getGroups, getGroupMember
 } from "../controllers/Groups";

 import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/creategroup', authenticateJWT,  createGroup )

router.post('/add/groupmembers', authenticateJWT,   addGroupMember )
router.get('/getgroups', authenticateJWT,   getGroups )
router.get('/getgroupmembers/:group_id', authenticateJWT,getGroupMember )


 
  

  






export default router;