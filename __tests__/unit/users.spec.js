import users from '../../src/services/users.js';
import jest from 'jest-mock';
import client from '../../client.js';
import user from '../fixtures/users.js';
import jwt from 'jsonwebtoken';
import mailer from '../../src/utils/mailer.js';

describe("users login function", () => {
    test("should return correct jwt code", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(user.verified);

        let jwt_token = await users.loginUser({ email: user.verified.email, password: 'Password1!' });
        let decoded = jwt.verify(jwt_token, process.env.JWT_SECRET);
        expect(decoded.user_id).toEqual(user.verified.id);

        expect(client.user.findUnique).toHaveBeenCalledWith({
            where: {
                email: user.verified.email
            }
        })
    });

    test("should throw error if email not found", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(null);

        await users.loginUser({ email: user.verified.email, password: 'Password1!' }).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual("User with email characterme1001@gmail.com does not exist.");
        });
    });

    test("should throw error if the email is not verified", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(user.unverified);

        await users.loginUser({ email: user.unverified.email, password: 'Password1!' }).catch((err) => {
            expect(err.statusCode).toEqual(403);
            expect(err.errorMessage).toEqual("Your email address is not verified yet.");
        });
    });

    test("should throw error if the password does not match", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(user.verified);

        await users.loginUser({ email: user.verified.email, password: 'Password2!' }).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual("Incorrect credentials.");
        });
    });
});

describe("users create function", () => {
    test("should create and return new user", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(null);

        const mockupdate = jest.fn();
        client.user.update = mockupdate;
        client.user.update.mockResolvedValue(null);

        const mockcreate = jest.fn();
        client.user.create = mockcreate;
        client.user.create.mockResolvedValue(user.unverified);

        const mocksendMail = jest.fn();
        mailer.sendMail = mocksendMail;
        mailer.sendMail.mockResolvedValue(null);

        await expect(users.createUser(user.registration)).resolves.toEqual(user.unverified);

        expect(client.user.findUnique).toHaveBeenCalledWith({
            where: {
                email: user.registration.email
            }
        });

        expect(client.user.update).not.toHaveBeenCalled();

        expect(client.user.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                verified: false,
                ...user.registration
            })
        });

        expect(mailer.sendMail).toHaveBeenCalledTimes(1);
    });

    test("should update and return the user if email is the same but unverified", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(user.unverified);

        const mockupdate = jest.fn();
        client.user.update = mockupdate;
        client.user.update.mockResolvedValue(user.unverified);

        const mockcreate = jest.fn();
        client.user.create = mockcreate;
        client.user.create.mockResolvedValue(null);

        const mocksendMail = jest.fn();
        mailer.sendMail = mocksendMail;
        mailer.sendMail.mockResolvedValue(null);

        await expect(users.createUser(user.registration)).resolves.toEqual(user.unverified);

        expect(client.user.findUnique).toHaveBeenCalledWith({
            where: {
                email: user.registration.email
            }
        });

        expect(client.user.update).toHaveBeenCalledWith({
            where: {
                email: user.registration.email
            },
            data: {
                verified: false,
                ...user.registration
            }
        });

        expect(client.user.create).not.toHaveBeenCalled();

        expect(mailer.sendMail).not.toHaveBeenCalled();
    });

    test("should throw if that email has already been verified", async () => {
        const mockfindUnique = jest.fn();
        client.user.findUnique = mockfindUnique;
        client.user.findUnique.mockResolvedValue(user.verified);

        const mockupdate = jest.fn();
        client.user.update = mockupdate;
        client.user.update.mockResolvedValue(null);

        const mockcreate = jest.fn();
        client.user.create = mockcreate;
        client.user.create.mockResolvedValue(null);

        const mocksendMail = jest.fn();
        mailer.sendMail = mocksendMail;
        mailer.sendMail.mockResolvedValue(null);

        await users.createUser(user.registration).catch((err) => {
            expect(err.statusCode).toEqual(400);
            expect(err.errorMessage).toEqual(`User with email ${user.registration.email} already exists.`);
        });

        expect(client.user.findUnique).toHaveBeenCalledWith({
            where: {
                email: user.registration.email
            }
        });

        expect(client.user.update).not.toHaveBeenCalled();

        expect(client.user.create).not.toHaveBeenCalled();

        expect(mailer.sendMail).not.toHaveBeenCalled();
    });
});