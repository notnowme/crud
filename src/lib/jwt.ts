import jwt, { JsonWebTokenError, JwtPayload } from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';

type signOption = {
    expiresIn?: string | number;
    jwtid: string;
};

const DEFAULT_SIGN_OPTION: signOption = {
    expiresIn: "1h",
    jwtid: uuid(),
};

/**
 * jwt 생성
 * @param payload 
 * @param options 
 * @returns 
 */
export const signJwtAccessToken = (payload: JwtPayload, options: signOption = DEFAULT_SIGN_OPTION) => {
    const secret_key = process.env.SECRET_KEY;
    const token = jwt.sign(payload, secret_key!, options);
    return token;
};

/**
 * 토큰 검증
 * @param token 
 * @returns 
 */
export const verifyToken = (token: string) => {
    try {
        const secret_key = process.env.SECRET_KEY;
        const decoded = jwt.verify(token, secret_key!);
        return decoded as JwtPayload;
    } catch (err) {
        if(err instanceof JsonWebTokenError) {
            console.error(`[JWT VERIFY]`, err);
            return err.name;
        } else {
            return 'Internel Server Error';
        }
    }
};