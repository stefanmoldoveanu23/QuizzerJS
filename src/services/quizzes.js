import prisma from "../../client.js";

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

export default {
    createQuiz
};