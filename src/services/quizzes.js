import prisma from "../../client.js";
import httpError from "../utils/httpError.js";

const createQuiz = async (user_id, quizInfo) => {
    const { ...quiz } = quizInfo;

    const result = await prisma.quiz.create({
        data: {
            ...quiz,
            User: {
                connect: {
                    id: user_id
                }
            }
        }
    });

    return result;
}

const getQuiz = async (quizId) => {
    const result = await prisma.quiz.findUnique({
        where: {
            id: quizId
        }
    });

    if (result) {
        return result;
    } else {
        throw new httpError(400, "No quiz with id " + quizId + ".");
    }
}

const updateQuiz = async (userId, quizId, quizInfo) => {
    const result = await prisma.quiz.findUnique({
        where: {
            id: quizId
        }
    });

    if (!result) {
        throw new httpError(400, `No quiz with id ${quizId}.`);
    } else if (result.userId !== userId) {
        throw new httpError(403, `You are not authorized to update quiz with id ${quizId}.`);
    } else {
        await prisma.quiz.update({
            where: {
                id: quizId
            },
            data: quizInfo
        });
    }
}

const deleteQuiz = async (userId, quizId) => {
    const result = await prisma.quiz.findUnique({
        where: {
            id: quizId
        }
    });

    if (!result) {
        throw new httpError(400, `No quiz with id ${quizId}.`);
    } else if (result.userId != userId) {
        throw new httpError(403, `You are not authorized to delete quiz with id ${quizId}.`);
    } else {
        await prisma.quiz.delete({
            where: {
                id: quizId
            }
        });
    }
}

export default {
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz
};