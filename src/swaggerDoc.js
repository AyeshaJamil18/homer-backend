"use strict";

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        info: {
            title: 'Homer Backend API',
            version: '0.0.1',
            description: 'Get the good stuff'
        },
        host: 'localhost:3000',
        basePath: '/',
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    name: 'Authorization',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    in: 'header'
                }
            }
        }
    },
    apis: ['./**/routes/*.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.use('/api-docs.json', function (req, res) {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    })
};