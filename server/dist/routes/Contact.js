"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Contact_1 = require("../controllers/Contact");
const jwt_1 = require("../middlewares/jwt/jwt");
const router = express_1.default.Router();
router.post('/addcontact', jwt_1.authorizeJWT, Contact_1.addContact);
router.get('/getcontacts', jwt_1.authorizeJWT, Contact_1.getContact);
router.get('/search-contact', jwt_1.authorizeJWT, Contact_1.searchContacts);
exports.default = router;
