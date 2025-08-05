"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePhoneContact = exports.updateLocation = exports.updateAbout = exports.UpdateProfileImage = exports.getAllUsers = exports.getOnlineUsers = void 0;
const connectDb_1 = require("../models/connectDb");
const cloudinary_1 = require("../utils/cloudinary");
//Retrieve connected Users
const getOnlineUsers = async (req, res) => {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized: User not identified' });
            return;
        }
        console.log(`userid ${userId}`);
        const sqlSearch = 'SELECT * FROM users WHERE status = $1 AND NOT id = $2';
        const values = ['online', userId];
        const result = await connectDb_1.pool.query(sqlSearch, values);
        if (result.rows.length === 0) {
            res.json({ success: true, message: 'No other users online', users: [] });
            return;
        }
        console.log('onlineUsers found!');
        res.json({ success: true, message: 'Online users found!', users: result.rows });
        return;
    }
    catch (error) {
        console.error('Error retrieving online users:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving online users' });
        return;
    }
};
exports.getOnlineUsers = getOnlineUsers;
const getAllUsers = async (req, res) => {
    try {
        const sqlSearch = 'SELECT * FROM users';
        const result = await connectDb_1.pool.query(sqlSearch);
        if (result.rows.length === 0) {
            res.json({ success: true, message: 'No users found.', users: [] });
            return;
        }
        console.log('All users found!');
        res.json({ success: true, message: 'All users retrieved successfully.', users: result.rows });
        return;
    }
    catch (error) {
        console.error('Error retrieving all users:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving users' });
        return;
    }
};
exports.getAllUsers = getAllUsers;
// Get user profile
const UpdateProfileImage = async (req, res) => {
    var _a;
    try {
        if (!req.files || Array.isArray(req.files)) {
            res.status(400).json({ success: false, message: "No image file uploaded" });
            return;
        }
        if (!req.files['image'] || !req.files['image'][0]) {
            res.status(400).json({ success: false, message: "No image file uploaded" });
            return;
        }
        const imageFilePath = req.files['image'][0].path;
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        let imageData = {};
        if (imageFilePath) {
            imageData = await (0, cloudinary_1.uploadToCloudinary)(imageFilePath, "chatplanetassets");
        }
        const sqlUpdate = `UPDATE users SET profile_image = $1 WHERE id = $2`;
        const values = [JSON.stringify(imageData), userId];
        await connectDb_1.pool.query(sqlUpdate, values);
        console.log('Profile image update successful');
        res.json({ success: true, message: "Profile Image Update successful!" });
        return;
    }
    catch (err) {
        console.error(err);
        res.json({ success: false, message: "Network error!" });
        return;
    }
};
exports.UpdateProfileImage = UpdateProfileImage;
//update user profile
const updateAbout = (req, res) => {
    var _a;
    const { about } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userid) {
        res.json({ success: false, message: "No user found!" });
        return;
    }
    const sqlUpdate = `UPDATE users SET about = $1 WHERE id = $2`;
    const values = [about, userid];
    connectDb_1.pool.query(sqlUpdate, values, (err, result) => {
        if (err) {
            console.error(err);
            res.json({ success: false, message: "Update failed!" });
            return;
        }
        console.log("Update success!");
        res.json({ success: true, message: "Profile update successful!" });
        return;
    });
};
exports.updateAbout = updateAbout;
const updateLocation = (req, res) => {
    var _a;
    const { location } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userid) {
        res.status(401).json({ success: false, message: "No user found!" });
        return;
    }
    const sqlUpdate = `UPDATE users SET country = $1 WHERE id = $2`;
    const values = [location, userid];
    connectDb_1.pool.query(sqlUpdate, values, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            res.status(500).json({ success: false, message: "Update failed!" });
            return;
        }
        console.log('Update success!');
        res.json({ success: true, message: "Country updated successfully!" });
        return;
    });
};
exports.updateLocation = updateLocation;
const updatePhoneContact = (req, res) => {
    var _a;
    const { mobile } = req.body;
    const userid = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userid) {
        res.status(401).json({ success: false, message: "No user found!" });
        return;
    }
    const sqlUpdate = `UPDATE users SET mobile = $1 WHERE id = $2`;
    const values = [mobile, userid];
    connectDb_1.pool.query(sqlUpdate, values, (err, result) => {
        if (err) {
            console.error('Update error:', err);
            res.status(500).json({ success: false, message: "Update failed!" });
            return;
        }
        console.log('Update success!');
        res.json({ success: true, message: "Phone Contact Updated Successfully!" });
        return;
    });
};
exports.updatePhoneContact = updatePhoneContact;
