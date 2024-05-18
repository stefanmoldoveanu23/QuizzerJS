import Joi from 'joi';

const createQuestions = Joi.object({
    quizId: Joi.number().integer().greater(-1),
    type: Joi.string().valid("singleChoice", "multipleChoice", "association", "itemSort").required(),
    position: Joi.number().integer().greater(-1).required(),
    statement: Joi.string().max(1000).required(),
    choices: Joi.array().items(Joi.string().required()).min(1).required(),
    answer: Joi.array().items(Joi.number().integer().greater(-1).required()).required()
});

const updateQuestions = Joi.object({
    type: Joi.string().valid("singleChoice", "multipleChoice", "association", "itemSort"),
    position: Joi.number().integer().greater(-1),
    statement: Joi.string().max(1000),
    choices: Joi.array().items(Joi.string().required()).min(1),
    answer: Joi.array().items(Joi.number().integer().greater(-1).required())
}).min(1);

export default {
    createQuestions,
    updateQuestions
}