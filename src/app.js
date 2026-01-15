const express = require('express');
require('dotenv').config();
const path = require('node:path');
const fs = require('node:fs'); // Ajouté pour lire les dossiers

const logger = require('./middlewares/logger');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();

// --- CONFIGURATION SWAGGER ---
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

        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: [path.join(__dirname, './v*/routes/*.js')],
};


const swaggerDocs = swaggerJsdoc(swaggerOptions);

// --- MIDDLEWARES ---
app.use(express.json());
app.use(logger);

// --- CHARGEMENT AUTOMATIQUE DES ROUTES ---
const versions = fs.readdirSync(__dirname).filter(file => {
    const filePath = path.join(__dirname, file);
    return fs.statSync(filePath).isDirectory() && /^v\d+$/.test(file);
});
// Dans ton app.js, remplace la boucle par celle-ci :
versions.forEach(version => {
    const routesPath = path.join(__dirname, version, 'routes');

    if (fs.existsSync(routesPath)) {
        fs.readdirSync(routesPath).forEach(file => {
            if (!file.endsWith('.js')) return;

            let routeName = file.replace('Routes.js', '').toLowerCase();
            if (routeName !== 'auth' && !routeName.endsWith('s')) {
                routeName += 's';
            }
            const route = require(`./${version}/routes/${file}`);
            app.use(`/api/${version}/${routeName}`, route);

            console.log(`✅ Route chargée : /api/${version}/${routeName}`);
        });
    }
});


// --- DOCS ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

module.exports = app;