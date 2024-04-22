import { RequestHandler } from "express";
import { verifyToken } from "../lib/jwt";
import { JwtPayloadWithUserInfo } from "../types/global";

import { db } from "../lib/db";
import { CommentWriteDto } from "../interfaces/comment";

export const commentQnaRead: RequestHandler = async (req, res) => {
    try {
        const { no: cmtNo } = req.params;
        if(!cmtNo) return res.status(400).json({ok: false, message: 'Comment No missing'});

        const comment = await db.qna_comment.findFirst({
            where: {
                no: parseInt(cmtNo)
            }
        });
        if(!comment) return res.status(404).json({ok: false, message: 'Cannot find a Comment'});
        return res.status(200).json({ok: true, data: comment});
    } catch (err) {
        console.error(`[GET] /api/comment/qna/no`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
}

export const commentQnaWrite: RequestHandler = async (req, res) => {
    
    try {
        const { authorization: token } = req.headers;
        const { boardNo, content }: CommentWriteDto = req.body;

        if(!boardNo) return res.status(400).json({ok: false, message: 'Board No missing'});
        if(!content) return res.status(400).json({ok: false, message: 'CONTENT missing'});
        
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

        return res.status(201).json({ok: true, data: comment});

    } catch (err) {
        console.error(`[POST] /api/comment/qna`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }

};

export const commentQnaModify: RequestHandler = async (req, res) => {
    try {
        const { no: cmtNo } = req.params;
        const { authorization: token } = req.headers;
        const { content }: CommentWriteDto = req.body;

        if(!cmtNo) return res.status(400).json({ok: false, message: 'Comment No missing'});
    
        if(!content) return res.status(400).json({ok: false, message: 'CONTENT missing'});

        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;
        const comment = await db.qna_comment.findFirst({
            where: {
                no: parseInt(cmtNo)
            }
        });
        
        if(!comment) return res.status(404).json({ok: false, message: 'Not Found'});

        const checkAuthor = userNo === comment.author_no;

        if(!checkAuthor) return res.status(400).json({ok: false, message: 'No Author'});

        const modifiedComment = await db.qna_comment.update({
            where: {
                no: parseInt(cmtNo)
            },
            data: {
                content
            }
        });

        return res.status(200).json({ok: true, data: modifiedComment});

    } catch (err) {
        console.error(`[PATCH] /api/comment/qna/{no}`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};

export const commentQnaDelete: RequestHandler = async(req, res) => {
    try {
        const { no: cmtNo } = req.params;
        const { authorization: token } = req.headers;

        if(!cmtNo) return res.status(400).json({ok: false, message: 'Comment No missing'});

        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const comment = await db.qna_comment.findFirst({
            where: {
                no: parseInt(cmtNo)
            }
        });
        
        if(!comment) return res.status(404).json({ok: false, message: 'Not Found'});

        const checkAuthor = userNo === comment.author_no;

        if(!checkAuthor) return res.status(400).json({ok: false, message: 'No Author'});

        await db.qna_comment.delete({
            where: {
                no: parseInt(cmtNo)
            }
        });

        return res.status(200).json({ok: true});

    } catch (err) {
        console.error(`[DELETE] /api/comment/qna/{no}`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};