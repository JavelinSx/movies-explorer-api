require('dotenv').config();

const { NODE_ENV, JWT_PROD } = process.env;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const BadAuthError = require('../errors/bad_auth');
const ExistEmailError = require('../errors/exist_email_error');

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_PROD : 'JWT_DEV',
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
      next(new BadAuthError('Неправильные почта или пароль'));
    });
};

module.exports.register = (req, res, next) => {
  const { email, name, password } = req.body;
  return bcrypt.hash(password, 10)
    .then((hash) => User.create({ email, name, password: hash }))
    .then((user) => {
      res.send({
        email: user.email, name: user.name, _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
      }
      if (err.code === 11000) {
        return next(new ExistEmailError('Передан уже зарегистрированный email.'));
      }
      return next(err);
    });
};

module.exports.getUserInfo = (res, req, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(new NotFoundError(`Пользователь с id ${userId} не найден`))
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.updateUserInfo = (res, req, next) => {
  const { email, name } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { email, name },
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(new NotFoundError(`Пользователь с id ${req.user._id} не найден`))
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные при обновлении пользователя'));
      }
      if (err.name === 'CastError') {
        return next(new BadRequestError('Пользователь не найден'));
      }
      return next(err);
    });
};
