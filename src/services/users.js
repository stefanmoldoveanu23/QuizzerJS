import prisma from "../../client.js"
import httpError from "../utils/httpError.js";
import bcrypt from "bcrypt"

const createUser = async (userInfo) => {
  const { email, password, ...user } = userInfo;

  const exists = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  const password_hashed = await bcrypt.hash(password, 10);

  if (exists) {
    if (exists.verified) {
      throw new httpError(400, "User with email " + email + " already exists.");
    } else {
      return await prisma.user.update({
        where: {
          email: email
        },
        data: {
          email: email,
          password: password_hashed,
          verified: false,
          ...user
        }
      });
    }
  }

  return await prisma.user.create({
    data: {
      email: email,
      password: password_hashed,
      verified: true,
      ...user
    }
  });
};

const getUser = async (userId) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId
    }
  });

  if (!result) {
    throw new httpError(400, "No user with id.");
  }

  return result;
};

const loginUser = async (userInfo) => {
  const { email, password } = userInfo;

  const result = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!result) {
    throw new httpError(400, "User with email " + email + " does not exist.");
  }

  if (!await bcrypt.compare(password, result.password)) {
    throw new httpError(400, "Incorrect password.");
  }

  return result;
}

export default {
  createUser,
  getUser,
  loginUser
};
