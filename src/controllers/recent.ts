import { RequestHandler } from "express";
import { db } from "../lib/db";

export const recentFreeBoard: RequestHandler = async (req, res) => {
    try {
        const boards = await db.free_board.findMany({
            take: 3,
            orderBy: {
                no: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nick: true,
                    }
                },
                comments: {
                    select: {
                        author_no: true,
                    }
                }
            }
        });

        if (boards.length === 0) {
            return res.status(404).json({ok: false, message: 'no data'});
        }
        return res.status(200).json({ok: true, data: boards});
    } catch (error) {
        console.log(`[GET] /api/recent/free`, error);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};

export const recentQnaBoard: RequestHandler = async (req, res) => {
    try {
        const boards = await db.qna_board.findMany({
            take: 3,
            orderBy: {
                no: 'desc'
            },
            include: {
                author: {
                    select: {
                        id: true,
                        nick: true,
                    }
                },
                comments: {
                    select: {
                        author_no: true,
                    }
                }
            }
        });

        if (boards.length === 0) {
            return res.status(404).json({ok: false, message: 'no data'});
        }
        return res.status(200).json({ok: true, data: boards});
    } catch (error) {
        console.log(`[GET] /api/recent/free`, error);
        return res.status(500).json({ok: false, message: 'Internel Server Error'});
    }
};