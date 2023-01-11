const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const ForbiddenError = require('../errors/forbidden_error');
const { ERRORS_MESSAGE } = require('../utils/const');

module.exports.createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError(ERRORS_MESSAGE.badRequest.messageUncorrectedData));
      }
      return next(err);
    });
};

module.exports.getMoviesSavedByUser = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.deleteSavedMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .orFail(new NotFoundError(ERRORS_MESSAGE.notFound.messageSearchMovie))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send(movie));
      }
      return next(new ForbiddenError(ERRORS_MESSAGE.forbidden.messageDefault));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError(ERRORS_MESSAGE.badRequest.messageUncorrectedData));
      }
      return next(err);
    });
};
