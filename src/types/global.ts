import { User } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

// 유저 정보 타입
export type UserInfo = Omit<User, 'created_at' | 'password'>;

// jwt와 유저 정보 타입
export type JwtPayloadWithUserInfo = UserInfo & JwtPayload;

export type SearchInfo<T> = T & {
    author: UserInfo;
}