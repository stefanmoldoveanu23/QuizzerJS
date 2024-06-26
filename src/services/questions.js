import prisma from "../../client.js";
import httpError from "../utils/httpError.js";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";

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
        return await prisma.$transaction(async (prisma) => {
            await prisma.quiz.update({
                where: {
                    id: quizId
                },
                data: {
                    length: {
                        increment: 1
                    }
                }
            });

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

const updateQuestion = async (userId, questionId, questionInfo, image) => {
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
        await prisma.$transaction(async (prisma) => {
            await prisma.question.update({
                where: {
                    id: questionId
                },
                data: questionInfo
            });

            if (image !== undefined) {
                fs.writeFile(
                    path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/images/questions', `${questionId}.webp`),
                    image,
                    {
                        flag: 'w'
                    },
                    (err) => {
                        if (err) {
                            throw new httpError(500, err.message);
                        }
                    }
                );
            }
        });
    }
}

const deleteImage = async (userId, questionId) => {
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
    } else if (result.image === false) {
        throw new httpError(400, `There is no image to delete for question with id ${questionId}.`);
    } else {
        try {
            await prisma.$transaction(
                async (prisma) => {
                    await prisma.question.update({
                        where: {
                            id: questionId
                        },
                        data: {
                            image: false
                        }
                    });

                    fs.rm(
                        path.join(path.dirname(fileURLToPath(import.meta.url)), '../../public/images/questions', `${questionId}.webp`),
                        (err) => {
                            if (err) {
                                throw new httpError(500, err.message);
                            }
                        });
                }
            );
        } catch (err) {
            throw err;
        }
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
        await prisma.$transaction(async (prisma) => {
            await prisma.quiz.update({
                where: {
                    id: result.quizId
                },
                data: {
                    length: {
                        decrement: 1
                    }
                }
            });

            await prisma.question.delete({
                where: {
                    id: questionId
                }
            });
        });

        fs.rm(`../../public/images/questions/${questionId}.webp`, (_err) => { });
    }
}

export default {
    createQuestion,
    getQuestion,
    updateQuestion,
    deleteImage,
    deleteQuestion
}