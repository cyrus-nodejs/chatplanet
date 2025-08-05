import express from 'express';
import { getRecentChat, addRecentChat} from '../controllers/Messages';
import { authorizeJWT } from '../middlewares/jwt/jwt';
const router = express.Router();



 router.get('/get/recentchat', authorizeJWT, getRecentChat )
 router.post ("/add/recentchat", authorizeJWT, addRecentChat )

 

 
export default router;
  