"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogOut = exports.getAuthUser = exports.ResetPassword = exports.ForgotPassword = exports.refreshAccessToken = exports.twoFactorLogin = exports.Login = exports.Register = void 0;
const connectDb_1 = require("../models/connectDb");
const uuid_1 = require("uuid");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../middlewares/jwt/jwt");
const nodemailer_1 = require("../utils/nodemailer");
const speakeasy_1 = __importDefault(require("speakeasy"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const redis_1 = require("../src/config/redis"); // Assuming you're using Redis for MFA sessions
//Signup and save new User to database
const Register = async (req, res) => {
    try {
        const { email, firstname, lastname, password, mobile } = req.body;
        if (!email || !firstname || !lastname || !password || !mobile) {
            return void res.status(400).json({ success: false, message: 'All fields are required' });
        }
        // Check for existing user by email or mobile
        const existingUser = await connectDb_1.pool.query('SELECT email, mobile FROM users WHERE email = $1 OR mobile = $2', [email, mobile]);
        if (existingUser.rows.length > 0) {
            const user = existingUser.rows[0];
            const conflictField = user.email === email ? 'email' : 'mobile';
            return void res.status(409).json({ success: false, message: `User with this ${conflictField} already exists` });
        }
        const salt = await bcrypt_1.default.genSalt();
        const hashedPassword = await bcrypt_1.default.hash(password, salt);
        const sqlInsert = `
      INSERT INTO users (id, firstname, lastname, email, mobile, password) 
      VALUES ($1, $2, $3, $4, $5, $6)
    ING id
    `;
        const values = [(0, uuid_1.v4)(), firstname, lastname, email, mobile, hashedPassword];
        const result = await connectDb_1.pool.query(sqlInsert, values);
        return void res.status(201).json({
            success: true,
            message: 'User registered successfully!',
            userId: result.rows[0].id,
        });
    }
    catch (err) {
        console.error('Registration error:', err);
        if (err.code === '23505') {
            res.status(409).json({
                success: false,
                message: 'User with this email or mobile already exists',
            });
        }
        return void res.status(500).json({
            success: false,
            message: 'Internal server error',
        });
    }
};
exports.Register = Register;
// email password authentication
const mfaSessions = {};
const Login = async (req, res) => {
    const { email, password } = req.body;
    const redis = (0, redis_1.getRedisClient)();
    if (!email || !password) {
        return void res.status(400).json({ success: false, message: 'Email and password are required' });
    }
    try {
        const result = await connectDb_1.pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rowCount === 0) {
            return void res.status(401).json({ success: false, message: 'User not found' });
        }
        const user = result.rows[0];
        const isMatch = await bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return void res.status(403).json({ success: false, message: 'Incorrect email or password' });
        }
        // Generate MFA secret and OTP
        const secret = speakeasy_1.default.generateSecret({ name: 'ChatPlanet' });
        const mfaCode = speakeasy_1.default.totp({ secret: secret.base32, encoding: 'base32' });
        // Store MFA secret in Redis with sessionId
        const sessionId = (0, uuid_1.v4)();
        await redis.setEx(`mfa:${sessionId}`, 900, JSON.stringify({
            userId: user.id,
            email: user.email,
            firstname: user.firstname,
            lastname: user.lastname,
            secret: secret.base32
        })); // Expires in 15 mins
        // Send MFA code via email
        await nodemailer_1.contactEmail.sendMail({
            from: `ChatPlanet 👻 <${process.env.Email}>`,
            to: user.email,
            subject: '2FA CODE',
            html: `
        <p>Your one-time MFA code:</p>
        <h2>${mfaCode}</h2>
        <p>This code expires in 15 minutes.</p>
      `
        });
        console.log(`This is cookie ${sessionId} `);
        // Set sessionId as HTTP-only cookie
        res.cookie('sessionId', sessionId, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 15 * 60 * 1000
        });
        return void res.json({ success: true, message: 'MFA code sent to your email' });
    }
    catch (err) {
        console.error('Login error:', err);
        return void res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.Login = Login;
//Multifactor authentication
const twoFactorLogin = async (req, res) => {
    var _a;
    const { mfacode } = req.body;
    const sessionId = req.cookies.sessionId || ((_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1]);
    console.log(sessionId);
    const redis = (0, redis_1.getRedisClient)();
    if (!sessionId) {
        return void res.status(400).json({ success: false, message: 'Session expired or invalid' });
    }
    if (!mfacode) {
        return void res.status(400).json({ success: false, message: 'MFA code is required' });
    }
    try {
        const sessionData = await redis.get(`mfa:${sessionId}`);
        if (!sessionData) {
            return void res.status(400).json({ success: false, message: 'MFA session expired' });
        }
        const userData = JSON.parse(sessionData);
        console.log(userData);
        // Verify MFA code
        const verified = speakeasy_1.default.totp.verify({
            secret: userData.secret,
            encoding: 'base32',
            token: mfacode,
            window: 1
        });
        if (!verified) {
            return void res.status(401).json({ success: false, message: 'Invalid MFA code' });
        }
        // Remove MFA session
        await redis.del(`mfa:${sessionId}`);
        // Clear session cookie
        res.clearCookie('sessionId', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none'
        });
        const userPayload = {
            id: userData.userId,
            email: userData.email,
            firstname: userData.firstname,
            lastname: userData.lastname
        };
        // Generate JWT
        const accessToken = (0, jwt_1.createAccessToken)(userPayload);
        const refreshToken = (0, jwt_1.createRefreshToken)(userPayload);
        // Set JWT as cookie 
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 24 * 60 * 60 * 1000
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'none',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        delete userData.secret; // remove sensitive info
        return void res.status(200).json({ success: true, message: 'Login successful', user: userData });
    }
    catch (err) {
        console.error('MFA verify error:', err);
        return void res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
exports.twoFactorLogin = twoFactorLogin;
const refreshAccessToken = async (req, res) => {
    const redis = (0, redis_1.getRedisClient)();
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
        return void res.status(401).json({ success: false, message: 'No refresh token provided' });
    try {
        const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
        if (decoded) {
            // Check if token matches stored one in Redis
            const storedToken = await redis.get(`refresh:${decoded === null || decoded === void 0 ? void 0 : decoded.id}`);
            if (storedToken !== refreshToken) {
                return void res.status(403).json({ success: false, message: 'Invalid refresh token' });
            }
            const userPayload = {
                id: decoded.id,
                email: decoded.email,
                firstname: decoded.firstname,
                lastname: decoded.lastname
            };
            const newAccessToken = (0, jwt_1.createAccessToken)(userPayload);
            res.cookie('accessToken', newAccessToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'none',
                maxAge: 15 * 60 * 1000,
            });
            return void res.json({ success: true, message: 'Token refreshed' });
        }
    }
    catch (err) {
        return void res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }
};
exports.refreshAccessToken = refreshAccessToken;
// Forgot password
const ForgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const sqlSearch = "SELECT * FROM users WHERE email = ?";
        const values = [email];
        connectDb_1.pool.query(sqlSearch, values, async (err, result) => {
            if (err) {
                console.error("SQL Search Error:", err);
                res.status(500).json({ success: false, message: "Server error. Try again later." });
            }
            if ((result === null || result === void 0 ? void 0 : result.length) === 0) {
                res.status(404).json({ success: false, message: "No user found with this email." });
            }
            const user = result[0];
            const token = (0, jwt_1.forgotPasswordToken)(user.id); // Generate a secure token
            const sqlUpdate = "UPDATE users SET resettoken=? WHERE id=?";
            connectDb_1.pool.query(sqlUpdate, [token, user.id], async (err, updateResult) => {
                if (err) {
                    console.error("Token Update Error:", err);
                    res.status(500).json({ success: false, message: "Failed to set reset token." });
                }
                // Send the reset email
                try {
                    await nodemailer_1.contactEmail.sendMail({
                        from: '"SoundPlanet 👻" <adeyemiemma45@gmail.com>',
                        to: email,
                        subject: "Reset Your Password",
                        html: `
              <p>Hello ${user.firstname},</p>
              <p>We received a any to reset your password. Click the link below to reset it:</p>
              <a href="${process.env.FRONTEND_URL}/resetpassword/${token}">Reset Password</a>
              <p>If you didn’t any this, please ignore this email.</p>
            `,
                    });
                    res.status(200).json({ success: true, message: "A password reset link has been sent to your email." });
                }
                catch (emailErr) {
                    console.error("Email Send Error:", emailErr);
                    res.status(500).json({ success: false, message: "Failed to send reset email." });
                }
            });
        });
    }
    catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
