import express from 'express';
import quizzesController from '../controllers/quizzes.js'
import jwtDecoder from '../middlewares/jwt-decoder.js';

const router = express.Router();

/**
 * @swagger
 * /quizzes:
 *   post:
 *     description: Create a new quiz
 *     security:
 *       - bearerAuth: []
 *     tags: [Quiz]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createQuizDTO'
 *     responses:
 *       201:
 *         description: Created quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/quiz'
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied
 *       500:
 *         description: General error
 */
router
    .route("/")
    .post(jwtDecoder, quizzesController.createQuiz);

export default router;