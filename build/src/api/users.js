"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controllers/users");
// 라우터
const router = express_1.default.Router();
router.get('/', users_1.getAllUsers);
router.get('/:id', (req, res) => {
    (0, users_1.getUserInfo)(req, res);
});
module.exports = router;
