import express from "express";
import { checkToken } from "../lib/token";
import { boardWrite, boardGetAll, boardGetOne, boardDelete, boardModify } from "../controllers/freeBoard";

const router = express.Router();

/**
 * @swagger
 *  /api/board/free?page={no}:
 *      get:
 *          summary: 게시글 가져오기
 *          tags:
 *             - Board
 *               free
 *          parameters:
 *              - in: query
 *                name: page
 *                type: integer
 *                required: true
 *                description: 페이지 번호
 *                example: 1
 *          responses:
 *              200:
 *                  description: 게시글 정보
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 게시글 정보
 *                             properties:
 *                                ok:
 *                                   type: boolean
 *                                   description: 결과
 *                                   example: true
 *                                data:
 *                                   type: array
 *                                   description: 정보
 *                                   example: [
 *                                              {
 *                                                 "no": 43,
 *                                                 "author_no": 1,
 *                                                 "title": "제목",
 *                                                 "content": "내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           }
 *                                              }
 *                                            ]
 *                                boardCount:
 *                                   type: integer
 *                                   description: 게시글 개수
 *                                   example: 20
 *                                allCounts:
 *                                   type: integer
 *                                   description: 모든 게시글 수
 *                                   example: 43
 *              400:
 *                  description: 페이지 번호 없음
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
 *                                   example: Page No missing'
 *              404:
 *                  description: 게시글 없음
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
 *  /api/board/free:
 *      post:
 *          summary: 게시글 작성
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Board
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
 *                             title:
 *                                type: string
 *                                description: 제목
 *                                example: 제목
 *                             content:
 *                                type: string
 *                                description: 내용
 *                                example: 내용
 *          responses:
 *              201:
 *                  description: 작성된 게시글 정보
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
 *                                                 "no": 19,
 *                                                 "author_no": 1,
 *                                                 "title": "제목",
 *                                                 "content": "내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           }
 *                                              }
 *              400:
 *                  description: 제목, 내용 없음
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
 *                                   example: TITLE missing'
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
router
    .get('/', boardGetAll)
    .post('/', checkToken, boardWrite)

/**
 * @swagger
 *  /api/board/free/{no}:
 *      get:
 *          summary: 특정 게시글 가져오기
 *          tags:
 *             - Board
 *               free
 *          parameters:
 *              - in: path
 *                name: no
 *                type: integer
 *                required: true
 *                description: 페이지 번호
 *                example: 1
 *          responses:
 *              200:
 *                  description: 게시글 정보
 *                  content:
 *                      application/json:
 *                          schema:
 *                             type: object
 *                             description: 게시글 정보
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
 *                                                 "no": 43,
 *                                                 "author_no": 1,
 *                                                 "title": "제목",
 *                                                 "content": "내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           },
 *                                                 "comments": [
 *                                                              {
 *                                                                 "no": 1,
 *                                                                 "content": "댓글 내용",
 *                                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                                 "author": {
 *                                                                              "id": "test01",
 *                                                                              "nick": "테스트01"
 *                                                                           }
 *                                                              }
 *                                                             ]
 *                                              }
 *              400:
 *                  description: 게시글 번호 없음
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
 *                                   example: Board No missing'
 *              404:
 *                  description: 게시글 없음
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
 *  /api/board/free/{no}:
 *      put:
 *          summary: 특정 게시글 수정
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Board
 *               free
 *          parameters:
 *              - in: path
 *                name: no
 *                type: integer
 *                required: true
 *                description: 페이지 번호
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
 *                             title:
 *                                type: string
 *                                description: 제목
 *                                example: 수정할 제목
 *                             content:
 *                                type: string
 *                                description: 내용
 *                                example: 수정할 내용
 *          responses:
 *              200:
 *                  description: 수정된 게시글 정보
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
 *                                                 "no": 43,
 *                                                 "author_no": 1,
 *                                                 "title": "수정된 제목",
 *                                                 "content": "수정된 내용",
 *                                                 "created_at": "2024-03-28T01:48:30.473Z",
 *                                                 "updated_at": "2024-03-28T01:48:30.473Z",
 *                                                 "author": {
 *                                                              "id": "test011",
 *                                                              "nick": "테스트01"
 *                                                           }
 *                                              }
 *              400:
 *                  description: 게시글 번호 없음 혹은 제목, 내용 없음, 작성자 불일치
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
 *                                   example: Board No missing'
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
 *                  description: 게시글 없음
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
 *  /api/board/free/{no}:
 *      delete:
 *          summary: 특정 게시글 삭제
 *          security:
 *              - Authorization: []
 *          tags:
 *             - Board
 *               free
 *          parameters:
 *              - in: path
 *                name: no
 *                type: integer
 *                required: true
 *                description: 페이지 번호
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
 *                  description: 게시글 번호 없음 혹은 작성자와 일치하지 않음
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
 * 
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
 *                  description: 게시글 없음
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
    .get('/:no', boardGetOne)
    .put('/:no', checkToken, boardModify)
    .delete('/:no', checkToken, boardDelete);

module.exports = router;