import express from 'express';
import {
  addContact,  getContact,
 } from "../controllers/Contact";

 import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/addcontact', authenticateJWT,  addContact )
router.get('/getcontacts', authenticateJWT,   getContact )

 
  

  






export default router;