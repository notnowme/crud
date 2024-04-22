import { RequestHandler } from "express";
import { verifyToken } from "../lib/jwt";
import { JwtPayloadWithUserInfo } from "../types/global";

import { db } from "../lib/db";
import { BoardWriteModifyDto } from "../interfaces/board";
import { Prisma } from "@prisma/client";

/**
 * 모든 게시물 가져오기
 * @param req 
 * @param res 
 * @returns 
 */
export const boardGetAll: RequestHandler = async (req, res) => {
    try {
        let { page } = req.query;

        if(!page) {
            return res.json({ok: false, message: 'Page No missing'}).status(400);
        }
        
        const allCounts = await db.free_board.count();
        const pageSize = 20;
        const lastNum = pageSize * (parseInt(page as string) - 1);

        const query: Prisma.Free_boardFindManyArgs = {
            take: pageSize,
            skip: lastNum <= 20 ? 0 : lastNum,
        }
        const [boards, boardsCount] = await db.$transaction([
            db.free_board.findMany({
                take: query.take,
                skip: query.skip,
                orderBy: {
                    no: 'desc'
                },
                include: {
                    author: {
                        select: {
                            id: true,
                            nick: true
                        }
                    },
                    comments: {
                        select: {
                            author_no: true,
                        },
                        
                    }
                },
            }),
            db.free_board.count({
                take: query.take,
                skip: query.skip
            })
        ]);

        if(boardsCount === 0) return res.status(404).json({ok: false, message: 'Not Found'});

        return res.status(200).json({ok: true, data: boards, boardsCount, allCounts});

    } catch (err) {
        console.error(`[GET] /api/board/free`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
}

/**
 * 한 개의 게시글 정보
 * @param req 
 * @param res 
 * @returns 
 */
export const boardGetOne: RequestHandler = async(req, res) => {
    try {
        const { no } = req.params;
        
        if(!no) return res.status(400).json({ok: false, message: 'Board No missing'});

        const board = await db.free_board.findFirst({
            where: {
                no: parseInt(no)
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nick: true
                    }
                },
                comments: {
                    select: {
                        no: true,
                        content: true,
                        created_at: true,
                        updated_at: true,
                        author: {
                            select: {
                                id: true,
                                nick: true
                            }
                        }
                    },
                    orderBy: {
                        no: 'desc'
                    }
                }
            }
        });

        if(!board) return res.status(404).json({ok: false, message: 'Not Found'});

        return res.json({ok: true, data: board}).status(200);
    } catch (err) {
        console.error(`[GET] /api/board/free/{no}`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
}

/**
 * 게시글 작성
 * @param req 
 * @param res 
 * @returns 
 */
export const boardWrite: RequestHandler = async(req, res) => {
    try {
        const { title, content }: BoardWriteModifyDto = req.body;

        // 토큰을 검증하고 옴
        const { authorization: token } = req.headers;
        const { no } = verifyToken(token as string) as JwtPayloadWithUserInfo;
    
        if(!title) return res.status(400).json({ok: false, message: 'TITLE missing'});
        if(!content) return res.status(400).json({ok: false, message: 'CONTENT missing'});
    
        const board = await db.free_board.create({
            data: {
                author_no: no,
                title,
                content,
            },
            include: {
                author: {
                    select: {
                        no: true,
                        id: true,
                        nick: true
                    }
                }
            }
        });
    
        return res.status(201).json({ok: true, data: board});

    } catch (err) {
        console.log(`[POST] /api/board/free`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};

export const boardModify: RequestHandler = async (req, res) => {
    try {
        const { no: boardNo } = req.params;
        const { title, content }: BoardWriteModifyDto = req.body;

        if(!boardNo) return res.status(400).json({ok: false, message: 'Board No missing'});

        if(!title) return res.status(400).json({ok: false, message: 'TITLE missing'});
        if(!content) return res.status(400).json({ok: false, message: 'CONTENT missing'});

        const { authorization: token } = req.headers;
        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const board = await db.free_board.findFirst({
            where: {
                no: parseInt(boardNo)
            }
        });

        if(!board) return res.status(404).json({ok: false, message: `Cannot find Board with ${boardNo}`});

        const checkAuthor = userNo === board.author_no;
        
        if(!checkAuthor) return res.status(400).json({ok: false, message: 'No Author'});

        const modifiedBoard = await db.free_board.update({
            where: {
                no: parseInt(boardNo)
            },
            data: {
                title,
                content
            }
        });

        return res.status(200).json({ok: true, data: modifiedBoard});

    } catch (err) {
        console.error(`[PATCH] /api/board/free/{no}`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};

/**
 * 게시글 삭제
 * @param req 
 * @param res 
 * @returns 
 */
export const boardDelete: RequestHandler = async (req, res) => {
    try {
        const { no: boardNo } = req.params;
        if(!boardNo) return res.status(400).json({ok: false, message: 'Board No missing'});

        const { authorization: token } = req.headers;
        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const board = await db.free_board.findFirst({
            where: {
                no: parseInt(boardNo)
            }
        });

        if(!board) return res.status(404).json({ok: false, message: `Cannot find Board with ${boardNo}`});

        const checkAuthor = userNo === board.author_no;
        
        if(!checkAuthor) return res.status(400).json({ok: false, message: 'No Author'});

        await db.free_board.delete({
            where: {
                no: parseInt(boardNo)
            }
        });

        return res.status(200).json({ok: true});
    } catch (err) {
        console.error(`[DELETE] /api/board/free/{no}`, err);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
}