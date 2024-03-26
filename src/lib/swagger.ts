import { SwaggerOptions } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const options: SwaggerOptions = {
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

export const openapiSpec = swaggerJSDoc(options);