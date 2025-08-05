"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyForgotPassword = exports.changePasswordToken = exports.authorizeJWT = exports.verifyRefreshToken = exports.verifyAccessToken = exports.createRefreshToken = exports.createAccessToken = exports.forgotPasswordToken = exports.create2FAtoken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
//Create JWT for Two factor Authentication
const create2FAtoken = (data) => {
    return jsonwebtoken_1.default.sign(data, process.env.TWOFACODE_TOKEN, {
        expiresIn: process.env.TWOFACODE_EXPIRATION,
    });
};
exports.create2FAtoken = create2FAtoken;
// Create Forgot Password JWT 
const forgotPasswordToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.FORGOT_PASSWORD_TOKEN, {
        expiresIn: '35m',
    });
};
exports.forgotPasswordToken = forgotPasswordToken;
const createAccessToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.ACCESSTOKEN, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION || '15m', // Short-lived token
    });
};
exports.createAccessToken = createAccessToken;
const createRefreshToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, process.env.REFRESHTOKEN, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d', // Long-lived token
    });
};
exports.createRefreshToken = createRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKEN);
    }
    catch (error) {
        return null;
    }
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, process.env.REFRESHTOKEN);
    }
    catch (error) {
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const authorizeJWT = (req, res, next) => {
    var _a;
    const token = req.cookies.accessToken || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    console.log(token);
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.ACCESSTOKEN);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(403).json({ success: false, message: 'Invalid or expired token' });
    }
};
exports.authorizeJWT = authorizeJWT;
// Create Change Password JWT 
const changePasswordToken = (id) => {
    return jsonwebtoken_1.default.sign({ id }, process.env.CHANGE_PASSSWORD_TOKEN, {
        expiresIn: '5m',
    });
};
exports.changePasswordToken = changePasswordToken;
const verifyForgotPassword = (req, res, next) => {
    const forgotPasswordtoken = req.cookies.token;
    //    console.log(`verifytoken => ${token}`)
    if (!forgotPasswordtoken) {
        return res.json({ success: false, message: "Not Authorized! Token does not exist" });
    }
    jsonwebtoken_1.default.verify(forgotPasswordtoken, process.env.FORGOT_PASSWORD_TOKEN, async (err, data) => {
        if (err) {
            return res.json({ success: false, message: `Cannot verify token + ${err}` });
        }
        else {
            const user = req.user;
            if (user)
                return res.json({ success: true, message: `Welcome ${user.username}`, user: user.username });
            else
                return res.json({ success: false, message: "Not Authorized!" });
        }
    });
    next();
};
exports.verifyForgotPassword = verifyForgotPassword;
