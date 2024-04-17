import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./jwt";
import { db } from "./db";

/**
 * 토큰 확인
 */
export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: token } = req.headers;

        // 헤더에 토큰이 없으면 인증이 안 된 접근
        if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized' });

        const verifiedToken = verifyToken(token);

        // 디코딩 된 값이 string이면 만료됐거나 위조된 토큰
        if (typeof verifiedToken === 'string') {
            return res.status(401).json({ ok: false, message: 'Invalid Token' });
        };

        // jwt가 블랙리스트에 있는지 확인
        const jti = verifiedToken.jti as string;
        const check = await db.jwt_blacklist.findFirst({
            where: {
                jwt: jti
            }
        });

        if (check) return res.status(401).json({ ok: false, message: 'Invalid Token' });

        return next();

    } catch (err) {
        console.error(`[authToken]`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
}

/**
 * jwt 블랙리스트 추가
 */
export const jwtToBlack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: token } = req.headers;

        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입
        const verifiedToken = verifyToken(token as string) as JwtPayload;

        const jti = verifiedToken.jti;

        if (!jti) return res.json({ ok: false, message: 'Unauthorized' }).status(401);

        await db.jwt_blacklist.create({
            data: {
                jwt: jti
            }
        });

        return next();

    } catch (err) {
        console.log(`[authJwtToBlack]`, err);
        return res.json({ ok: false, message: 'Unauthorized' }).status(500);
    }
};