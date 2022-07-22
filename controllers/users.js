// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
// const AuthDataError = require('../errors/auth-data-error');
// const AuthError = require('../errors/auth-error');

// const JWT_SECRET = 'SECRET_PROJECT';

// возвращает информацию о пользователе (email и имя)
const getUserInfo = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

// обновляет информацию о пользователе (email и имя)
const updateUserProfile = (req, res, next) => {
  const { _id } = req.user;
  const { name, about } = req.body;

  User.findByIdAndUpdate(_id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным _id не найден');
      }
      return res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при обновлении информации о пользователе'));
      } else {
        next(err);
      }
    });
};

module.exports = {
  getUserInfo,
  updateUserProfile,
};
