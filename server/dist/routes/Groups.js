"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Groups_1 = require("../controllers/Groups");
const storage_1 = require("../utils/storage");
const jwt_1 = require("../middlewares/jwt/jwt");
const router = express_1.default.Router();
router.post('/creategroup', jwt_1.authorizeJWT, storage_1.upload.fields([{ name: 'image', maxCount: 1 }]), Groups_1.createGroup);
router.post('/add/groupmembers', jwt_1.authorizeJWT, Groups_1.addGroupMember);
router.get('/getgroups', jwt_1.authorizeJWT, Groups_1.getGroups);
router.get('/get/groupmembers', jwt_1.authorizeJWT, Groups_1.getGroupMember);
router.get('/search-group', jwt_1.authorizeJWT, Groups_1.searchGroup);
exports.default = router;
