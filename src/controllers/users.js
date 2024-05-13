import usersService from "../services/users.js";
import httpError from "../utils/httpError.js";

const createUser = async (req, res, next) => {
  try {
    const result = await usersService.createUser(req.body);

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const result = await usersService.verifyEmail(req.body);

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

const getUser = async (req, res, next) => {
  try {
    const result = await usersService.getUser(+req.params.id);

    if (!result) {
      return next(new httpError(400, "No user with id."));
    }

    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await usersService.loginUser(req.body);
    res.status(201).send(result);
  } catch (err) {
    next(err);
  }
}

export default {
  createUser,
  verifyEmail,
  getUser,
  loginUser,
};
