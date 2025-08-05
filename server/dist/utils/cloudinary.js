"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = void 0;
require("dotenv/config");
const cloudinary_1 = require("cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});
const uploadToCloudinary = async (path, folder = "chatplanetassets") => {
    try {
        const data = await cloudinary_1.v2.uploader.upload(path, { folder: folder, resource_type: "auto" });
        return data.secure_url;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
};
exports.uploadToCloudinary = uploadToCloudinary;
