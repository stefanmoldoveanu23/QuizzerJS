import express from "express";
import usersRouter from "./users.js";
import quizzesRouter from "./quizzes.js";

const router = express.Router();

router.use("/users", usersRouter);
router.use("/quizzes", quizzesRouter);

export default router;
