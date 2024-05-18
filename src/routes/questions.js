import express from 'express';
import questionsController from '../controllers/questions.js';
import jwtDecoder from '../middlewares/jwt-decoder.js';
import imageProcessor from '../middlewares/image-processor.js';
import validate from '../middlewares/validate.js';
import questionsValidator from '../validations/questions.js';

const router = express.Router();

/**
 * @swagger
 * /questions:
 *   post:
 *     description: Create a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied
 *       500:
 *         description: General error
 */
router
    .route("/")
    .post(jwtDecoder, validate(questionsValidator.createQuestions), questionsController.createQuestion);

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
 *   patch:
 *     description: Update a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of the question to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateQuestionDTO'
 *     responses:
 *       204:
 *         description: Successfully updated question
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
    .patch(jwtDecoder, validate(questionsValidator.updateQuestions), questionsController.updateQuestion);

/**
 * @swagger
 * /questions/{id}/image:
 *   put:
 *     description: Create or update question image
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of question to be updated
 *     requestBody:
 *       required: true
 *       content:
 *         image/*:
 *           schema:
 *             type: string
 *             format: base64
 *     responses:
 *       204:
 *         description: Successfully set question image
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied
 *       403:
 *         description: Forbidden
 *       415:
 *         description: Unsupported media type
 *       500:
 *         description: General error
 */
router
    .route("/:id/image")
    .put(jwtDecoder, imageProcessor, questionsController.updateQuestion);

/**
 * @swagger
 * /questions/{id}/image:
 *   delete:
 *     description: Delete a questions image
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of question to be updated
 *     responses:
 *       204:
 *         description: Successfully deleted the image for this question
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
    .route("/:id/images")
    .delete(jwtDecoder, questionsController.deleteImage);

/**
 * @swagger
 * /questions/{id}:
 *   delete:
 *     description: Delete a question
 *     tags: [Question]
 *     security:
 *       - bearerAuth: []
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
 *       401:
 *         description: Access denied
 *       500:
 *         description: General error
 */
router
    .route("/:id")
    .delete(jwtDecoder, questionsController.deleteQuestion);

export default router;