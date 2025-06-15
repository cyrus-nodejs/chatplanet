import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express'



//Create User contact list
export const addContact = async (req: Request, res: Response) => {
 const { email } = req.body;

  if (!req.user) {
   res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (req.user?.email === email) {
     res.status(400).json({ success: false, message: "You cannot add yourself as a contact" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
       res.status(404).json({ success: false, message: "User with that email not found" });
    }

    const contactUser = userResult.rows[0];
    console.log("Contact user ID:", contactUser.id);

    const checkResult = await pool.query(
      "SELECT * FROM contacts WHERE userid = $1 AND contactid = $2",
      [req.user?.id, contactUser.id]
    );

    if (checkResult.rows.length > 0) {
       res.status(409).json({ success: false, message: "Contact already exists" });
    }

    await pool.query(
      `
      INSERT INTO contacts (id, userid, contactid, timestamp)
      VALUES ($1, $2, $3, NOW())
    `,
      [uuidv4(), req.user?.id, contactUser.id]
    );

     res.status(201).json({
      success: true,
      message: "Contact added successfully",
      contact: {
        id: contactUser.id,
        email: contactUser.email,
        name: contactUser.firstname, // optional
      }
    });
      return;
  } catch (error) {
    console.error("Unexpected error:", error);
     res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Retrieve User contactlist
export const getContact = async (req:Request , res:Response) => {
  const userId = req.user?.id;

  if (!userId) {
     res.status(401).json({ success: false, message: "No user found!" });
  }

  try{
  console.log("Getting contacts for user:", userId);

  const sqlSearch = `
SELECT 
    u.id AS userid,
    u.firstname,
    u.lastname,
    u.mobile,
    u.profile_image,
     u.about,
     u.last_seen,
     u.country,
     c.contactid,
    c.timestamp,
    c.userid
FROM contacts c
JOIN users u ON c.contactid = u.id
WHERE c.userid = $1;
  `;
  const values = [userId];

  pool.query(sqlSearch, values, (err, result: any) => {
    if (err) {
      console.error("Error fetching contacts:", err);
      return res.status(500).json({ success: false, message: "Error retrieving contacts." });
    }

    // console.log("Contacts retrieved successfully");
    return res.status(200).json({ success: true, message: "Contacts retrieved", contacts: result.rows });
  });
  }catch(err){
    
  }

};


export const searchContacts = async (req: Request, res: Response) => {
    const { q } = req.query;
  try {
    const result = await pool.query(
      `SELECT 
       u.id AS userid,
    u.firstname,
    u.lastname,
    u.mobile,
    u.profile_image,
     u.about,
     u.last_seen,
     u.country,
     c.contactid,
    c.timestamp,
    c.userid
FROM contacts c
JOIN users u ON c.contactid = u.id
       WHERE email ILIKE $1 OR mobIle ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1 `,
      [`%${q}%`]
    );
    res.json({ success: true, searchresults:result.rows});
  } catch (err:any) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

}