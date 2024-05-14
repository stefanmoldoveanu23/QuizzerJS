import questionsService from '../services/questions.js';

const createQuestion = async (req, res, next) => {
    try {
        const result = await questionsService.createQuestion(req.body);

        res.status(201).send(result);
    } catch (err) {
        next(err);
    }
}

const getQuestion = async (req, res, next) => {
    try {
        const result = await questionsService.getQuestion(+req.params.id);

        res.status(200).send(result);
    } catch (err) {
        next(err);
    }
}

const deleteQuestion = async (req, res, next) => {
    try {
        await questionsService.deleteQuestion(+req.params.id);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

export default {
    createQuestion,
    getQuestion,
    deleteQuestion
}