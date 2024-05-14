import express from 'express';
import questionsController from '../controllers/questions.js';

const router = express.Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     description: Create a question
 *     tags: [Question]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createQuestionDTO'
 *     responses:
 *       201:
 *         description: Created a new question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/question'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/")
    .post(questionsController.createQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   get:
 *     description: Get a question from its id
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Numeric ID of the question
 *         required: true
 *     responses:
 *       200:
 *         description: Received the question
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/question'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .get(questionsController.getQuestion);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     description: Delete a question
 *     tags: [Question]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Numeric ID of the question
 *         required: true
 *     responses:
 *       204:
 *         description: Question deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .delete(questionsController.deleteQuestion);

export default router;