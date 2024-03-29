"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./lib/swagger");
const app = (0, express_1.default)();
// cors 허용
app.use((0, cors_1.default)());
// 헤더 보호
app.use((0, helmet_1.default)());
// application/json 형식으로 온 걸 파싱
app.use(express_1.default.json());
// application/x-www-from-urlencoded 형식으로 온 걸 파싱
app.use(express_1.default.urlencoded({ extended: false }));
const port = 4000;
app.get('/', (req, res) => {
    res.send('CRUD API SERVER...').status(200);
});
app.listen(port, () => {
    console.log('server is running...');
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.openapiSpec));
// users 라우터
const apiUser = require("./api/users");
app.use('/api/users', apiUser);
// auth 라우터
const apiAuth = require("./api/auth");
app.use('/api/auth', apiAuth);
// freeboard 라우터
const apiFreeBoard = require("./api/freeBoard");
app.use('/api/board/free', apiFreeBoard);
// freeComment 라우터
const apiFreeComment = require("./api/freeComment");
app.use('/api/comment/free', apiFreeComment);
// freeboard 라우터
const apiQnaBoard = require("./api/qnaBoard");
app.use('/api/board/qna', apiQnaBoard);
// freeComment 라우터
const apiQnaComment = require("./api/qnaComment");
app.use('/api/comment/qna', apiQnaComment);
// search 라우터
const apiSearch = require("./api/search");
app.use('/api/search', apiSearch);
app.use((err, req, res, next) => {
    console.error('index', err);
    return res.status(400).json({ ok: false, message: 'Bad request' });
});
app.all('*', (req, res) => {
    res.json({ ok: false, message: 'Method Not Allowed' }).status(405);
});
