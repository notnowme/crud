"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.signJwtAccessToken = void 0;
const jsonwebtoken_1 = __importStar(require("jsonwebtoken"));
const uuid_1 = require("uuid");
const DEFAULT_SIGN_OPTION = {
    expiresIn: "1h",
    jwtid: (0, uuid_1.v4)(),
};
/**
 * jwt 생성
 * @param payload
 * @param options
 * @returns
 */
const signJwtAccessToken = (payload, options = DEFAULT_SIGN_OPTION) => {
    const secret_key = process.env.SECRET_KEY;
    const token = jsonwebtoken_1.default.sign(payload, secret_key, options);
    return token;
};
exports.signJwtAccessToken = signJwtAccessToken;
/**
 * 토큰 검증
 * @param token
 * @returns
 */
const verifyToken = (token) => {
    try {
        const secret_key = process.env.SECRET_KEY;
        const decoded = jsonwebtoken_1.default.verify(token, secret_key);
        return decoded;
    }
    catch (err) {
        if (err instanceof jsonwebtoken_1.JsonWebTokenError) {
            console.error(`[JWT VERIFY]`, err);
            return err.name;
        }
        else {
            return 'Internel Server Error';
        }
    }
};
exports.verifyToken = verifyToken;
