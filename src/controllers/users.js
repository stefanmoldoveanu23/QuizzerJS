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

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

const getUser = async (req, res, next) => {
  try {
    const result = await usersService.getUser(+req.params.id);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const result = await usersService.loginUser(req.body);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

const updateUser = async (req, res, next) => {
  try {
    await usersService.updateUser(req.user_id, req.body);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

const deleteUser = async (req, res, next) => {
  try {
    await usersService.deleteUser(req.user_id);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export default {
  createUser,
  verifyEmail,
  getUser,
  loginUser,
  updateUser,
  deleteUser
};
