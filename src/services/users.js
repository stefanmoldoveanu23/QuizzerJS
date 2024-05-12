import prisma from "../../client.js";
import httpError from "../utils/httpError.js";
import bcrypt from "bcrypt";
import mailer from "../utils/mailer.js";
import { randomUUID } from "crypto";

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

  const code = randomUUID();

  let result = await prisma.user.create({
    data: {
      email: email,
      password: password_hashed,
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
      html: '\
      <form action="localhost:3000/users/verify" method="POST">\
        <div>\
          <label for="code">Press the button to confirm your email address</label>\
          <input type="hidden" name="code" id="code" value="' + code + '"/>\
        <div>\
        <button>Verify</button>\
      </form>\
      '
    }
  );

  return result;
};

const verifyEmail = async (verificationInfo) => {
  const { code } = verificationInfo;

  const user = await prisma.user.findUnique({
    where: {
      code: code,
      verified: false
    }
  });

  if (!user) {
    throw new httpError(400, "No user with code.");
  }

  await prisma.user.update({
    where: {
      id: user.id
    },
    data: {
      verified: true
    }
  });

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
    throw new httpError(400, "Your email address is not verified yet.");
  }

  if (!await bcrypt.compare(password, result.password)) {
    throw new httpError(400, "Incorrect credentials.");
  }

  return result;
}

export default {
  createUser,
  verifyEmail,
  getUser,
  loginUser
};
