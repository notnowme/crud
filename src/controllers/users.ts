import { RequestHandler } from "express";
import { db } from "../lib/db";
import { verifyToken } from "../lib/jwt";
import { JwtPayloadWithUserInfo } from "../types/global";
import { ModifyUserNickDito } from "../interfaces/user";

export const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const result = await db.user.findMany({
            select: {
                no: true,
                id: true,
                nick: true,
                created_at: true,
            }
        });
        return res.json({ok: true, data: result}).status(200);
    } catch (err) {
        console.log(`[GET] /api/users`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

/**
 * 유저 정보
 * @param req 
 * @param res 
 */
export const getUserInfo: RequestHandler = async (req, res) => {
    try {
        const { no } = req.params;

        if(!no) return res.json({ok: false, message: 'User No missing'}).status(400);

        const query = {
            where: {
                author_no: parseInt(no)
            }
        };

        const [userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount] = await db.$transaction([
            db.user.findFirst({
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
            db.free_board.count({
                where: query.where,
            }),
            db.qna_board.count({
                where: query.where,
            }),
            db.free_comment.count({
                where: query.where,
            }),
            db.qna_comment.count({
                where: query.where,
            })
        ]);

        if(!userInfo) return res.json({ok: false, message: 'Cannot find User'}).status(404);

        return res.json({ok: true, data: userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount}).status(200);

    } catch (err) {
        console.error(`[GET] /api/users/no`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

/**
 * 닉네임 수정
 * @param req 
 * @param res 
 * @returns 
 */
export const modifyUserNick: RequestHandler = async(req, res) => {
    // 인증 끝, 중복 끝.
    try {
        const { authorization: token } = req.headers;
        const { no } = req.params
        const { nick }: ModifyUserNickDito = req.body;

        
        if(!no) return res.json({ok: false, message: 'User No Missing'}).status(400);
        
        const { id } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if(!user) return res.json({ok: false, message: 'Cannot find User'}).status(400);

        // 토큰의 id에서 가져온 회원 번호와 params의 회원 번호 일치 확인
        const checkIdAndNo = user.no === parseInt(no);

        if(!checkIdAndNo) return res.json({ok: false, message: 'Unauthorized'}).status(401);

        const result = await db.user.update({
            where: {
                no: parseInt(no)
            },
            data: {
                nick: nick as string
            },
            select: {
                no: true,
                id: true,
                nick: true,
            }
        });

        return res.json({ok: true, data: result}).status(201);
        
    } catch (err) {
        console.error(`[PATCH] /api/users/no`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};