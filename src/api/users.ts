import express from "express";
import { 
    getAllUsers,
    getUserInfo,
    modifyUserNick
} from '../controllers/users';
import { checkToken } from "../lib/token";
import { checkNick } from "../controllers/auth";


// 라우터
const router = express.Router();

router.get('/', getAllUsers);
/**
 * @swagger
 *  /api/users:
 *      post:
 *          summary: 회원 정보
 *          tags:
 *             - Users
 *          security:
 *              - Authorization: []
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                schema:
 *                   type: string
 *                required: true
 *                description: token 필요
 *          responses:
 *              200:
 *                  description: 회원 정보
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 회원 정보
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 결과
 *                                   example: true
 *                                data:
 *                                   type: object
 *                                   description: 정보
 *                                   example:
 *                                              {
 *                                                 "no": 1,
 *                                                 "id": "test01",
 *                                                 "nick": "테스트01",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                              }
 *                                freeBoardCount:
 *                                   type: integer
 *                                   description: 자유 게시판 글 수
 *                                   example: 10
 *                                qnaBoardCount:
 *                                   type: integer
 *                                   description: 질문 게시판 글 수
 *                                   example: 10
 *                                freeCommentCount:
 *                                   type: integer
 *                                   description: 자유 댓글 수
 *                                   example: 10
 *                                qnaCommentCount:
 *                                   type: integer
 *                                   description: 질문 댓글 수
 *                                   example: 10
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
 *              400:
 *                  description: param에 회원 번호 없음
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
 *                                   example: User No Missing
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
/**
 * @swagger
 *  /api/users:
 *      patch:
 *          summary: 닉네임 수정
 *          tags:
 *              - Users
 *          security:
 *              - Authorization: []
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                schema:
 *                   type: string
 *                required: true
 *                description: token 필요      
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             nick:
 *                                type: string
 *                                description: 닉네임
 *                                example: 테스트02
 *
 *          responses:
 *              200:
 *                  description: 닉네임 수정 성공
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 수정된 회원 정보
 *                             example:
 *                                {"ok": true, "data": {"no": 1, "id": "test01", "nick": "테스트02", "created_at": "2024-03-26T08:44:12.702Z"} }
 *              400:
 *                  description: param에 회원 번호 없음
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
 *                                   example: User No Missing
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
 *              409:
 *                  description: 닉네임 중복
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
 *                                   example: NICK exists!
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
router
    .post('/', getUserInfo) // 유저 정보
    .patch('/', checkToken, checkNick, modifyUserNick); // 닉네임 수정

module.exports = router;