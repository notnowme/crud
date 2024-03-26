import express, { Express } from 'express';
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
    res.send('Typescript').status(200);
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