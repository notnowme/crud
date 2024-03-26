import { Request, Response, NextFunction } from "express";
import { db } from "../lib/db";
import bcrypt from 'bcrypt';
import { signJwtAccessToken, verifyToken } from "../lib/jwt";
import { JwtPayload } from "jsonwebtoken";

import { User } from "@prisma/client";

type UserInfo = Omit<User, 'created_at' | 'password'>;
type UserInfoWithToken = UserInfo & { token?: string }

/**
 * 아이디 중복 확인
 */
export const checkId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.body;

        if (!id) return res.json({ ok: false, message: 'ID missing' }).status(400);

        const result = await db.user.findFirst({
            where: {
                id
            }
        });

        if (result) {
            return res.json({ ok: false, message: 'ID exists!' }).status(409);
        }

        return next();

    } catch (err) {
        console.error(`[/api/auth/local/users/id]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 닉네임 중복 확인
 */
export const checkNick = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { nick } = req.body;

        if (!nick) return res.json({ ok: false, message: 'NICK missing' }).status(400);

        const result = await db.user.findFirst({
            where: {
                nick
            }
        });

        if (result) {
            return res.json({ ok: false, message: 'NICK exists!' }).status(409);
        }

        return next();

    } catch (err) {
        console.error(`[/api/auth/local/users/nick]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 회원 가입
 */
export const authJoin = async (req: Request, res: Response) => {
    try {
        const { id, nick, password } = req.body;

        if (!password) return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);

        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);

        await db.user.create({
            data: {
                id,
                nick,
                password: hashedPassword
            }
        });

        return res.json({ ok: true }).status(200);

    } catch (err) {
        console.error(`[/api/auth/local/join]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
};


/**
 * 토큰 확인
 */
export const authToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: token } = req.headers;

        // 헤더에 토큰이 없으면 인증이 안 된 접근
        if (!token) return res.json({ ok: false, message: 'Unauthorized' }).status(401);

        const verifiedToken = verifyToken(token);

        // 디코딩 된 값이 string이면 만료됐거나 위조된 토큰
        if (typeof verifiedToken === 'string') {
            return res.json({ ok: false, message: 'Invalid Token' }).status(401);
        };

        // jwt가 블랙리스트에 있는지 확인
        const jti = verifiedToken.jti as string;
        const check = await db.jwt_blacklist.findFirst({
            where: {
                jwt: jti
            }
        });

        // 블랙리스트에 있다면
        if (check) return res.json({ ok: false, message: 'Invalid Token' }).status(401);

        return next();

    } catch (err) {
        console.error(`[authToken]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 회원 탈퇴
 */
export const authWithdraw = async (req: Request, res: Response) => {
    try {
        const { authorization: token } = req.headers;

        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입임
        const verifiedToken = verifyToken(token as string) as JwtPayload;

        const { id } = verifiedToken;

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.json({ ok: false, message: 'Cannot find User' }).status(404);

        await db.user.delete({
            where: {
                id
            }
        });

        return res.json({ ok: true }).status(200);

    } catch (err) {
        console.error(`[/api/local/withdraw]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 로그인
 */
export const authLogin = async (req: Request, res: Response) => {
    try {
        const { id, password: pw } = req.body;

        if (!id) return res.json({ ok: false, message: 'ID missing' }).status(400);
        if (!pw) return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.json({ ok: false, message: `Cannot find User` }).status(404);

        // 비밀번호 일치 확인
        const check = await bcrypt.compare(pw, user.password);

        // 일치하지 않음
        if (!check) {
            return res.json({ ok: false, message: 'Wrong Password' }).status(200);
        }

        let result: UserInfoWithToken = {
            no: user.no,
            id: user.id,
            nick: user.nick,
        }

        // 토큰 생성
        const token = signJwtAccessToken(result);

        // 유저 정보로 토큰 생성 후, 토큰 추가
        result = {
            ...result,
            token
        }

        return res.json(result).status(200);

    } catch (err) {
        console.error(`[/api/auth/login]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
};


/**
 * 로그아웃 시 jwt 블랙리스트 추가
 */
export const authJwtToBlack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { authorization: token } = req.headers;

        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입임
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

/**
 * 로그아웃
 */
export const authLogout = (req: Request, res: Response) => {
    // jtw를 블랙리스트에 등록.
    // 로그아웃 처리 추가...
    return res.json({ ok: true }).status(200);
}