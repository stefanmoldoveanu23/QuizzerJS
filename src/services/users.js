import prisma from "../../client.js";
import httpError from "../utils/httpError.js";
import mailer from "../utils/mailer.js";
import { randomUUID } from "crypto";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const createUser = async (hostname, userInfo) => {
  const { email, ...user } = userInfo;

  const exists = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

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
          verified: false,
          ...user
        }
      });
    }
  }

  const code = randomUUID();

  let result = await prisma.user.create({
    data: {
      email: email,
      code: code,
      verified: false,
      ...user
    }
  });

  await mailer.sendMail(
    {
      from: '"QuizzerJS" <' + process.env.EMAIL_ADDRESS + '>',
      to: email,
      subject: "Email address verification",
      text: "Click the button to verify your email.",
      html: `\
      <form action="http://${hostname}:3000/users/verify" method="POST">\
        <div>\
          <label for="code">Press the button to confirm your email address</label>\
          <input type="hidden" name="code" id="code" value="' + code + '"/>\
        <div>\
        <button>Verify</button>\
      </form>\
      `
    }
  );

  return result;
};

const verifyEmail = async (verificationInfo) => {
  const { code } = verificationInfo;

  const user = await prisma.user.findFirst({
    where: {
      code: code,
      verified: false
    }
  });

  if (!user) {
    throw new httpError(400, "No user with code.");
  }

  await updateUser(user.id, { verified: true });

  return user;
}

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
      email: email,
    }
  });

  if (!result) {
    throw new httpError(400, "User with email " + email + " does not exist.");
  }

  if (!result.verified) {
    throw new httpError(403, "Your email address is not verified yet.");
  }

  if (!await bcrypt.compare(password, result.password)) {
    throw new httpError(400, "Incorrect credentials.");
  }

  return jwt.sign(
    {
      user_id: result.id
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h"
    }
  );
}

const updateUser = async (userId, userInfo) => {
  const result = await prisma.user.update({
    where: {
      id: userId
    },
    data: userInfo
  });

  if (!result) {
    throw new httpError(400, "No user with id " + userId + ".");
  }
}

const deleteUser = async (userId) => {
  const result = await prisma.user.delete({
    where: {
      id: userId
    }
  });

  if (!result) {
    throw new httpError(400, "No user with id " + userId + ".");
  }
}

const getQuizzes = async (userId) => {
  await getUser(userId);

  const result = await prisma.quiz.findMany({
    where: {
      userId: userId
    }
  });

  return result;
}

export default {
  createUser,
  verifyEmail,
  getUser,
  loginUser,
  updateUser,
  deleteUser,
  getQuizzes
};
