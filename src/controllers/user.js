"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @swagger
 * paths:
 *  /api/user:
 *    get:
 *      summary: "유저 데이터 전체조회"
 *      description: "서버에 데이터를 보내지 않고 Get방식으로 요청"
 *      tags: [User]
 *      responses:
 *        "200":
 *          description: 전체 유저 정보
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    result:
 *                      type: object
 *                      example:
 *                          [
 *                            { "id": 1, "name": "유저1" },
 *                            { "id": 2, "name": "유저2" },
 *                            { "id": 3, "name": "유저3" },
 *                          ]
 *        "400":
 *          description: 실패
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    result:
 *                      type: object
 *                      example:
 *                          [
 *                             {"message": "실패"},
 *                          ]
 *
 */
const root = (req, res) => {
    res.send('root로 들어옴22').status(200);
};
/**
 * @swagger
 * /api/user/{user_id}:
 *  get:
 *    summary: "특정 유저조회 Path 방식"
 *    description: "요청 경로에 값을 담아 서버에 보낸다."
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: user_id
 *        required: true
 *        description: 유저 아이디
 *        schema:
 *          type: string
 *    responses:
 *      "200":
 *        description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (유저 조회)
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                ok:
 *                  type: boolean
 *                users:
 *                  type: object
 *                  example: [{ "id": 1, "name": "유저1" }]
 */
const getUserInfo = (req, res) => {
    console.log(req.params.id);
    res.send('test').status(200);
};
function routes() {
    return {
        root: (req, res) => {
            root(req, res);
        },
        getUserInfo: (req, res) => {
            getUserInfo(req, res);
        }
    };
}
exports.default = routes();
