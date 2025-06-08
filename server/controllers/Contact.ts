import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';

//Create User contact list
export const addContact = async (req: any, res: any) => {
  const { email } = req.body;

  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find user by email
    const sqlSearch = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    pool.query(sqlSearch, values, (err, result: any) => {
      if (err) {
        console.error("Search user error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
      }

      if (result.rows.length === 0) {
        return res.status(404).json({ success: false, message: "User with that email not found" });
      }

      const contactUser = result.rows[0];

      //Check if contact already exists for this user
      const sqlCheck = "SELECT * FROM contacts WHERE id = $1 AND email = $2";
      pool.query(sqlCheck, [req.user.id, contactUser.email], (err, checkResult: any) => {
        if (err) {
          console.error("Check contact error:", err);
          return res.status(500).json({ success: false, message: "Server error" });
        }

        if (checkResult.rows.length > 0) {
          return res.status(409).json({ success: false, message: "Contact already exists" });
        }

        // Insert contact (assuming id is auto-generated)
        const sqlInsert = `INSERT INTO contacts (id, userid, firstname, lastname, email, mobile) 
                           VALUES ($1, $2, $3, $4, $5,$6)`;
        const insertValues = [
          req.user.id,
          contactUser.id,
          contactUser.firstname,
          contactUser.lastname,
          contactUser.email,
          contactUser.mobile,
        ];

        pool.query(sqlInsert, insertValues, (err, insertResult: any) => {
          if (err) {
            console.error("Insert contact error:", err);
            return res.status(500).json({ success: false, message: "Failed to add contact" });
          }

          return res.status(201).json({ success: true, message: "Contact added successfully" });
        });
      });
    });
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

  const sqlSearch = "SELECT * FROM contacts WHERE id = $1";
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
