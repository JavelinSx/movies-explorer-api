const router = require('express').Router();
const { celebrate } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const {
  login,
  register,
  logout,
} = require('../controllers/users');
const { auth } = require('../middlewares/auth');
const { userLoginValidation, userRegisterValidation } = require('../utils/userSchemaValidation');
const NotFoundError = require('../errors/not_found_error');

router.post('/signup', celebrate(userRegisterValidation), register);
router.post('/signin', celebrate(userLoginValidation), login);

router.use(auth);

router.use('/users', userRouter);
router.use('/movies', movieRouter);
router.post('/signout', logout);
router.use('*', (req, res, next) => {
  next(new NotFoundError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
