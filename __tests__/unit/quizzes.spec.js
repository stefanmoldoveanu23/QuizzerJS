import quizzes from '../../src/services/quizzes.js';
import jest from 'jest-mock';
import client from '../../client.js';
import { quiz } from '../fixtures/quizzes.js';

describe("quizzes delete function", () => {
    test("should return undefined without throwing", async () => {
        const mockfindUnique = jest.fn();
        client.quiz.findUnique = mockfindUnique;
        client.quiz.findUnique.mockResolvedValue(quiz);

        const mockdelete = jest.fn();
        client.quiz.delete = mockdelete;
        client.quiz.delete.mockResolvedValue(quiz);

        await expect(quizzes.deleteQuiz(quiz.userId, quiz.id)).resolves.toBeUndefined();

        expect(client.quiz.findUnique).toHaveBeenCalledWith({
            where: {
                id: quiz.id
            }
        });

        expect(client.quiz.delete).toHaveBeenCalledWith({
            where: {
                id: quiz.id
            }
        });
    });

    test("should throw error if quiz doesn't exist", async () => {
        const mockfindUnique = jest.fn();
        client.quiz.findUnique = mockfindUnique;
        client.quiz.findUnique.mockResolvedValue(null);

        const mockdelete = jest.fn();
        client.quiz.delete = mockdelete;
        client.quiz.delete.mockResolvedValue(null);

        await quizzes.deleteQuiz(quiz.userId, quiz.id).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual(`No quiz with id ${quiz.id}.`);
        });

        expect(client.quiz.delete).not.toHaveBeenCalled();
    });

    test("should throw error if user doesn't own quiz", async () => {
        const mockfindUnique = jest.fn();
        client.quiz.findUnique = mockfindUnique;
        client.quiz.findUnique.mockResolvedValue(quiz);

        const mockdelete = jest.fn();
        client.quiz.delete = mockdelete;
        client.quiz.delete.mockResolvedValue(null);

        await quizzes.deleteQuiz(quiz.userId + 1, quiz.id).catch((err) => {
            expect(err.statusCode).toEqual(403);
            expect(err.errorMessage).toEqual(`You are not authorized to delete quiz with id ${quiz.id}.`);
        });

        expect(client.quiz.delete).not.toHaveBeenCalled();
    });
});