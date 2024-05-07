import { Request, Response } from "express";
import { db } from "../lib/db";
import { SearchInfo } from "../types/global";
import { Free_board, Qna_board } from "@prisma/client";

export const searchBoard = async (req: Request<{}, {}, {}, { board: 'free' | 'qna', cat: 'title' | 'nick' | 'content', key: string, page: string }>, res: Response) => {
    try {
        const { board, cat, key, page } = req.query

        if (!board) return res.status(400).json({ ok: false, message: 'Board missing' });
        if (!cat) return res.status(400).json({ ok: false, message: 'Category missing' });
        if (!key) return res.status(400).json({ ok: false, message: 'Keyword missing' });
        if (!page) return res.status(400).json({ ok: false, message: 'Page missing' });

        const pageSize = 20;
        const lastNum = pageSize * (parseInt(page as string) - 1);

        // 총 게시글 수
        let allCounts;

        //쿼리
        let query;

        // 검색된 게시글 수
        let boardCount;

        let result;
        
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
                    },
                    comments: {
                        select: {
                            author_no: true,
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
                    },
                    comments: {
                        select: {
                            author_no: true,
                        }
                    }
                }
            }
        }

        if (board === 'free') {
            allCounts = await db.free_board.count({
                where: query.where,
            });
            [result, boardCount] = await db.$transaction([
                db.free_board.findMany({
                    take: pageSize,
                    skip: lastNum < 20 ? 0 : lastNum,
                    where: query.where,
                    include: query.include,
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                db.free_board.count({
                    take: pageSize,
                    skip: lastNum < 20 ? 0 : lastNum,
                    where: query.where,
                })
            ])
        } else {
            allCounts = await db.qna_board.count({
                where: query.where,
            });
            [result, boardCount] = await db.$transaction([
                db.qna_board.findMany({
                    take: pageSize,
                    skip: lastNum < 20 ? 0 : lastNum,
                    where: query.where,
                    include: query.include,
                    orderBy: {
                        created_at: 'desc'
                    }
                }),
                db.qna_board.count({
                    take: pageSize,
                    skip: lastNum < 20 ? 0 : lastNum,
                    where: query.where,
                })
            ])
        };

        if(!result.length) return res.status(404).json({ok: false, message: 'Not Found'});
        
        return res.status(200).json({ ok: true, data: result, boardsCount: boardCount, allCounts });

} catch (err) {
    console.error(`[GET] /api/search`, err);
    return res.status(500).json({ ok: false, message: 'Internel Server Error' });
}
}