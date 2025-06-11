import express from 'express';
import { getRecentChat, addRecentChat} from '../controllers/Messages';
import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();



 router.get('/get/recentchat', authenticateJWT, getRecentChat )
 router.post ("/add/recentchat", authenticateJWT, addRecentChat )

 

 
export default router;
  