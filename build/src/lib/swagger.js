"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.openapiSpec = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'CRUD API',
            version: '1.0.0',
            descriptiopn: 'CRUD API DOCS'
        },
        components: {
            securitySchemes: {
                Authorizaton: {
                    type: 'apiKey',
                    in: 'header',
                    name: 'Authorization',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        servers: [
            {
                url: 'http://localhost:4000/',
            }
        ]
    },
    apis: ['./src/controllers/*.ts', './src/api/*.ts'],
};
exports.openapiSpec = (0, swagger_jsdoc_1.default)(options);
