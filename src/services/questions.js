import prisma from "../../client.js";
import httpError from "../utils/httpError.js";

const createQuestion = async (questionInfo) => {
    const { quizId, ...question } = questionInfo;

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

export default {
    createQuestion,
    getQuestion
}