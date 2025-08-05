"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchContacts = exports.getContact = exports.addContact = void 0;
const connectDb_1 = require("../models/connectDb");
const uuid_1 = require("uuid");
//Create User contact list
const addContact = async (req, res) => {
    var _a, _b, _c;
    const { email } = req.body;
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.email) === email) {
        res.status(400).json({ success: false, message: "You cannot add yourself as a contact" });
    }
    try {
        const userResult = await connectDb_1.pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userResult.rows.length === 0) {
            res.status(404).json({ success: false, message: "User with that email not found" });
        }
        const contactUser = userResult.rows[0];
        console.log("Contact user ID:", contactUser.id);
        const checkResult = await connectDb_1.pool.query("SELECT * FROM contacts WHERE userid = $1 AND contactid = $2", [(_b = req.user) === null || _b === void 0 ? void 0 : _b.id, contactUser.id]);
        if (checkResult.rows.length > 0) {
            res.status(409).json({ success: false, message: "Contact already exists" });
        }
        await connectDb_1.pool.query(`
      INSERT INTO contacts (id, userid, contactid, timestamp)
      VALUES ($1, $2, $3, NOW())
    `, [(0, uuid_1.v4)(), (_c = req.user) === null || _c === void 0 ? void 0 : _c.id, contactUser.id]);
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
    }
    catch (error) {
        console.error("Unexpected error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.addContact = addContact;
//Retrieve User contactlist
const getContact = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({ success: false, message: "No user found!" });
    }
    try {
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
        connectDb_1.pool.query(sqlSearch, values, (err, result) => {
            if (err) {
                console.error("Error fetching contacts:", err);
                return res.status(500).json({ success: false, message: "Error retrieving contacts." });
            }
            // console.log("Contacts retrieved successfully");
            return res.status(200).json({ success: true, message: "Contacts retrieved", contacts: result.rows });
        });
    }
    catch (err) {
    }
};
exports.getContact = getContact;
const searchContacts = async (req, res) => {
    const { q } = req.query;
    try {
        const result = await connectDb_1.pool.query(`SELECT 
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
       WHERE email ILIKE $1 OR mobIle ILIKE $1 OR firstname ILIKE $1 OR lastname ILIKE $1 `, [`%${q}%`]);
        res.json({ success: true, searchresults: result.rows });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};
exports.searchContacts = searchContacts;