exports.ForgotPassword = ForgotPassword;
// reset password
const ResetPassword = async (req, res) => {
    const { password } = req.body;
    const { token } = req.params;
    if (!token) {
        res.status(400).json({ success: false, message: "Token is required" });
    }
    try {
        // Verify JWT token
        jsonwebtoken_1.default.verify(token, process.env.FORGOT_PASSWORD, async (err, decoded) => {
            if (err) {
                res.status(401).json({ success: false, message: "Invalid or expired token!" });
            }
            // Find user by token
            const sqlSearch = "SELECT * FROM users WHERE resettoken = ?";
            connectDb_1.pool.query(sqlSearch, [token], async (err, result) => {
                if (err) {
                    console.error("SQL Search Error:", err);
                    res.status(500).json({ success: false, message: "Server error." });
                }
                if (result.length === 0) {
                    res.status(404).json({ success: false, message: "Token not found or already used." });
                }
                // Hash the new password
                const salt = await bcrypt_1.default.genSalt(10);
                const hashedPassword = await bcrypt_1.default.hash(password, salt);
                // Update password and clear the token
                const sqlUpdate = "UPDATE users SET password = ?, resettoken = NULL WHERE resettoken = ?";
                connectDb_1.pool.query(sqlUpdate, [hashedPassword, token], (err, updateResult) => {
                    if (err) {
                        console.error("Password Update Error:", err);
                        res.status(500).json({ success: false, message: "Failed to update password." });
                    }
                    res.status(200).json({ success: true, message: "Password has been reset successfully." });
                });
            });
        });
    }
    catch (error) {
        console.error("Unexpected Error:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
exports.ResetPassword = ResetPassword;
//Retrieve authenticated User
const getAuthUser = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ success: false, message: "No user found" });
        return;
    }
    console.log(`Authenticated user: ${req.user.firstname}`);
    res.status(200).json({
        success: true,
        message: `Welcome ${req.user.firstname}`,
        user: req.user,
    });
};
exports.getAuthUser = getAuthUser;
const LogOut = async (req, res) => {
    const redis = (0, redis_1.getRedisClient)();
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
        try {
            const decoded = (0, jwt_1.verifyRefreshToken)(refreshToken);
            await redis.del(`refresh:${decoded === null || decoded === void 0 ? void 0 : decoded.id}`);
        }
        catch (_a) { }
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.json({ success: true, message: 'Logged out successfully' });
};
exports.LogOut = LogOut;
