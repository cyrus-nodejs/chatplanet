
import nodemailer from "nodemailer";


require ('dotenv').config();


export const contactEmail = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  },
});



