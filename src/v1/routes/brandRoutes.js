const express = require('express');
const router = express.Router();
const brandController = require('../controllers/brandController');
const authMiddleware = require("../../middlewares/authMiddleware");
const motoController = require("../controllers/motoController");

/**
 * @openapi
 * /api/v1/brands:
 *   get:
 *     summary: Récupérer la liste des brands
 *     tags:
 *       - Brands
 *     responses:
 *       '200':
 *         description: Succès
 *       '500':
 *         description: Erreur serveur
 */


router.get('/', authMiddleware, brandController.getAllBrands);



/**
 * @swagger
 * /api/v1/brands/{id}:
 *   get:
 *     summary: Récupérer une marque par ID
 *     tags: [Brands]
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
 *         description: Brand trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/:id',authMiddleware, brandController.getBrandById);
module.exports = router;