"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRUD API',
            version: '1.0.0',
            descriptiopn: 'CRUD API DOCS'
        },
    },
    apis: ['./src/controllers/*.ts'],
};
const openapiSpec = (0, swagger_jsdoc_1.default)(options);
const app = (0, express_1.default)();
// cors 허용
app.use((0, cors_1.default)());
// application/x-www-from-urlencoded 형식으로 온 걸 파싱
app.use(express_1.default.urlencoded({ extended: false }));
// application/json 형식으로 온 걸 파싱
app.use(express_1.default.json());
const port = 4000;
app.get('/', (req, res) => {
    res.send('Typescript').status(200);
});
app.listen(port, () => {
    console.log('server is running...');
});
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(openapiSpec));
// /api/user 라우터
const apiUser = require("./api/users");
app.use('/api/user', apiUser);
