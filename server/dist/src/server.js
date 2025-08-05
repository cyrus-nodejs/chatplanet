"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const Auth_1 = __importDefault(require("../routes/Auth"));
const Messages_1 = __importDefault(require("../routes/Messages"));
const User_1 = __importDefault(require("../routes/User"));
const Contact_1 = __importDefault(require("../routes/Contact"));
const Groups_1 = __importDefault(require("../routes/Groups"));
const http_1 = require("http");
const cors_1 = __importDefault(require("cors"));
const jwt_1 = require("../middlewares/jwt/jwt");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
// import redisClient from './config/redis'
dotenv_1.default.config();
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
// Middleware
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json({ limit: "100mb" }));
app.use(body_parser_1.default.urlencoded({ limit: "100mb", extended: true }));
// // ✅ Ensure Redis is connected before starting the server
// redisClient.on('connect', () => {
//   console.log('✅ Redis is connected');
// });
// redisClient.on('error', (err) => {
//   console.error('❌ Redis error:', err);
// });
node_cron_1.default.schedule('*/1440 * * * *', async () => {
    try {
        const url = process.env.SERVER_URL;
        await axios_1.default.get(url);
        console.log('Ping sent to:', url);
    }
    catch (err) {
        console.error('Ping failed', err);
    }
});
// Cors configuration for server  Local host & web hosting services
exports.corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true,
    optionSuccessStatus: 200,
    methods: ['GET', 'PUT', 'POST', 'DELETE']
};
// Apply CORS middleware
app.use((0, cors_1.default)(exports.corsOptions));
app.set('trust proxy', 1);
app.get("/", jwt_1.authorizeJWT, async (req, res) => {
    res.send(`Express + TypeScript Server ${req.user.firstname} `);
});
app.use("/", Auth_1.default);
app.use("/", Messages_1.default);
app.use("/", User_1.default);
app.use("/", Contact_1.default);
app.use("/", Groups_1.default);
exports.default = httpServer;
