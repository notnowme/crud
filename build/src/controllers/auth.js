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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLogout = exports.authLogin = exports.authWithdraw = exports.authJoin = exports.checkNick = exports.checkId = void 0;
const db_1 = require("../lib/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../lib/jwt");
/**
 * 아이디 중복 확인
 */
const checkId = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        if (!id)
            return res.json({ ok: false, message: 'ID missing' }).status(400);
        const result = yield db_1.db.user.findFirst({
            where: {
                id
            }
        });
        if (result) {
            return res.json({ ok: false, message: 'ID exists!' }).status(409);
        }
        return next();
    }
    catch (err) {
        console.error(`checkId`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.checkId = checkId;
/**
 * 닉네임 중복 확인
 */
const checkNick = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { nick } = req.body;
        if (!nick)
            return res.json({ ok: false, message: 'NICK missing' }).status(400);
        const result = yield db_1.db.user.findFirst({
            where: {
                nick
            }
        });
        if (result)
            return res.json({ ok: false, message: 'NICK exists!' }).status(409);
        return next();
    }
    catch (err) {
        console.error(`checkNick`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.checkNick = checkNick;
/**
 * 회원 가입
 */
const authJoin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, nick, password } = req.body;
        if (!password)
            return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);
        const saltRounds = 10;
        const salt = yield bcrypt_1.default.genSalt(saltRounds);
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        yield db_1.db.user.create({
            data: {
                id,
                nick,
                password: hashedPassword
            }
        });
        return res.json({ ok: true }).status(201);
    }
    catch (err) {
        console.error(`[POST] /api/auth/local/join]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authJoin = authJoin;
/**
 * 회원 탈퇴
 */
const authWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization: token } = req.headers;
        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입
        const verifiedToken = (0, jwt_1.verifyToken)(token);
        const { id } = verifiedToken;
        const user = yield db_1.db.user.findFirst({
            where: {
                id
            }
        });
        if (!user)
            return res.json({ ok: false, message: 'Cannot find User' }).status(404);
        yield db_1.db.user.delete({
            where: {
                id
            }
        });
        return res.json({ ok: true }).status(200);
    }
    catch (err) {
        console.error(`[POST] /api/local/withdraw`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authWithdraw = authWithdraw;
/**
 * 로그인
 */
const authLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password } = req.body;
        if (!id)
            return res.json({ ok: false, message: 'ID missing' }).status(400);
        if (!password)
            return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);
        const user = yield db_1.db.user.findFirst({
            where: {
                id
            }
        });
        if (!user)
            return res.json({ ok: false, message: `Cannot find User` }).status(404);
        // 비밀번호 일치 확인
        const check = yield bcrypt_1.default.compare(password, user.password);
        if (!check) {
            return res.json({ ok: false, message: 'Wrong Password' }).status(200);
        }
        let result = {
            no: user.no,
            id: user.id,
            nick: user.nick,
        };
        const token = (0, jwt_1.signJwtAccessToken)(result);
        // 유저 정보로 토큰 생성 후, 추가
        result = Object.assign(Object.assign({}, result), { token });
        return res.json({ ok: true, data: result }).status(200);
    }
    catch (err) {
        console.error(`[POST] /api/auth/login`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authLogin = authLogin;
/**
 * 로그아웃
 */
const authLogout = (req, res) => {
    // jwt를 블랙리스트에 등록.
    // 로그아웃 처리 추가...
    return res.json({ ok: true }).status(200);
};
exports.authLogout = authLogout;
