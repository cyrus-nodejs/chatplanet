"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jwt_1 = require("../middlewares/jwt/jwt");
const router = express_1.default.Router();
const User_1 = require("../controllers/User");
const storage_1 = require("../utils/storage");
router.post("/updateimage", jwt_1.authorizeJWT, storage_1.upload.fields([{ name: 'image', maxCount: 1 }]), User_1.UpdateProfileImage);
router.post("/updatebio", jwt_1.authorizeJWT, User_1.updateAbout);
router.post("/updatelocation", jwt_1.authorizeJWT, User_1.updateLocation);
router.post("/updatemobile", jwt_1.authorizeJWT, User_1.updatePhoneContact);
router.get('/onlineusers', jwt_1.authorizeJWT, User_1.getOnlineUsers);
router.get('/allusers', jwt_1.authorizeJWT, User_1.getAllUsers);
exports.default = router;
