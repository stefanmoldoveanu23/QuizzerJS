import express from "express";
import validate from "../middlewares/validate.js";
import usersValidations from "../validations/users.js";
import usersController from "../controllers/users.js";

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
  .post(validate(usersValidations.createUsers), usersController.createUser);

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
 *       200:
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
 * /users/{id}:
 *   delete:
 *     description: Delete a user
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         description: Numeric ID of user to be deleted
 *         requested: true
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: General error
 */
router
  .route("/:id")
  .delete(usersController.deleteUser);

export default router;