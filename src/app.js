const express = require('express');
require('dotenv').config();
const logger = require('./middlewares/logger');
const motoRoutesV1 = require('./v1/routes/motoRoutes');
const authRoutes = require('./v1/routes/authRoutes');
const authMiddleware = require('./middlewares/authMiddleware');
const userRoutesV1 = require('./v1/routes/userRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const path = require('path');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Moto API Documentation',
            version: '1.0.0',
            description: 'Documentation interactive de mon API de motos',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
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
    // Chemin vers les fichiers contenant les annotations
    apis: ['./src/v1/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
const app = express();

// Middlewares globaux
app.use(express.json());
app.use(logger);

// Versioning des routes
app.use('/api/v1/motos', motoRoutesV1);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutesV1);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});