import express from 'express';
import { getPrivateMessages, getGroupMessages, getRecentChat, addRecentChat} from '../controllers/Messages';
import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();




router.get('/private/messages/:sender_id/:receiver_id', authenticateJWT, getPrivateMessages )
 router.get('/group/messages/:group_id', authenticateJWT, getGroupMessages )
 router.get('/get/recentchat', authenticateJWT, getRecentChat )
 router.post ("/add/recentchat", authenticateJWT, addRecentChat )

 

 
export default router;
  