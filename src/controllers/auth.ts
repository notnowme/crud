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
            return res.json({ ok: false, message: 'ID exists!' }).status(409);
        }

        return next();

    } catch (err) {
        console.error(`checkId`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 닉네임 중복 확인
 */
export const checkNick: RequestHandler = async (req, res, next) => {
    try {
        const { nick }: CheckNickDto = req.body;

        if (!nick) return res.json({ ok: false, message: 'NICK missing' }).status(400);

        const result = await db.user.findFirst({
            where: {
                nick
            }
        });

        if (result) return res.json({ ok: false, message: 'NICK exists!' }).status(409);

        return next();

    } catch (err) {
        console.error(`checkNick`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 회원 가입
 */
export const authJoin: RequestHandler = async (req, res) => {
    try {
        const { id, nick, password }: AuthJoinDto = req.body;

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

        return res.json({ ok: true }).status(201);

    } catch (err) {
        console.error(`[POST] /api/auth/local/join]`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
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

        if (!user) return res.json({ ok: false, message: 'Cannot find User' }).status(404);

        await db.user.delete({
            where: {
                id
            }
        });

        return res.json({ ok: true }).status(200);

    } catch (err) {
        console.error(`[POST] /api/local/withdraw`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
}

/**
 * 로그인
 */
export const authLogin: RequestHandler = async (req, res) => {
    try {
        const { id, password }: AuthLoginDto = req.body;

        if (!id) return res.json({ ok: false, message: 'ID missing' }).status(400);
        if (!password) return res.json({ ok: false, message: 'PASSWORD missing' }).status(400);

        const user = await db.user.findFirst({
            where: {
                id
            }
        });

        if (!user) return res.json({ ok: false, message: `Cannot find User` }).status(404);

        // 비밀번호 일치 확인
        const check = await bcrypt.compare(password, user.password);

        if (!check) {
            return res.json({ ok: false, message: 'Wrong Password' }).status(200);
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

        return res.json({ok: true, data: result}).status(200);

    } catch (err) {
        console.error(`[POST] /api/auth/login`, err);
        return res.json({ ok: false, message: 'Internel Server Error' }).status(500);
    }
};

/**
 * 로그아웃
 */
export const authLogout: RequestHandler = (req, res) => {
    // jwt를 블랙리스트에 등록.
    // 로그아웃 처리 추가...
    return res.json({ ok: true }).status(200);
}