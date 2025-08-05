"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Messages_1 = require("../controllers/Messages");
const jwt_1 = require("../middlewares/jwt/jwt");
const router = express_1.default.Router();
router.get('/get/recentchat', jwt_1.authorizeJWT, Messages_1.getRecentChat);
router.post("/add/recentchat", jwt_1.authorizeJWT, Messages_1.addRecentChat);
exports.default = router;
