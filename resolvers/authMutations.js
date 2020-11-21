const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');
const handleRequest = require('../utils/handleRequest');
const throwError = require('../utils/throwError');
const Token = require('../models/token');
const User = require('../models/user');
const codes = require('../constants/httpCodes');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API_KEY,
    },
  })
);
const generateCryptoToken = () => {
  return crypto.randomBytes(16).toString('hex');
};
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
      throwError({
        message: 'Invalid input',
        code: codes.INVALID_INPUT,
        errors,
      });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throwError({
        message: 'User exists already!',
        code: codes.INVALID_INPUT,
      });
    }

    const hashedPw = await bcrypt.hash(password, 12);
    const token = generateCryptoToken();

    const [, emailError] = await handleRequest(
      transporter.sendMail({
        to: email,
        from: 'akromsprinter@gmail.com',
        subject: 'Account Verification Token',
        html: `
        <div>Please verify your account by clicking the link below</div>
        <div><a href="http://localhost:4000/email-confirmation/${token}">Confirm email</a></div>
        `,
      })
    );
    if (emailError) {
      throwError({
        message: 'Error occured while sending an email',
        code: codes.INTERNAL_SERVER_ERROR,
      });
    }

    // only save to db if email sending is successful
    const user = new User({
      email,
      firstName,
      lastName,
      address,
      phone,
      password: hashedPw,
    });

    const newToken = new Token({
      userId: user._id,
      token: token,
    });

    await user.save();
    await newToken.save();

    return {
      success: true,
      message: `Verification email is sent to ${email}`,
    };
  },
  resendConfirmation: async function (_, { input }) {
    const { email } = input;
    if (!validator.isEmail(email)) {
      throwError({
        message: 'Email is invalid',
        code: codes.INVALID_INPUT,
      });
    }
    const user = await User.findOne({ email });
    if (!user) {
      throwError({
        message: 'User is not found with that email',
        code: codes.INVALID_INPUT,
      });
    }
    if (user.isVerified) {
      throwError({
        message: 'This account has already been verified. Please log in.',
        code: codes.BAD_REQUEST,
      });
    }

    // Create a verification token, save it, and send email
    const token = generateCryptoToken();
    const [, emailError] = await handleRequest(
      transporter.sendMail({
        to: email,
        from: 'akromsprinter@gmail.com',
        subject: 'Account Verification Token',

        html: `
        <div>Please verify your account by clicking the link below</div>
        <div><a href="http://localhost:4000/email-confirmation/${token}">Confirm email</a></div>          `,
      })
    );

    if (emailError) {
      throwError({
        message: 'Error occured while sending an email',
      });
    }
    var newToken = new Token({
      userId: user._id,
      token,
    });

    await newToken.save();

    return {
      success: true,
      message: `Verification email is sent to ${email}`,
    };
  },
  sendResetPasswordOTP: async (_, { input }) => {
    const { email } = input;
    const [user, userError] = await handleRequest(User.findOne({ email }));
    if (!user) {
      throwError({
        message: 'No account with that email found.',
        code: codes.INVALID_INPUT,
      });
    }
    if (userError) {
      throwError({});
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    const [, emailError] = await handleRequest(
      transporter.sendMail({
        to: email,
        from: 'akromsprinter@gmail.com',
        subject: 'Password reset request',
        html: `
          <p>You requested a password reset</p>
          <p>Here is 6-digit code: ${otp}.</p>
          `,
      })
    );
    if (emailError) {
      throwError({
        message: 'Error occured while sending an email',
      });
    }

    user.passwordResetOTP = otp;
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    return {
      success: true,
      message: `OTP code is sent to your email at ${email}`,
      userId: user._id.toString(),
    };
  },
  resetPassword: async (_, { input }) => {
    const { password, userId, otp } = input;
    const user = await User.findOne({
      _id: userId,
      passwordResetOTP: otp,
      passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
      throwError({
        message: 'OTP code is invalid or expired',
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    user.password = hashedPassword;
    user.passwordResetOTP = null;
    user.passwordResetExpires = null;
    user.save();
    return {
      success: true,
      message: 'You have successfully reset your password.',
    };
  },
  login: async function (_, { input }) {
    const { email, password } = input;
    const user = await User.findOne({ email });
    if (!user) {
      throwError({
        message: 'User not found.',
        code: codes.INVALID_INPUT,
      });
    }
    if (!user.isVerified) {
      throwError({
        message: 'Your account has not been verified.',
        code: codes.UNAUTHORIZED,
      });
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      throwError({
        message: 'Password is incorrect.',
        code: codes.UNAUTHORIZED,
      });
    }
    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      process.env.TOKEN_SECRET,
      { expiresIn: '12h' }
    );
    return { token: token, userId: user._id.toString() };
  },
};

module.exports = authMutations;
