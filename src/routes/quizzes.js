import express from 'express';
import quizzesController from '../controllers/quizzes.js'
import jwtDecoder from '../middlewares/jwt-decoder.js';
import validate from '../middlewares/validate.js';
import quizzesValidator from '../validations/quizzes.js';

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
 *       403:
 *         description: Forbidden
 *       500:
 *         description: General error
 */
router
    .route("/")
    .post(jwtDecoder, validate(quizzesValidator.createQuizzes), quizzesController.createQuiz);

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
 *       201:
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
 * /quizzes/{id}/questions:
 *   get:
 *     description: Get all questions for a quiz
 *     tags: [Quiz]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the quiz to be queried
 *     responses:
 *       201:
 *         description: Successfully retrieved all questions for the quiz
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/question'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/:id/questions")
    .get(quizzesController.getQuestions);

/**
 * @swagger
 * /quizzes/{id}:
 *   patch:
 *     description: Update a quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of quiz to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateQuizDTO'
 *     responses:
 *       204:
 *         description: Quiz updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied
 *       403:
 *         description: Forbidden
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .patch(jwtDecoder, validate(quizzesValidator.updateQuizzes), quizzesController.updateQuiz);

/**
 * @swagger
 * /quizzes/{id}:
 *   delete:
 *     description: Delete a quiz
 *     tags: [Quiz]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied
 *       403:
 *         description: Forbidden
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .delete(jwtDecoder, quizzesController.deleteQuiz);

export default router;