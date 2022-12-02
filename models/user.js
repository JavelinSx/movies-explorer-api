const bcrypt = require('bcryptjs/dist/bcrypt');
const { mongoose } = require('mongoose');
const validator = require('validator');
const BadAuthError = require('../errors/bad_auth');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: (value) => {
      if (validator.isEmail(value)) {
        return true;
      }
      return false;
    },
  },
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 30,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .orFail(new BadAuthError('Необходима авторизация'))
    .then((user) => bcrypt
      .compare(password, user.password)
      .then((matched) => {
        if (!matched) {
          return Promise.reject(new BadAuthError('Необходима авторизация'));
        }
        return user;
      }));
};

module.exports = mongoose.model('user', userSchema);
