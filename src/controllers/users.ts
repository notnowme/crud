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
        return res.status(200).json({ok: true, data: result});
    } catch (err) {
        console.log(`[GET] /api/users`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};

/**
 * 유저 정보
 * @param req 
 * @param res 
 */
export const getUserInfo: RequestHandler = async (req, res) => {
    try {
        const { authorization: token } = req.headers;
        const { no } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        if(!no) return res.status(400).json({ok: false, message: 'User No missing'});

        const query = {
            where: {
                author_no: no
            }
        };

        const [userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount] = await db.$transaction([
            db.user.findFirst({
                where: {
                    no: no
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

        if(!userInfo) return res.status(404).json({ok: false, message: 'Cannot find User'});

        return res.status(200).json({ok: true, data: userInfo, freeBoardCount, qnaBoardCount, freeCommentCount, qnaCommentCount});

    } catch (err) {
        console.error(`[GET] /api/users/no`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
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
        console.log('??');
        const { authorization: token } = req.headers;

        const { nick }: ModifyUserNickDito = req.body;

        if(!nick) return res.status(400).json({ok: false, message: 'NICK missing'});
        
        const { id, no } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if(!user) return res.status(400).json({ok: false, message: 'Cannot find User'});

        // 토큰의 id에서 가져온 회원 번호와 params의 회원 번호 일치 확인
        const checkIdAndNo = user.no === no;
        console.log(user.no, no, checkIdAndNo);
        if(!checkIdAndNo) return res.status(401).json({ok: false, message: 'Unauthorized'});

        const result = await db.user.update({
            where: {
                no
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

        return res.status(201).json({ok: true, data: result});
        
    } catch (err) {
        console.error(`[PATCH] /api/users/no`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};