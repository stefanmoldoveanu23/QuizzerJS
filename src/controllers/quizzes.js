import quizzesServices from '../services/quizzes.js'

const createQuiz = async (req, res, next) => {
    try {
        const result = await quizzesServices.createQuiz(req.user_id, req.body);

        res.status(201).send(result);
    } catch (err) {
        next(err);
    }
}

const getQuiz = async (req, res, next) => {
    try {
        const result = await quizzesServices.getQuiz(+req.params.id);

        res.status(201).send(result);
    } catch (err) {
        next(err);
    }
}

const updateQuiz = async (req, res, next) => {
    try {
        await quizzesServices.updateQuiz(req.user_id, +req.params.id, req.body);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

const deleteQuiz = async (req, res, next) => {
    try {
        await quizzesServices.deleteQuiz(req.user_id, +req.params.id);

        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

const getQuestions = async (req, res, next) => {
    try {
        const result = await quizzesServices.getQuestions(+req.params.id);

        res.status(201).send(result);
    } catch (err) {
        next(err);
    }
}

export default {
    createQuiz,
    getQuiz,
    updateQuiz,
    deleteQuiz,
    getQuestions
};