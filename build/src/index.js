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
    res.send('Typescript').status(200);
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
