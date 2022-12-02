const router = require('express').Router();
const { celebrate } = require('celebrate');
const { movieIdValidation, createMovieValidation } = require('../utils/moviesSchemaValidation');
const {
  createMovie,
  deleteSavedMovie,
  getMoviesSavedByUser,
} = require('../controllers/movies');

router.get('/', celebrate(movieIdValidation), getMoviesSavedByUser);
router.post('/', celebrate(createMovieValidation), createMovie);
router.delete('/:movieId', celebrate(movieIdValidation), deleteSavedMovie);
// нужен ли router.patch?
module.exports = router;
