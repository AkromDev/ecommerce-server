const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const Token = require('../models/token');
const User = require('../models/user');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);

const authMutations = {
  signup: async function (_, { input }) {
    const { email, password, firstName, lastName, address, phone } = input;
    const errors = [];
    if (!validator.isEmail(email)) {
      errors.push({ message: 'E-Mail is invalid.' });
    }
    if (
      validator.isEmpty(password) ||
      !validator.isLength(password, { min: 5 })
    ) {
      errors.push({ message: 'Password too short!' });
    }
    if (validator.isEmpty(firstName)) {
      errors.push({ message: 'First name is required!' });
    }
    if (validator.isEmpty(lastName)) {
      errors.push({ message: 'Last name is required!' });
    }

    if (errors.length > 0) {
      const error = new Error('Invalid input.');
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User exists already!');
      throw error;
    }
    const hashedPw = await bcrypt.hash(password, 12);
    const user = new User({
      email,
      firstName,
      lastName,
      address,
      phone,
      password: hashedPw,
    });
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    });
    try {
      await transporter.sendMail({
        to: email,
        from: 'akromsprinter@gmail.com',
        subject: 'Account Verification Token',
        html: `
              <div>Please verify your account by clicking the link below</div>
              <div><a href="http://localhost:4000/email-confirmation/${token.token}">Confirm email</a></div>
            `,
      });
    } catch (err) {
      const error = new Error('Error occured while sending an email');
      error.code = 500;
      throw error;
    }
    // only save to db if email sending is successful

    await user.save();
    await token.save();
    return {
      success: true,
      message: `Verification email is sent to ${email}`,
      userId: user._id.toString(),
    };
  },
  resendConfirmation: async function (_, { input }) {
    const { email } = input;
    if (!validator.isEmail(email)) {
      const error = new Error('Email is invalid');
      error.code = 422;
      throw error;
    }
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User is not found with that email');
      error.code = 422;
      throw error;
    }
    if (user.isVerified) {
      const error = new Error(
        'This account has already been verified. Please log in.'
      );
      error.code = 400;
      throw error;
    }

    // Create a verification token, save it, and send email
    var token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString('hex'),
    });

    try {
      await transporter.sendMail({
        to: email,
        from: 'akromsprinter@gmail.com',
        subject: 'Account Verification Token',

        html: `
              <div>Please verify your account by clicking the link below</div>
              <div><a href="http://localhost:4000/email-confirmation/${token.token}">Confirm email</a></div>          `,
      });
    } catch (err) {
      const error = new Error('Error occured while sending an email');
      error.code = 500;
      throw error;
    }
    // only save to db if email sending is successful

    await token.save();
    return {
      success: true,
      message: `Verification email is sent to ${email}`,
      userId: user._id.toString(),
    };
  },
  login: async function (_, { input }) {
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    if (!user.isVerified) {
      const error = new Error('Your account has not been verified.');
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      'tokensecretdev',
      { expiresIn: '12h' }
    );
    return { token: token, userId: user._id.toString() };
  },
};

module.exports = authMutations;
