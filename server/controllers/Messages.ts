import { pool } from '../models/connectDb'
import { Request, Response, NextFunction } from 'express'
import mysql from 'mysql2';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../utils/cloudinary';



export const addRecentChat = async (req:any, res:any) => {
const { receiver_id } = req.body;
  const userid = req.user?.id;

  if (!userid) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  if (!receiver_id) {
    return res.status(400).json({ success: false, message: "receiver_id is required" });
  }

  const sqlInsert = `
    INSERT INTO recentchat (receiver_id, user_id, last_updated)
    VALUES ($1, $2, NOW())
    ON CONFLICT (receiver_id, user_id) DO UPDATE
    SET last_updated = EXCLUDED.last_updated
    RETURNING *
  `;

  try {
    const result = await pool.query(sqlInsert, [receiver_id, userid]);

    console.log("recentchat upserted:", result.rows[0]);
    res.json({ success: true, message: "recentchat added or updated", data: result.rows[0] });
  } catch (err: any) {
    console.error("Error adding/updating recentchat:", err.stack);
    res.status(500).json({ success: false, message: "Cannot add or update recentchat!" });
  }

        }

    
// API to get group chat history between users
export const getRecentChat = async (req: any, res: any) => {
  const userid = req.user?.id;

  if (!userid) {
    return res.status(401).json({ success: false, message: 'Unauthorized: No user ID' });
  }

  try {
    const results = await pool.query(
      // 'SELECT * FROM recentchat WHERE user_id = $1 ORDER BY last_updated ASC',
       `
      SELECT DISTINCT ON (rc.user_id, rc.receiver_id)
    rc.receiver_id,
    rc.user_id,
    rc.last_updated,
    u.firstname AS receiver_firstname,
    u.lastname AS receiver_lastname,
    u.about AS receiver_about,
    u.profile_image AS receiver_avatar,
    m.message AS latest_message,
    m.type AS latest_message_type,
    m.media AS latest_message_media,
    m.status AS latest_message_status,
    m.timestamp AS latest_message_time
  FROM recentchat rc
  JOIN users u ON u.id = rc.receiver_id
  LEFT JOIN LATERAL (
    SELECT message, type, media, status, timestamp
    FROM private_messages
    WHERE 
      (sender_id = rc.user_id AND receiver_id = rc.receiver_id)
      OR 
      (sender_id = rc.receiver_id AND receiver_id = rc.user_id)
    ORDER BY timestamp DESC
    LIMIT 1
  ) m ON TRUE
  WHERE rc.user_id = $1
  ORDER BY rc.user_id, rc.receiver_id, rc.last_updated DESC;
      `,
      [userid]
    );


    res.json({ success: true, message: 'success', recentchat: results.rows });
  } catch (err) {
    console.error('Database query error:', err);
    res.status(500).json({ success: false, message: 'Failed to fetch data!' });
  }
}

