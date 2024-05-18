import Joi from "joi";
import { joiPasswordExtendCore } from "joi-password";
const JoiPassword = Joi.extend(joiPasswordExtendCore);

const createUsers = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().min(6).required(),
  password: JoiPassword.string().min(8).minOfSpecialCharacters(1).minOfNumeric(1).minOfUppercase(1).noWhiteSpaces().required(),
});

const loginUsers = Joi.object({
  email: Joi.string().email().required(),
  password: JoiPassword.string().min(8).minOfSpecialCharacters(1).minOfNumeric(1).minOfUppercase(1).noWhiteSpaces().required()
});

const updateUsers = Joi.object({
  username: Joi.string().min(6),
  password: JoiPassword.string().min(8).minOfSpecialCharacters(1).minOfNumeric(1).minOfUppercase(1).noWhiteSpaces(),
}).min(1);

export default {
  createUsers,
  loginUsers,
  updateUsers
};