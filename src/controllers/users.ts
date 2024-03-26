import { Request, Response } from "express";
import { db } from "../lib/db";

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await db.user.findMany({
            select: {
                no: true,
                id: true,
                nick: true,
                created_at: true,
            }
        });
        return res.json(result).status(200);
    } catch (err) {
        console.log(`[/api/users]`, err);
        return res.json({ok: false, message: 'Internel Server Error'}).status(500);
    }
};

export const getUserInfo = (req: Request, res: Response) => {
    console.log(req.params.id);
    res.send('test').status(200);
}