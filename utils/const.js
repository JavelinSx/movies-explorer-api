const TOKEN_DEV = 'some-secret-key';
const LINK_REGEX = /^https?:\/\/(www\.)?[a-zA-Z\d-]+\.[\w\d\-.~:/?#[\]@!$&'()*+,;=]{2,}#?$/;
const NAME_MOVIE_RU = /^[ЁёА-я]$/;
const NAME_MOVIE_EN = /^[A-Za-z]$/; // добавить ё и правильно донастроить, включив цифры
module.exports = {
  LINK_REGEX,
  TOKEN_DEV,
  NAME_MOVIE_EN,
  NAME_MOVIE_RU,
};
