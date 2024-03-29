import {
    authJoin,
    authLogin,
    authLogout,
    authWithdraw,
    checkId,
    checkNick
} from "../controllers/auth";
import express from "express";
import { checkToken, jwtToBlack } from "../lib/token";

const router = express.Router();

/**
 * @swagger
 *  /api/auth/local/join:
 *      post:
 *          summary: 회원가입
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             id:
 *                                type: string
 *                                description: 아이디
 *                                example: test01
 *                             nick:
 *                                type: string
 *                                description: 닉네임
 *                                example: 테스트01
 *                             password:
 *                                type: string
 *                                description: 비밀번호
 *                                example: password
 *
 *          responses:
 *              200:
 *                  description: 회원 가입 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: true
 *              400:
 *                  description: 아이디 혹은 닉네임, 패스워드 미입력
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: PASSWORD missing
 *              409:
 *                  description: 아이디 혹은 닉네임 중복
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: ID exists!
 *              500:
 *                  description: 서버 오류
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Internel Server Error
 */
router.post('/local/join', checkId, checkNick, authJoin); // 가입

/**
 * @swagger
 *  /api/auth/local/withdraw:
 *      post:
 *          summary: 회원탈퇴
 *          security:
 *              - Authorization: []
 *          tags:
 *              - Auth
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                required: true
 *                schema:
 *                   type: string
 *                description: token 필요
 *          responses:
 *              200:
 *                  description: 회원 탈퇴 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: true
 *              404:
 *                  description: 아이디를 찾을 수 없음
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Cannot find User
 *              401:
 *                  description: 토큰 없음 혹은 위조, 만료
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Unauthorized
 *              500:
 *                  description: 서버 오류
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Internel Server Error
 */
router.post('/local/withdraw', checkToken, authWithdraw); // 탈퇴

/**
 * @swagger
 *  /api/auth/login:
 *      post:
 *          summary: 로그인
 *          tags:
 *              - Auth
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             id:
 *                                type: string
 *                                description: 아이디
 *                                example: test01
 *                             password:
 *                                type: string
 *                                description: 비밀번호
 *                                example: password
 *          responses:
 *              200:
 *                  description: 로그인 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 회원 정보
 *                             example:
 *                                {"ok": true, "data": {"no": 1, "id": "test01", "nick": "테스트01", "token": "jwt token"} }
 *              400:
 *                  description: 아이디 혹은 비밀번호 미입력
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: ID missing
 *              401:
 *                  description: 비밀번호 틀림
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Wrong Password
 *              404:
 *                  description: 아이디를 찾을 수 없음
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Cannot find User
 *              500:
 *                  description: 서버 오류
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Internel Server Error
 */
router.post('/login', authLogin); // 로그인

/**
 * @swagger
 *  /api/auth/logout:
 *      post:
 *          summary: 로그아웃
 *          security:
 *              - Authorization: []
 *          tags:
 *              - Auth
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                required: true
 *                schema:
 *                   type: string
 *                description: token 필요
 *          responses:
 *              200:
 *                  description: 로그아웃 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: true
 *              401:
 *                  description: 토큰 없음 혹은 위조, 만료
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Unauthorized
 *              500:
 *                  description: 서버 오류
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 상태
 *                                   example: false
 *                                message:
 *                                   type: string
 *                                   example: Internel Server Error
 */
router.post('/logout', checkToken, jwtToBlack, authLogout); // 로그아웃

module.exports = router;