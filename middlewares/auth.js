const jwt = require('jsonwebtoken');
const BadAuthError = require('../errors/bad_auth');
const { ERRORS_MESSAGE, JWT_DEV } = require('../utils/const');

const { NODE_ENV = 'development', JWT_PROD } = process.env;
require('dotenv').config();

module.exports.auth = (req, res, next) => {
  const { token } = req.cookies;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_PROD : JWT_DEV);
  } catch (err) {
    console.log(err);
    next(new BadAuthError(ERRORS_MESSAGE.badAuth.messageNeedAuth));
  }
  req.user = payload;
  next();
};
