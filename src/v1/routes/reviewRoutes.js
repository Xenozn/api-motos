const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const authMiddleware = require("../../middlewares/authMiddleware");

/**
 * @openapi
 * /api/v1/reviews:
 *   get:
 *     summary: Récupérer la liste des reviews
 *     tags:
 *       - Reviews
 *     responses:
 *       '200':
 *         description: Succès
 *       '500':
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/v1/reviews:
 *   get:
 *     summary: Récupérer la liste des reviews avec pagination et filtres
 *     tags: [Reviews]
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
 *     responses:
 *       200:
 *         description: Liste paginée des reviews
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
 *                       description:
 *                         type: string
 *                         example: Description
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   get:
 *     summary: Récupérer un review par ID
 *     tags: [Reviews]
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
 *         description: Review trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès refusé
 *       404:
 *         description: Review non trouvé
 */
router.get('/', authMiddleware, reviewController.getAllReviews);
router.get('/:id', authMiddleware, reviewController.getReviewById);


/**
 * @swagger
 * components:
 *   schemas:
 *     Review:
 *       type: object
 *       required:
 *         - comment
 *       properties:
 *         comment:
 *           type: string
 *           example: "Super service !"
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */


/**
 * @swagger
 * /api/v1/reviews:
 *   post:
 *     summary: Créer un nouvel avis
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Review'
 *     responses:
 *       201:
 *         description: Avis créé
 *       401:
 *         description: Non authentifié
 */
router.post('/', authMiddleware, reviewController.createReview);

/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   delete:
 *     summary: Supprimer un avis
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'avis à supprimer
 *     responses:
 *       200:
 *         description: Avis supprimé
 *       404:
 *         description: Avis non trouvé
 */
router.delete('/:id', authMiddleware, reviewController.deleteReview);


/**
 * @swagger
 * /api/v1/reviews/{id}:
 *   put:
 *     summary: Mettre à jour un avis
 *     description: |
 *       Permet de modifier un avis existant.
 *       Seul le **propriétaire de l’avis** ou un **administrateur** peut effectuer cette action.
 *     tags:
 *       - Reviews
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Identifiant de l’avis
 *         schema:
 *           type: integer
 *           example: 12
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               comment:
 *                 type: string
 *                 description: Nouveau commentaire de l’avis
 *                 example: "Très bonne moto, confortable et maniable."
 *     responses:
 *       200:
 *         description: Avis mis à jour avec succès
 *       403:
 *         description: Accès refusé (droits insuffisants)
 *       404:
 *         description: Avis introuvable
 */
router.put('/:id', authMiddleware, reviewController.updateReview);

module.exports = router;