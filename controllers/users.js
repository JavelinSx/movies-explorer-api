require('dotenv').config();

const { NODE_ENV, JWT_PROD } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const BadAuthError = require('../errors/bad_auth');
const ExistEmailError = require('../errors/exist_email_error');
const { ERRORS_MESSAGE, JWT_DEV } = require('../utils/const');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_PROD : JWT_DEV,
        { expiresIn: '7d' },
      );
      res.cookie('token', token, {
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      })
        .send({ message: 'Авторизация прошла успешно' });
    })
    .catch(() => {
      next(new BadAuthError(ERRORS_MESSAGE.badAuth.messageUncorrectedData));
    });
};

module.exports.logout = (req, res) => {
  res.clearCookie('token').send();
};

module.exports.register = (req, res, next) => {
  const { name, email, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ name, email, password: hash }))
    .then((user) => {
      res.send({
        name: user.name, email: user.email, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log('hekllo');
        return next(new BadRequestError(ERRORS_MESSAGE.badRequest.messageUncorrectedData));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError(ERRORS_MESSAGE.existConflict.messageDefault));
      }
      return next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError(ERRORS_MESSAGE.notFound.messageSearchUser))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(ERRORS_MESSAGE.notFound.messageSearchUser))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERRORS_MESSAGE.badRequest.messageUncorrectedData));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError(ERRORS_MESSAGE.notFound.messageSearchUser));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError(ERRORS_MESSAGE.existConflict.messageDefault));
      }
      return next(err);
    });
};
