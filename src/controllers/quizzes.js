import quizzesServices from '../services/quizzes.js'

const createQuiz = async (req, res, next) => {
    try {
        const result = await quizzesServices.createQuiz(req.user_id, req.body);

        res.status(201).send(result);
    } catch (err) {
        next(err);
    }
}

export default {
    createQuiz
};