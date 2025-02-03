import express from 'express';
import { getPrivateMessages, getGroupMessages} from '../controllers/Messages';
import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();




router.get('/private/messages/:sender_id/:receiver_id', authenticateJWT, getPrivateMessages )
 router.get('/group/messages/:group_id', authenticateJWT, getGroupMessages )
// router.post ("/send/privatemessage", authenticateJWT, postPrivateMessages )


 
export default router;
  