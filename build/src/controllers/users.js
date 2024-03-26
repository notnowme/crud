"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserInfo = exports.getAllUsers = void 0;
const db_1 = require("../lib/db");
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield db_1.db.user.findMany({
            select: {
                no: true,
                id: true,
                nick: true,
                created_at: true,
            }
        });
        return res.json(result).status(200);
    }
    catch (err) {
        console.log(`[/api/users]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.getAllUsers = getAllUsers;
const getUserInfo = (req, res) => {
    console.log(req.params.id);
    res.send('test').status(200);
};
exports.getUserInfo = getUserInfo;
