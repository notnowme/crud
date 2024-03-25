"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = __importDefault(require("../controllers/user"));
// 라우터
const router = express_1.default.Router();
router.get('/', (req, res) => {
    user_1.default.root(req, res);
});
router.get('/:id', (req, res) => {
    user_1.default.getUserInfo(req, res);
});
module.exports = router;
