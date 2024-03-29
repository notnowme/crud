import express, { Express, NextFunction, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';

import swaggerUi from 'swagger-ui-express';
import { openapiSpec } from './lib/swagger';


const app: Express = express();

// cors 허용
app.use(cors());

// 헤더 보호
app.use(helmet());

// application/json 형식으로 온 걸 파싱
app.use(express.json());

// application/x-www-from-urlencoded 형식으로 온 걸 파싱
app.use(express.urlencoded({extended: false}));


const port = 4000;

app.get('/', (req, res) => {
    res.send('CRUD API SERVER...').status(200);
});

app.listen(port, () => {
    console.log('server is running...');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

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


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('index', err);
    return res.status(400).json({ ok: false, message: 'Bad request' });
});

app.all('*', (req, res) => {
    res.json({ok: false, message: 'Method Not Allowed'}).status(405);
})