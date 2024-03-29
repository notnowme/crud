import { RequestHandler } from "express";
import { verifyToken } from "../lib/jwt";
import { JwtPayloadWithUserInfo } from "../types/global";

import { db } from "../lib/db";
import { CommentWriteDto } from "../interfaces/comment";

export const commentQnaWrite: RequestHandler = async (req, res) => {
    
    try {
        const { authorization: token } = req.headers;
        const { boardNo, content }: CommentWriteDto = req.body;

        if(!boardNo) return res.json({ok: false, message: 'Board No missing'}).status(400);
        if(!content) return res.json({ok: false, message: 'CONTENT missing'}).status(400);
        
        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const comment = await db.qna_comment.create({
            data: {
                content,
                author_no: userNo,
                board_no: boardNo
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nick: true
                    }
                }
            }
        });

        return res.json({ok: true, data: comment}).status(201);

    } catch (err) {
        console.error(`[POST] /api/comment/qna`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }

};

export const commentQnaModify: RequestHandler = async (req, res) => {
    try {
        const { no: cmtNo } = req.params;
        const { authorization: token } = req.headers;
        const { content }: CommentWriteDto = req.body;

        if(!cmtNo) return res.json({ok: false, message: 'Comment No missing'}).status(400);
    
        if(!content) return res.json({ok: false, message: 'CONTENT missing'}).status(400);

        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;
        const comment = await db.qna_comment.findFirst({
            where: {
                no: parseInt(cmtNo)
            }
        });
        
        if(!comment) return res.json({ok: false, message: 'Not Found'}).status(404);

        const checkAuthor = userNo === comment.author_no;

        if(!checkAuthor) return res.json({ok: false, message: 'No Author'}).status(400);

        const modifiedComment = await db.qna_comment.update({
            where: {
                no: parseInt(cmtNo)
            },
            data: {
                content
            }
        });

        return res.json({ok: true, data: modifiedComment}).status(200);

    } catch (err) {
        console.error(`[PATCH] /api/comment/qna/{no}`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

export const commentQnaDelete: RequestHandler = async(req, res) => {
    try {
        const { no: cmtNo } = req.params;
        const { authorization: token } = req.headers;

        if(!cmtNo) return res.json({ok: false, message: 'Comment No missing'}).status(400);

        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const comment = await db.qna_comment.findFirst({
            where: {
                no: parseInt(cmtNo)
            }
        });
        
        if(!comment) return res.json({ok: false, message: 'Not Found'}).status(404);

        const checkAuthor = userNo === comment.author_no;

        if(!checkAuthor) return res.json({ok: false, message: 'No Author'}).status(400);

        await db.qna_comment.delete({
            where: {
                no: parseInt(cmtNo)
            }
        });

        return res.json({ok: true}).status(200);

    } catch (err) {
        console.error(`[DELETE] /api/comment/qna/{no}`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};