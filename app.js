require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const { limiter } = require('./utils/limiterConfig');
const handlerErrors = require('./middlewares/errors');
const router = require('./routes/index');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DB_PATH_DEV } = require('./utils/const');

const { PORT = 3000, DB_PATH_PROD = DB_PATH_DEV, NODE_ENV } = process.env;
const pathDB = NODE_ENV === 'protuction' ? DB_PATH_PROD : DB_PATH_DEV;
const app = express();

async function connected() {
  try {
    mongoose.connect(pathDB, {
      useNewUrlParser: true,
    });
  } catch (err) {
    console.log(err);
  }
  app.listen(PORT, () => {
    console.log(`App listeind o port ${PORT}`);
  });
}

app.disable('x-powered-by');
app.use(requestLogger);
app.use(cors);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(limiter);
app.use(helmet());
app.use('/', router);

app.use(errorLogger);
app.use(errors());
app.use(handlerErrors);

connected();
