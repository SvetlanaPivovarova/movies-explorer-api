require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');

const {
  PORT, dataBaseUrl, NODE_ENV, DB_PATH,
} = require('./utils/constants');
const cors = require('./middlewares/cors');
const routes = require('./routes/index');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const errorsHandler = require('./errors/error-handler');

const app = express();

app.use(cors);
app.use(helmet());

app.use(bodyParser.json()); // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true })); // для приёма веб-страниц внутри POST-запроса
app.use(cookieParser()); // подключаем парсер cookie

app.use(requestLogger); // подключаем логгер запросов

app.use(routes);

app.use(errorLogger); // подключаем логгер ошибок

// обработчики ошибок
app.use(errors()); // обработчик ошибок celebrate

// централизованная обработка ошибок
app.use(errorsHandler);

app.listen(PORT, async () => {
  // подключаемся к серверу mongo
  mongoose.connection.on('connected', () => {
    // console.log('mongodb connected!!!');
  });
  await mongoose.connect(NODE_ENV === 'production' ? DB_PATH : dataBaseUrl);
  // console.log(`App listening on port ${PORT}`);
});
