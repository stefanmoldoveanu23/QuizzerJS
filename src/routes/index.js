import express from "express";
import usersRouter from "./users.js";
import quizzesRouter from "./quizzes.js";
import questionsRouter from "./questions.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/quizzes", quizzesRouter);
router.use("/questions", questionsRouter);

export default router;
