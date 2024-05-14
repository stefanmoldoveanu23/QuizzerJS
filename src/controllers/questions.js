import questionsService from '../services/questions.js';

const createQuestion = async (req, res, next) => {
    try {
        const result = await questionsService.createQuestion(req.body);

        res.status(201).send(result);
        next();
    } catch (err) {
        next(err);
    }
}

const getQuestion = async (req, res, next) => {
    try {
        const result = await questionsService.getQuestion(+req.params.id);

        res.status(201).send(result);
        next();
    } catch (err) {
        next(err);
    }
}

export default {
    createQuestion,
    getQuestion
}