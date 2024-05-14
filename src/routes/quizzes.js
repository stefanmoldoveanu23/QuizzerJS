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

/**
 * @swagger
 * /quizzes/{id}:
 *   get:
 *     description: Get quiz from id
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the quiz to get
 *     responses:
 *       200:
 *         description: quiz
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/quiz'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .get(quizzesController.getQuiz);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     description: Delete a quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Numeric ID of quiz to be deleted
 *         required: true
 *     responses:
 *       204:
 *         description: Quiz deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .delete(quizzesController.deleteQuiz);

export default router;