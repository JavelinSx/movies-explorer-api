const { Joi } = require('celebrate');
const { LINK_REGEX } = require('./const');

const createMovieValidation = {
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(LINK_REGEX)
      .message('hello'),
    trailerLink: Joi.string().required().pattern(LINK_REGEX),
    thumbnail: Joi.string().required().pattern(LINK_REGEX),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
};

const movieIdValidation = {
  params: Joi.object().keys({
    movieId: Joi.string().required().length(24).hex(),
  }),
};

module.exports = {
  createMovieValidation,
  movieIdValidation,
};
