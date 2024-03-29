export interface CheckIdDto {
    id: string;
};

export interface CheckNickDto {
    nick: string;
};

export type AuthJoinDto = CheckIdDto & CheckNickDto & {
    password: string;
}

export type AuthLoginDto = CheckIdDto & {
    password: string;
}