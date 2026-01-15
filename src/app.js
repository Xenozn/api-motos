const express = require('express');
require('dotenv').config();
const path = require('node:path');

const logger = require('./middlewares/logger');
const motoRoutesV1 = require('./v1/routes/motoRoutes');
const authRoutes = require('./v1/routes/authRoutes');
const userRoutesV1 = require('./v1/routes/userRoutes');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// Swagger config
const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Moto API Documentation',
            version: '1.0.0',
            description: 'Documentation interactive de mon API de motos',
        },
        servers: [{ url: 'http://localhost:3000' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: [path.join(__dirname, './v1/routes/*.js')],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Middlewares
app.use(express.json());
app.use(logger);

// Routes
app.use('/api/v1/motos', motoRoutesV1);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutesV1);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;
