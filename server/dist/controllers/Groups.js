"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchGroup = exports.getGroupMember = exports.getGroups = exports.addGroupMember = exports.createGroup = void 0;
const connectDb_1 = require("../models/connectDb");
const uuid_1 = require("uuid");
const cloudinary_1 = require("../utils/cloudinary");
// Create Group by User
const createGroup = async (req, res) => {
    var _a;
    const { name, description } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!req.files || Array.isArray(req.files)) {
        res.status(400).json({ success: false, message: "No image file uploaded" });
        return;
    }
    if (!req.files['image'] || !req.files['image'][0]) {
        res.status(400).json({ success: false, message: "No image file uploaded" });
        return;
    }
    try {
        const imagePath = req.files['image'][0].path;
        const uploadResult = await (0, cloudinary_1.uploadToCloudinary)(imagePath, 'chatplanetassets');
        const groupId = (0, uuid_1.v4)();
        const imageUrl = uploadResult.secure_url;
        const sql = `
      INSERT INTO groupchat (id, name, description, createdBy, group_image)
      VALUES ($1, $2, $3, $4, $5)
    `;
        const values = [groupId, name, description, userid, imageUrl];
        await connectDb_1.pool.query(sql, values);
        res.status(201).json({
            success: true,
            message: "Group created successfully",
            group: {
                id: groupId,
                name,
                description,
                createdBy: userid,
                group_image: imageUrl
            }
        });
    }
    catch (err) {
        console.error("Error creating group:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.createGroup = createGroup;
const addGroupMember = async (req, res) => {
    const { group_id, user_id } = req.body;
    console.log(`addgroup member ${req.body}`);
    try {
        const result = await connectDb_1.pool.query(`
      INSERT INTO group_member (user_id, group_id)
      VALUES ($1, $2)
      `, [user_id, group_id]);
        if (result.rowCount === 0) {
            res.status(200).json({ message: 'User is already in the group.' });
            return;
        }
        else {
            res.status(201).json({ message: 'User added to group.' });
            return;
        }
    }
    catch (error) {
        console.error('Error inserting group member:', error);
        res.status(500).json({ error: 'Internal server error' });
        return;
    }
};
exports.addGroupMember = addGroupMember;
// Retrieve group
const getGroups = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
        return;
    }
    console.log("Fetching groups for user:", userId);
    const sqlQuery = `SELECT * FROM groupchat`; // assuming user_id column exists
    try {
        const result = await connectDb_1.pool.query(sqlQuery);
        console.log("Groups retrieved:", result.rows);
        res.status(200).json({
            success: true,
            message: "Groups retrieved successfully",
            groups: result.rows,
        });
        return;
    }
    catch (err) {
        console.error("Error retrieving groups:", err);
        res.status(500).json({
            success: false,
            message: "Error retrieving groups",
        });
        return;
    }
};
exports.getGroups = getGroups;
const getGroupMember = async (req, res) => {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId) {
        res.status(401).json({
            success: false,
            message: 'Unauthorized: No user ID provided',
        });
        return;
    }
    console.log("Fetching group members for user:", userId);
    const sqlQuery = `SELECT * FROM group_member WHERE user_id = $1`;
    const values = [userId];
    try {
        const result = await connectDb_1.pool.query(sqlQuery, values);
        console.log("Group members retrieved:", result.rows);
        res.status(200).json({
            success: true,
            message: "Group members fetched successfully!",
            groupmembers: result.rows,
        });
        return;
    }
    catch (err) {
        console.error("Error fetching group members:", err);
        res.status(500).json({
            success: false,
            message: "Error fetching group members",
        });
        return;
    }
};
exports.getGroupMember = getGroupMember;
const searchGroup = async (req, res) => {
    const { q } = req.query;
    try {
        const result = await connectDb_1.pool.query(`SELECT  * FROM groupchat
       WHERE name ILIKE $1 `, [`%${q}%`]);
        res.json({ success: true, searchresults: result.rows });
        return;
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
        return;
    }
};
exports.searchGroup = searchGroup;
