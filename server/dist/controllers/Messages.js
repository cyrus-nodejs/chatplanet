"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecentChat = exports.addRecentChat = void 0;
const connectDb_1 = require("../models/connectDb");
const addRecentChat = async (req, res) => {
    var _a;
    const { receiver_id } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userid) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    if (!receiver_id) {
        res.status(400).json({ success: false, message: "receiver_id is required" });
        return;
    }
    const sqlInsert = `
    INSERT INTO recentchat (receiver_id, user_id, last_updated)
    VALUES ($1, $2, NOW())
    ON CONFLICT (receiver_id, user_id) DO UPDATE
    SET last_updated = EXCLUDED.last_updated
    RETURNING *
  `;
    try {
        const result = await connectDb_1.pool.query(sqlInsert, [receiver_id, userid]);
        // console.log("recentchat upserted:", result.rows[0]);
        res.json({ success: true, message: "recentchat added or updated", data: result.rows[0] });
    }
    catch (err) {
        console.error("Error adding/updating recentchat:", err.stack);
        res.status(500).json({ success: false, message: "Cannot add or update recentchat!" });
        return;
    }
};
exports.addRecentChat = addRecentChat;
// API to get group chat history between users
const getRecentChat = async (req, res) => {
    var _a;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userid) {
        res.status(401).json({ success: false, message: 'Unauthorized: No user ID' });
        return;
    }
    try {
        const results = await connectDb_1.pool.query(
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
  WHERE rc.user_id = $1  AND rc.receiver_id != $1
  ORDER BY rc.user_id, rc.receiver_id, rc.last_updated DESC;
      `, [userid]);
        res.json({ success: true, message: 'success', recentchat: results.rows });
        return;
    }
    catch (err) {
        console.error('Database query error:', err);
        res.status(500).json({ success: false, message: 'Failed to fetch data!' });
        return;
    }
};
exports.getRecentChat = getRecentChat;
