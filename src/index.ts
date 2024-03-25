import express, { Express } from 'express';
import cors from 'cors';

import swaggerUi, { SwaggerOptions } from 'swagger-ui-express';
import swaggerJSDoc, { SwaggerDefinition } from 'swagger-jsdoc';

const options: SwaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRUD API',
            version: '1.0.0',
            descriptiopn: 'CRUD API DOCS'
        },
    },
    apis: ['./src/controllers/*.js'],
};

const openapiSpec = swaggerJSDoc(options);


const app: Express = express();

// cors 허용
app.use(cors());

// application/x-www-from-urlencoded 형식으로 온 걸 파싱
app.use(express.urlencoded({extended: false}));

// application/json 형식으로 온 걸 파싱
app.use(express.json());

const port = 4000;

app.get('/', (req, res) => {
    res.send('Typescript').status(200);
});

app.listen(port, () => {
    console.log('server is running...');
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));

// /api/user 라우터
const apiUser = require('./api/user');
app.use('/api/user', apiUser);