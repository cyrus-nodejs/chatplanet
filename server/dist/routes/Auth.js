"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Auth_1 = require("../controllers/Auth");
const jwt_1 = require("../middlewares/jwt/jwt");
router.get('/user', jwt_1.authorizeJWT, Auth_1.getAuthUser);
router.get('/logout', jwt_1.authorizeJWT, Auth_1.LogOut);
router.post("/register", Auth_1.Register);
router.post("/login", Auth_1.Login);
router.post("/login/2fa", Auth_1.twoFactorLogin);
router.post('/forgotpassword', Auth_1.ForgotPassword);
router.post('/resetpassword/:token', Auth_1.ResetPassword);
router.post("/refresh-token", Auth_1.refreshAccessToken);
exports.default = router;
