const jwt = require('jsonwebtoken');

const Token = require('../models/token');
const {NODE_ENV, JWT_SECRET} = require("../utils/constants");
const BadRequestError = require("../errors/bad-request-error");
const NotFoundError = require("../errors/not-found-error");

const getTokens = (req, res, next) => {
  Token.find()
    .then((tokens) => res.send(tokens))
    .catch(next);
};


const createToken = (req, res, next) => {
  const {
    url
  } = req.body;
  const token = jwt.sign(
    { url: url },
    NODE_ENV === 'production' ? JWT_SECRET : 'DIPLOMA_SECRET',
    { expiresIn: '7d' },
  );
  console.log(({
    url: url,
    token: token
  }));
  return Token.create({ url, token })
    .then((tokenData) => {
      // вернём токен
      return res.send({ url, token, _id: tokenData._id });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании токена'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
const deleteToken = (req, res, next) => {
  const id = req.params._id;
  Token.findById(id)
    .orFail(() => new NotFoundError('Нет токена по заданному id'))
    .then((token) => {
      return token.remove()
        .then(() => res.send({ message: 'Токен удален' }));
    })
    .catch(next);
};

module.exports = {
  getTokens,
  createToken,
  deleteToken
}