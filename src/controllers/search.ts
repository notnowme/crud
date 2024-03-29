import { Request, Response } from "express";
import { db } from "../lib/db";
import { SearchInfo } from "../types/global";
import { Free_board, Qna_board } from "@prisma/client";

export const searchBoard = async (req: Request<{}, {}, {}, { board: 'free' | 'qna', cat: 'title' | 'nick' | 'content', key: string, page: string }>, res: Response) => {
    try {
        const { board, cat, key, page } = req.query

        if (!board) return res.json({ ok: false, message: 'Board missing' }).status(400);
        if (!cat) return res.json({ ok: false, message: 'Category missing' }).status(400);
        if (!key) return res.json({ ok: false, message: 'Keyword missing' }).status(400);
        if (!page) return res.json({ ok: false, message: 'Page missing' }).status(400);

        const pageSize = 20;
        const lastNum = pageSize * (parseInt(page as string) - 1);

        // 총 게시글 수
        let allCounts;

        //쿼리
        let query;

        // 검색된 게시글 수
        let boardCount;

        let result: SearchInfo<Free_board | Qna_board>[];
        
        // 더 효율적인 방법이 있다면 수정해야될 듯...

        if (cat === 'nick') {
            query = {
                where: {
                    author: {
                        nick: {
                            contains: `${key}`
                        }
                    }
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
            }
        } else {
            query = {
                where: {
                    [cat]: {
                        contains: `${key}`
                    }
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
            }
        }

        if (board === 'free') {
            allCounts = await db.free_board.count();
            [result, boardCount] = await db.$transaction([
                db.free_board.findMany({
                    take: pageSize,
                    skip: lastNum <= 0 ? 1 : lastNum,
                    where: query.where,
                    include: query.include,
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                db.free_board.count({
                    take: pageSize,
                    skip: lastNum <= 0 ? 1 : lastNum,
                    where: query.where,
                })
            ])
        } else {
            allCounts = await db.qna_board.count();
            [result, boardCount] = await db.$transaction([
                db.qna_board.findMany({
                    take: pageSize,
                    skip: lastNum <= 0 ? 1 : lastNum,
                    where: query.where,
                    include: query.include,
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                db.qna_board.count({
                    take: pageSize,
                    skip: lastNum <= 0 ? 1 : lastNum,
                    where: query.where,
                })
            ])
        };

        if(!result.length) return res.json({ok: false, message: 'Not Found'}).status(404)
        
        return res.json({ ok: true, data: result, boardsCount: boardCount, allCounts }).status(200);

} catch (err) {
    console.error(`[GET] /api/search`, err);
    return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
}
}