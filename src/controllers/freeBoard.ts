import { Request, Response } from "express";
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
export const boardGetAll = async (req: Request, res: Response) => {
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
            skip: lastNum <= 0 ? 1 : lastNum,
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
                    }
                }
            }),
            db.free_board.count({
                take: query.take,
                skip: query.skip
            })
        ]);

        if(boardsCount === 0) return res.json({ok: false, message: 'Not Found'}).status(404);

        return res.json({ok: true, data: boards, boardsCount, allCounts}).status(200);

    } catch (err) {
        console.error(`[GET] /api/board/free`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
}

/**
 * 한 개의 게시글 정보
 * @param req 
 * @param res 
 * @returns 
 */
export const boardGetOne = async(req: Request, res: Response) => {
    try {
        const { no } = req.params;
        
        if(!no) return res.json({ok: false, message: 'Board No missing'}).status(400);

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

        if(!board) return res.json({ok: false, message: 'Not Found'}).status(404);

        return res.json({ok: true, data: board}).status(200);
    } catch (err) {
        console.error(`[GET] /api/board/free/{no}`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500)
    }
}

/**
 * 게시글 작성
 * @param req 
 * @param res 
 * @returns 
 */
export const boardWrite = async(req: Request, res: Response) => {
    try {
        const { title, content }: BoardWriteModifyDto = req.body;

        // 토큰을 검증하고 옴
        const { authorization: token } = req.headers;
        const { no } = verifyToken(token as string) as JwtPayloadWithUserInfo;
    
        if(!title) return res.json({ok: false, message: 'TITLE missing'}).status(400);
        if(!content) return res.json({ok: false, message: 'CONTENT missing'}).status(400);
    
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
    
        return res.json({ok: true, data: board}).status(201);

    } catch (err) {
        console.log(`[POST] /api/board/free`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

export const boardModify = async (req: Request, res: Response) => {
    try {
        const { no: boardNo } = req.params;
        const { title, content }: BoardWriteModifyDto = req.body;

        if(!boardNo) return res.json({ok: false, message: 'Board No missing'}).status(400);

        if(!title) return res.json({ok: false, message: 'TITLE missing'}).status(400);
        if(!content) return res.json({ok: false, message: 'CONTENT missing'}).status(400);

        const { authorization: token } = req.headers;
        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const board = await db.free_board.findFirst({
            where: {
                no: parseInt(boardNo)
            }
        });

        if(!board) return res.json({ok: false, message: `Cannot find Board with ${boardNo}`}).status(404);

        const checkAuthor = userNo === board.author_no;
        
        if(!checkAuthor) return res.json({ok: false, message: 'No Author'}).status(400);

        const modifiedBoard = await db.free_board.update({
            where: {
                no: parseInt(boardNo)
            },
            data: {
                title,
                content
            }
        });

        return res.json({ok: true, data: modifiedBoard}).status(200);

    } catch (err) {
        console.error(`[PATCH] /api/board/free/{no}`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

/**
 * 게시글 삭제
 * @param req 
 * @param res 
 * @returns 
 */
export const boardDelete = async (req: Request, res: Response) => {
    try {
        const { no: boardNo } = req.params;
        if(!boardNo) return res.json({ok: false, message: 'Board No missing'}).status(400);

        const { authorization: token } = req.headers;
        const { no: userNo } = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const board = await db.free_board.findFirst({
            where: {
                no: parseInt(boardNo)
            }
        });

        if(!board) return res.json({ok: false, message: `Cannot find Board with ${boardNo}`}).status(404);

        const checkAuthor = userNo === board.author_no;
        
        if(!checkAuthor) return res.json({ok: false, message: 'No Author'}).status(400);

        await db.free_board.delete({
            where: {
                no: parseInt(boardNo)
            }
        });

        return res.json({ok: true}).status(200);
    } catch (err) {
        console.error(`[DELETE] /api/board/free/{no}`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
}