import questions from '../../src/services/questions.js';
import jest from 'jest-mock';
import client from '../../client.js';
import question from '../fixtures/questions.js';
import fs from 'fs';

describe("questions delete image function", () => {
    test("should return undefined without throwing", async () => {
        const mockPrisma = {
            $transaction: jest.fn(async (fn) => fn(mockPrisma)),
            question: {
                findUnique: jest.fn(async (_1, _2) => question.with_image),
                update: jest.fn(async (_1, _2) => question.without_image)
            }
        };

        client.$transaction = mockPrisma.$transaction;
        client.question.findUnique = mockPrisma.question.findUnique;
        client.question.update = mockPrisma.question.update;

        const mockrm = jest.fn((_1, _2) => { });
        fs.rm = mockrm;

        await expect(questions.deleteImage(question.with_image.Quiz.userId, question.with_image.id)).resolves.toBeUndefined();

        expect(client.question.findUnique).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id,
            },
            include: {
                Quiz: true
            }
        });

        expect(client.$transaction).toHaveBeenCalledTimes(1);

        expect(client.question.update).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id
            },
            data: {
                image: false
            }
        });

        expect(fs.rm).toHaveBeenCalledTimes(1);
    });

    test("should throw error when question doesn't exist", async () => {
        const mockPrisma = {
            $transaction: jest.fn(async (_) => null),
            question: {
                findUnique: jest.fn(async (_1, _2) => null),
                update: jest.fn(async (_1, _2) => null)
            }
        };

        client.$transaction = mockPrisma.$transaction;
        client.question.findUnique = mockPrisma.question.findUnique;
        client.question.update = mockPrisma.question.update;

        const mockrm = jest.fn((_1, _2) => null);
        fs.rm = mockrm;

        await questions.deleteImage(question.with_image.Quiz.userId, question.with_image.id).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual(`No question with id ${question.with_image.id}.`);
        });

        expect(client.$transaction).not.toHaveBeenCalled();

        expect(client.question.update).not.toHaveBeenCalled();

        expect(fs.rm).not.toHaveBeenCalled();
    });

    test("should throw error when the user doesn't own the question", async () => {
        const mockPrisma = {
            $transaction: jest.fn(async (_) => null),
            question: {
                findUnique: jest.fn(async (_1, _2) => question.with_image),
                update: jest.fn(async (_1, _2) => null)
            }
        };

        client.$transaction = mockPrisma.$transaction;
        client.question.findUnique = mockPrisma.question.findUnique;
        client.question.update = mockPrisma.question.update;

        const mockrm = jest.fn((_1, _2) => null);
        fs.rm = mockrm;

        await questions.deleteImage(question.with_image.Quiz.userId + 1, question.with_image.id).catch((err) => {
            expect(err.statusCode).toEqual(403);
            expect(err.errorMessage).toEqual(`You are not authorized to delete question with id ${question.with_image.id}.`);
        });

        expect(client.question.findUnique).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id,
            },
            include: {
                Quiz: true
            }
        });

        expect(client.$transaction).not.toHaveBeenCalled();

        expect(client.question.update).not.toHaveBeenCalled();

        expect(fs.rm).not.toHaveBeenCalled();
    });

    test("should throw error when the question doesn't have an image", async () => {
        const mockPrisma = {
            $transaction: jest.fn(async (_) => null),
            question: {
                findUnique: jest.fn(async (_1, _2) => question.without_image),
                update: jest.fn(async (_1, _2) => null)
            }
        };

        client.$transaction = mockPrisma.$transaction;
        client.question.findUnique = mockPrisma.question.findUnique;
        client.question.update = mockPrisma.question.update;

        const mockrm = jest.fn((_1, _2) => null);
        fs.rm = mockrm;

        await questions.deleteImage(question.with_image.Quiz.userId, question.with_image.id).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual(`There is no image to delete for question with id ${question.without_image.id}.`);
        });

        expect(client.question.findUnique).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id,
            },
            include: {
                Quiz: true
            }
        });

        expect(client.$transaction).not.toHaveBeenCalled();

        expect(client.question.update).not.toHaveBeenCalled();

        expect(fs.rm).not.toHaveBeenCalled();
    });

    test("should throw error when the image deletion returns error", async () => {
        const mockPrisma = {
            $transaction: jest.fn(async (fn) => fn(mockPrisma)),
            question: {
                findUnique: jest.fn(async (_1, _2) => question.with_image),
                update: jest.fn(async (_1, _2) => question.without_image)
            }
        };

        client.$transaction = mockPrisma.$transaction;
        client.question.findUnique = mockPrisma.question.findUnique;
        client.question.update = mockPrisma.question.update;

        const mockrm = jest.fn((_filePath, callback) => callback({ message: "Some error" }));
        fs.rm = mockrm;

        await questions.deleteImage(question.with_image.Quiz.userId, question.with_image.id).catch((err) => {
            expect(err.statusCode).toEqual(500);
            expect(err.errorMessage).toEqual("Some error");
        });

        expect(client.question.findUnique).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id,
            },
            include: {
                Quiz: true
            }
        });

        expect(client.$transaction).toHaveBeenCalledTimes(1);

        expect(client.question.update).toHaveBeenCalledWith({
            where: {
                id: question.with_image.id
            },
            data: {
                image: false
            }
        });

        expect(fs.rm).toHaveBeenCalledTimes(1);
    });
});