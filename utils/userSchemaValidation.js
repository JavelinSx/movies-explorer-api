const { Joi } = require('celebrate');

const userRegisterValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    name: Joi.string().required().min(2).max(30),
  }),
};

const userLoginValidation = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
};

const userAuthValidation = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
  }),
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex(),
  }),
};

module.exports = {
  userRegisterValidation,
  userLoginValidation,
  userAuthValidation,
};
