import Joi from "joi";

const createQuizzes = Joi.object({
    name: Joi.string().min(1).max(20).required(),
    description: Joi.string().max(500).required()
});

const updateQuizzes = Joi.object({
    name: Joi.string().min(1).max(20),
    description: Joi.string().max(500)
}).min(1);

export default {
    createQuizzes,
    updateQuizzes
}