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
exports.authLogout = exports.authJwtToBlack = exports.authLogin = exports.authWithdraw = exports.authToken = exports.authJoin = exports.checkNick = exports.checkId = void 0;
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
        console.error(`[/api/auth/local/users/id]`, err);
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
        if (result) {
            return res.json({ ok: false, message: 'NICK exists!' }).status(409);
        }
        return next();
    }
    catch (err) {
        console.error(`[/api/auth/local/users/nick]`, err);
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
        return res.json({ ok: true }).status(200);
    }
    catch (err) {
        console.error(`[/api/auth/local/join]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authJoin = authJoin;
/**
 * 토큰 확인
 */
const authToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization: token } = req.headers;
        // 헤더에 토큰이 없으면 인증이 안 된 접근
        if (!token)
            return res.json({ ok: false, message: 'Unauthorized' }).status(401);
        const verifiedToken = (0, jwt_1.verifyToken)(token);
        // 디코딩 된 값이 string이면 만료됐거나 위조된 토큰
        if (typeof verifiedToken === 'string') {
            return res.json({ ok: false, message: 'Invalid Token' }).status(401);
        }
        ;
        // jwt가 블랙리스트에 있는지 확인
        const jti = verifiedToken.jti;
        const check = yield db_1.db.jwt_blacklist.findFirst({
            where: {
                jwt: jti
            }
        });
        // 블랙리스트에 있다면
        if (check)
            return res.json({ ok: false, message: 'Invalid Token' }).status(401);
        return next();
    }
    catch (err) {
        console.error(`[authToken]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authToken = authToken;
/**
 * 회원 탈퇴
 */
const authWithdraw = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization: token } = req.headers;
        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입임
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
        console.error(`[/api/local/withdraw]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authWithdraw = authWithdraw;
/**
 * 로그인
 */
const authLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id, password: pw } = req.body;
        if (!id)
            return res.json({ ok: false, message: 'ID missing' }).status(400);
        if (!pw)
            return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);
        const user = yield db_1.db.user.findFirst({
            where: {
                id
            }
        });
        if (!user)
            return res.json({ ok: false, message: `Cannot find User` }).status(404);
        // 비밀번호 일치 확인
        const check = yield bcrypt_1.default.compare(pw, user.password);
        // 일치하지 않음
        if (!check) {
            return res.json({ ok: false, message: 'Wrong Password' }).status(200);
        }
        let result = {
            no: user.no,
            id: user.id,
            nick: user.nick,
        };
        // 토큰 생성
        const token = (0, jwt_1.signJwtAccessToken)(result);
        // 유저 정보로 토큰 생성 후, 토큰 추가
        result = Object.assign(Object.assign({}, result), { token });
        return res.json(result).status(200);
    }
    catch (err) {
        console.error(`[/api/auth/login]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.authLogin = authLogin;
/**
 * 로그아웃 시 jwt 블랙리스트 추가
 */
const authJwtToBlack = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authorization: token } = req.headers;
        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입임
        const verifiedToken = (0, jwt_1.verifyToken)(token);
        const jti = verifiedToken.jti;
        if (!jti)
            return res.json({ ok: false, message: 'Unauthorized' }).status(401);
        yield db_1.db.jwt_blacklist.create({
            data: {
                jwt: jti
            }
        });
        return next();
    }
    catch (err) {
        console.log(`[authJwtToBlack]`, err);
        return res.json({ ok: false, message: 'Unauthorized' }).status(500);
    }
});
exports.authJwtToBlack = authJwtToBlack;
/**
 * 로그아웃
 */
const authLogout = (req, res) => {
    // jtw를 블랙리스트에 등록.
    // 로그아웃 처리 추가...
    return res.json({ ok: true }).status(200);
};
exports.authLogout = authLogout;
