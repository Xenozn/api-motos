const express = require('express');
const router = express.Router();
const motoController = require('../controllers/motoController');


/**
 * @swagger
 * /api/v1/motos:
 *   get:
 *     summary: Récupérer la liste de toutes les motos
 *     tags: [Motos]
 *     responses:
 *       200:
 *         description: Liste des motos récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       marque:
 *                         type: string
 *                       modele:
 *                         type: string
 *                       cylindree:
 *                         type: integer
 *       500:
 *         description: Erreur serveur
 */
router.get('/', motoController.getAllMotos);

module.exports = router;