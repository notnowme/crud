import express from "express";
import { searchBoard } from "../controllers/search";

const route = express.Router();
/**
 * @swagger
 *  /api/search?board={board}&cat={category}&key={keyword}&page={no}:
 *      get:
 *          summary: 게시글 검색
 *          tags:
 *             - Search
 *          parameters:
 *              - in: query
 *                name: board
 *                type: string
 *                required: true
 *                description: 게시판 타입
 *                example: free
 *              - in: query
 *                name: cat
 *                type: string
 *                required: true
 *                description: 카테고리
 *                example: title
 *              - in: query
 *                name: key
 *                type: string
 *                required: true
 *                description: 검색 키워드
 *                example: 테스트
 *              - in: query
 *                name: page
 *                type: string
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
 *                  description: 게시판 타입, 카테고리, 키워드, 페이지 번호 없음
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
route.get('/', searchBoard);

module.exports = route;