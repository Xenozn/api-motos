const express = require('express');
const router = express.Router();
const motoController = require('../controllers/motoController');
const authMiddleware = require("../../middlewares/authMiddleware");
const {isAdmin} = require("../../middlewares/roleMiddleware");
const userController = require("../controllers/userController");

/**
 * @swagger
 * /api/v1/motos:
 *   get:
 *     summary: Récupérer la liste des motos avec pagination et filtres
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: Numéro de la page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           example: 10
 *         description: Nombre d’éléments par page
 *       - in: query
 *         name: marque
 *         schema:
 *           type: string
 *           example: Yamaha
 *         description: Filtrer par nom de marque
 *       - in: query
 *         name: minCylindree
 *         schema:
 *           type: integer
 *           example: 500
 *         description: Cylindrée minimale
 *       - in: query
 *         name: maxCylindree
 *         schema:
 *           type: integer
 *           example: 1000
 *         description: Cylindrée maximale
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           example: MT
 *         description: Recherche partielle sur le modèle
 *     responses:
 *       200:
 *         description: Liste paginée des motos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 total_records:
 *                   type: integer
 *                   example: 100
 *                 current_page:
 *                   type: integer
 *                   example: 1
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       modele:
 *                         type: string
 *                         example: MT-07
 *                       cylindree:
 *                         type: integer
 *                         example: 689
 *                       brand:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                             example: 2
 *                           name:
 *                             type: string
 *                             example: Yamaha
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/', authMiddleware, motoController.getAllMotos);

/**
 * @swagger
 * /api/v1/motos/{id}:
 *   get:
 *     summary: Récupérer une moto par ID
 *     tags: [Motos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Moto trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id',authMiddleware, motoController.getMotoById);

module.exports = router;