const TOKEN_DEV = 'some-secret-key';
const LINK_REGEX = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;
const JWT_DEV = 'secret-key';
const DB_PATH_DEV = 'mongodb://localhost:27017/moviesdb-dev';
const ERRORS_MESSAGE = {
  badRequest: {
    messageUncorrectedData: 'Переданы некорректные данные',
  },
  badAuth: {
    messageNeedAuth: 'Необходима авторизация',
    messageUncorrectedData: 'Переданные некорректные данные email или password',
  },
  notFound: {
    messageDefault: 'Запрашиваемый ресурс не найден',
    messageSearchMovie: 'Фильм с таким id не найден',
    messageSearchUser: 'Пользователь с таким id не найден',
  },
  forbidden: {
    messageDefault: 'Пользователь не имеет достаточно прав для этого действия',
  },
  existConflict: {
    messageDefault: 'Пользователь с таким email уже существет',
  },
  defautl: {
    messageDefault: 'Ошибка сервера',
  },
};

module.exports = {
  LINK_REGEX,
  TOKEN_DEV,
  ERRORS_MESSAGE,
  DB_PATH_DEV,
  JWT_DEV,
};
