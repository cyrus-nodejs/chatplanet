import express from 'express';
import {
  addContact,  getContact, searchContacts
 } from "../controllers/Contact";

 import { authorizeJWT } from '../middlewares/jwt/jwt';
const router = express.Router();





 
router.post('/addcontact', authorizeJWT,  addContact )
router.get('/getcontacts', authorizeJWT,   getContact )
router.get('/search-contact', authorizeJWT,   searchContacts )

 
  

  






export default router;