const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad_request');
const NotFoundError = require('../errors/not_found_error');
const ForbiddenError = require('../errors/forbidden_error');

module.exports.createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user._id,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => {
      res.send(movie);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        console.log(err);
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.getMoviesSavedByUser = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => res.send(movies))
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};

module.exports.deleteSavedMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findOne({ movieId })
    .orFail(new NotFoundError('Фильм не найден'))
    .then((movie) => {
      if (JSON.stringify(movie.owner) === JSON.stringify(req.user._id)) {
        return Movie.findByIdAndRemove(movieId)
          .then(() => res.send(movie));
      }
      return next(new ForbiddenError('Невозможно удалить фильм'));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
};
