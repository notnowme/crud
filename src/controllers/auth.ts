import { RequestHandler } from "express";
import { db } from "../lib/db";
import bcrypt from 'bcrypt';
import { signJwtAccessToken, verifyToken } from "../lib/jwt";

import { JwtPayloadWithUserInfo, UserInfo } from "../types/global";
import { AuthJoinDto, AuthLoginDto, CheckIdDto, CheckNickDto } from "../interfaces/auth";

type UserInfoWithToken = UserInfo & { token?: string }

/**
 * 아이디 중복 확인
 */
export const checkId: RequestHandler = async (req, res, next) => {
    try {
        const { id }: CheckIdDto = req.body;

        if (!id) return res.json({ ok: false, message: 'ID missing' }).status(400);

        const result = await db.user.findFirst({
            where: {
                id
            }
        });

        if (result) {
            return res.status(409).json({ ok: false, message: 'ID exists!' });
        }

        return next();

    } catch (err) {
        console.error(`checkId`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
}

/**
 * 닉네임 중복 확인
 */
export const checkNick: RequestHandler = async (req, res, next) => {
    try {
        const { nick }: CheckNickDto = req.body;

        if (!nick) return res.status(400).json({ ok: false, message: 'NICK missing' });

        const result = await db.user.findFirst({
            where: {
                nick
            }
        });

        if (result) return res.status(409).json({ ok: false, message: 'NICK exists!' });

        return next();

    } catch (err) {
        console.error(`checkNick`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
}

/**
 * 회원 가입
 */
export const authJoin: RequestHandler = async (req, res) => {
    try {
        console.log('hi');
        const { id, nick, password }: AuthJoinDto = req.body;

        if (!password) return res.status(400).json({ ok: false, message: 'PASSWORD missing' });

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

        return res.status(201).json({ ok: true });

    } catch (err) {
        console.error(`[POST] /api/auth/local/join]`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
};

/**
 * 회원 탈퇴
 */
export const authWithdraw: RequestHandler = async (req, res) => {
    try {
        const { authorization: token } = req.headers;

        // 예외 처리 후 왔으므로, token 값도 있고, jwt 타입
        const verifiedToken = verifyToken(token as string) as JwtPayloadWithUserInfo;

        const { id } = verifiedToken;

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.status(404).json({ ok: false, message: 'Cannot find User' });

        await db.user.delete({
            where: {
                id
            }
        });

        return res.status(200).json({ ok: true });

    } catch (err) {
        console.error(`[POST] /api/local/withdraw`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
}

/**
 * 로그인
 */
export const authLogin: RequestHandler = async (req, res) => {
    try {
        const { id, password }: AuthLoginDto = req.body;

        if (!id) return res.status(400).json({ ok: false, message: 'ID missing' });
        if (!password) return res.status(400).json({ ok: false, message: 'PASSWORD missing' });

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.status(404).json({ ok: false, message: `Cannot find User` });

        // 비밀번호 일치 확인
        const check = await bcrypt.compare(password, user.password);

        if (!check) {
            return res.status(401).json({ ok: false, message: 'Wrong Password' });
        }

        let result: UserInfoWithToken = {
            no: user.no,
            id: user.id,
            nick: user.nick,
        }

        const token = signJwtAccessToken(result);

        // 유저 정보로 토큰 생성 후, 추가
        result = {
            ...result,
            token
        }

        return res.status(200).json({ok: true, data: result});

    } catch (err) {
        console.error(`[POST] /api/auth/login`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
};

/**
 * 탈퇴 시 비밀번호 확인
 */

export const authCheckPassword: RequestHandler = async (req, res) => {
    try {
        const { id, password }: AuthLoginDto = req.body;

        if (!id) return res.status(400).json({ ok: false, message: 'ID missing' });
        if (!password) return res.status(400).json({ ok: false, message: 'PASSWORD missing' });

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.status(404).json({ ok: false, message: `Cannot find User` });

        // 비밀번호 일치 확인
        const check = await bcrypt.compare(password, user.password);

        if (!check) {
            return res.status(401).json({ ok: false, message: 'Wrong Password' });
        }

        return res.status(200).json({ok: true});

    } catch (err) {
        console.error(`[POST] /api/auth/check/password`, err);
        return res.status(500).json({ ok: false, message: 'Internel Server Error' });
    }
}

/**
 * 로그아웃
 */
export const authLogout: RequestHandler = (req, res) => {
    // jwt를 블랙리스트에 등록.
    // 로그아웃 처리 추가...
    return res.status(200).json({ ok: true });
}