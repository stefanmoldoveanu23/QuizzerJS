import prisma from "../../client.js";
import httpError from "../utils/httpError.js";

const createQuestion = async (userId, questionInfo) => {
    const { quizId, ...question } = questionInfo;

    const quiz = await prisma.quiz.findUnique({
        where: {
            id: quizId
        }
    });

    if (!quiz) {
        throw new httpError(400, "No quiz with id " + quizId + ".");
    } else if (quiz.userId !== userId) {
        throw new httpError(403, `You are not authorized to create question on quiz with id ${quizId}.`);
    } else {
        return await prisma.question.create({
            data: {
                ...question,
                Quiz: {
                    connect: {
                        id: quizId
                    }
                }
            }
        });
    }
}

const getQuestion = async (questionId) => {
    const result = await prisma.question.findUnique({
        where: {
            id: questionId
        }
    });

    if (result) {
        return result;
    } else {
        throw new httpError(400, "No question with id " + questionId + ".");
    }
}

const updateQuestion = async (userId, questionId, questionInfo) => {
    const result = await prisma.question.findUnique({
        where: {
            id: questionId
        },
        include: {
            Quiz: true
        }
    });

    if (!result) {
        throw new httpError(400, "No question with id " + questionId + ".");
    } else if (result.Quiz.userId !== userId) {
        throw new httpError(403, `You are not authorized to delete question with id ${questionId}.`);
    } else {
        await prisma.question.update({
            where: {
                id: questionId
            },
            data: questionInfo
        });
    }
}

const deleteQuestion = async (userId, questionId) => {
    const result = await prisma.question.findUnique({
        where: {
            id: questionId
        },
        include: {
            Quiz: true
        }
    });

    if (!result) {
        throw new httpError(400, `No question with id ${questionId}.`);
    } else if (result.Quiz.userId !== userId) {
        throw new httpError(403, `You are not authorized to delete question with id ${questionId}.`);
    } else {
        await prisma.question.delete({
            where: {
                id: questionId
            }
        });
    }
}

export default {
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteQuestion
}