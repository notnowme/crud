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
exports.modifyUserNick = exports.getUserInfo = exports.getAllUsers = void 0;
const db_1 = require("../lib/db");
const jwt_1 = require("../lib/jwt");
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
        return res.json({ ok: true, data: result }).status(200);
    }
    catch (err) {
        console.log(`[GET] /api/users`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.getAllUsers = getAllUsers;
/**
 * 유저 정보
 * @param req
 * @param res
 */
const getUserInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { no } = req.params;
        if (!no)
            return res.json({ ok: false, message: 'User No missing' }).status(400);
        const query = {
            where: {
                author_no: parseInt(no)
            }
        };
        const [userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount] = yield db_1.db.$transaction([
            db_1.db.user.findFirst({
                where: {
                    no: parseInt(no)
                },
                select: {
                    no: true,
                    id: true,
                    nick: true,
                    created_at: true
                }
            }),
            db_1.db.free_board.count({
                where: query.where,
            }),
            db_1.db.qna_board.count({
                where: query.where,
            }),
            db_1.db.free_comment.count({
                where: query.where,
            }),
            db_1.db.qna_comment.count({
                where: query.where,
            })
        ]);
        if (!userInfo)
            return res.json({ ok: false, message: 'Cannot find User' }).status(404);
        return res.json({ ok: true, data: userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount }).status(200);
    }
    catch (err) {
        console.error(`[GET] /api/users/no`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.getUserInfo = getUserInfo;
/**
 * 닉네임 수정
 * @param req
 * @param res
 * @returns
 */
const modifyUserNick = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 인증 끝, 중복 끝.
    try {
        const { authorization: token } = req.headers;
        const { no } = req.params;
        const { nick } = req.body;
        if (!no)
            return res.json({ ok: false, message: 'User No Missing' }).status(400);
        const { id } = (0, jwt_1.verifyToken)(token);
        const user = yield db_1.db.user.findFirst({
            where: {
                id
            }
        });
        if (!user)
            return res.json({ ok: false, message: 'Cannot find User' }).status(400);
        // 토큰의 id에서 가져온 회원 번호와 params의 회원 번호 일치 확인
        const checkIdAndNo = user.no === parseInt(no);
        if (!checkIdAndNo)
            return res.json({ ok: false, message: 'Unauthorized' }).status(401);
        const result = yield db_1.db.user.update({
            where: {
                no: parseInt(no)
            },
            data: {
                nick: nick
            },
            select: {
                no: true,
                id: true,
                nick: true,
            }
        });
        return res.json({ ok: true, data: result }).status(201);
    }
    catch (err) {
        console.error(`[PATCH] /api/users/no`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
});
exports.modifyUserNick = modifyUserNick;
