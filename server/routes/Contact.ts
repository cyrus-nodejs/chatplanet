import express from 'express';
import {
  addContact,  getContact, searchContacts
 } from "../controllers/Contact";

 import { authenticateJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/addcontact', authenticateJWT,  addContact )
router.get('/getcontacts', authenticateJWT,   getContact )
router.get('/search-contact', authenticateJWT,   searchContacts )

 
  

  






export default router;