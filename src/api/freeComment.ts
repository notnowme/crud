import express from "express";
import { checkToken } from "../lib/token";
import { commentFreeDelete, commentFreeModify, commentFreeWrite } from "../controllers/freeComment";

const router = express.Router();


/**
 * @swagger
 *  /api/comment/free:
 *      post:
 *          summary: 댓글 작성
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Comment
 *               free
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                required: true
 *                schema:
 *                   type: string
 *                description: token 필요
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             boardNo:
 *                                type: integer
 *                                description: 게시글 번호
 *                                example: 1
 *                             content:
 *                                type: string
 *                                description: 내용
 *                                example: 내용
 *          responses:
 *              201:
 *                  description: 작성된 댓글 정보
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 작성된 게시글 정보
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
 *                                                 "board_no": 1,
 *                                                 "author_no": 1,
 *                                                 "content": "내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           }
 *                                              }
 *              400:
 *                  description: 내용 혹은 게시글 번호 없음
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
 *                                   example: Board No missing
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
router.post('/', checkToken, commentFreeWrite);

/**
 * @swagger
 *  /api/comment/free/{no}:
 *      patch:
 *          summary: 댓글 수정
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Comment
 *               free
 *          parameters:
 *              - in: header
 *                name: Authorization
 *                required: true
 *                schema:
 *                   type: string
 *                description: token 필요
 *              - in: path
 *                name: no
 *                type: integer
 *                required: true
 *                description: 댓글 번호
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                             content:
 *                                type: string
 *                                description: 내용
 *                                example: 내용
 *          responses:
 *              201:
 *                  description: 수정된 댓글 정보
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 수정된 게시글 정보
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
 *                                                 "board_no": 1,
 *                                                 "author_no": 1,
 *                                                 "content": "내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           }
 *                                              }
 *              400:
 *                  description: 내용 없음 혹은 작성자 불일치
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
 *                                   example: No Author
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
 *              404:
 *                  description: 댓글 없음
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
 *                                   example: Not Found
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
 *  /api/comment/free/{no}:
 *      delete:
 *          summary: 댓글 삭제
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Comment
 *               free
 *          parameters:
 *              - in: path
 *                name: no
 *                type: integer
 *                required: true
 *                description: 댓글 번호
 *              - in: header
 *                name: Authorization
 *                required: true
 *                schema:
 *                   type: string
 *                description: token 필요
 *          responses:
 *              200:
 *                  description: 삭제 완료
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 삭제 완료
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 결과
 *                                   example: true
 *              400:
 *                  description: 댓글 번호 없음 혹은 작성자와 일치하지 않음
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
 *                                   example: No Author
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
 *              404:
 *                  description: 댓글 없음
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
 *                                   example: Not Found
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
    .patch('/:no', checkToken, commentFreeModify)
    .delete('/:no', checkToken, commentFreeDelete);

module.exports = router;