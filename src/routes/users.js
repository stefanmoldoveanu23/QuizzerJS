import express from "express";
import validate from "../middlewares/validate.js";
import usersValidations from "../validations/users.js";
import usersController from "../controllers/users.js";
import jwtDecoder from "../middlewares/jwt-decoder.js";
import encryptPassword from "../middlewares/encrypt-password.js";

const router = express.Router();

/**
 * @swagger
 * /users:
 *   post:
 *     description: Create users
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/createUserDTO'
 *     responses:
 *       201:
 *         description: Created user
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/user'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
  .route("/")
  .post(validate(usersValidations.createUsers), encryptPassword, usersController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     description: Log a user in
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/loginUserDTO'
 *     responses:
 *       200:
 *         description: Logged user in
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: cool_token
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
  .route("/login")
  .post(validate(usersValidations.loginUsers), usersController.loginUser);

/**
 * @swagger
 * /users/verify:
 *   patch:
 *     description: Verify an email address
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/email_verification'
 *     responses:
 *       200:
 *         description: Successfully verified email address
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/user'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
  .route("/verify")
  .patch(usersController.verifyEmail);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     description: Get users by id
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Numeric ID of the user to get
 *     responses:
 *       201:
 *         description: user
 *         content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/user'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router.route("/:id").get(usersController.getUser);

/**
 * @swagger
 * /users/{id}/quizzes:
 *   get:
 *     description: Get all quizzes that belong to a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Numeric ID of user to query
 *     responses:
 *       201:
 *         description: Successfully retrieved all quizzes belonging to that user
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 $ref: '#/components/schemas/quiz'
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
  .route("/:id/quizzes")
  .get(usersController.getQuizzes);

/**
 * @swagger
 * /users:
 *   patch:
 *     description: Update a users data
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/updateUserDTO'
 *     responses:
 *       204:
 *         description: Updated user data successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied
 *       500:
 *         description: General error
 */
router
  .route("/")
  .patch(jwtDecoder, validate(usersValidations.updateUsers), encryptPassword, usersController.updateUser);

/**
 * @swagger
 * /users:
 *   delete:
 *     description: Delete a user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Access denied
 *       500:
 *         description: General error
 */
router
  .route("/")
  .delete(jwtDecoder, usersController.deleteUser);

export default router;