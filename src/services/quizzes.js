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

const deleteQuiz = async (quizId) => {
    const result = await prisma.quiz.delete({
        where: {
            id: quizId
        }
    });

    if (!result) {
        throw new httpError(400, "No quiz with id " + quizId + ".");
    }
}

export default {
    createQuiz,
    getQuiz,
    deleteQuiz
};