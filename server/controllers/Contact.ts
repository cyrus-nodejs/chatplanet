import { pool } from '../models/connectDb'
import { v4 as uuidv4 } from 'uuid';
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';

//Create User contact list
export const addContact = async (req: any, res: any) => {
 const { email } = req.body;

  if (!req.user) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "User with that email not found" });
    }

    const contactUser = userResult.rows[0];
console.log('Tis is contactid', contactUser.id)
    const checkResult = await pool.query(
      "SELECT * FROM contacts WHERE userid = $1 AND contactid = $2",
      [req.user.id, contactUser.id]
    );

    if (checkResult.rows.length > 0) {
      return res.status(409).json({ success: false, message: "Contact already exists" });
    }

    await pool.query(
     `
    INSERT INTO contacts (id, userid, contactid, timestamp)
    VALUES ($1, $2, $3, NOW())
  `,
      [
        uuidv4(),
        req.user.id,
        contactUser.id
      ]
    );

    return res.status(201).json({ success: true, message: "Contact added successfully" });
  } catch (error) {
    console.error("Unexpected error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

//Retrieve User contactlist
export const getContact = async (req: any, res: any) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: "No user found!" });
  }

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

    console.log("Contacts retrieved successfully");
    return res.status(200).json({ success: true, message: "Contacts retrieved", contacts: result.rows });
  });
};
