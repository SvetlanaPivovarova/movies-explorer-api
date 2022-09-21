const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const AuthDataError = require('../errors/auth-data-error');
const AuthError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

// создаёт пользователя с переданными в теле
// email, password и name
const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  const saltRounds = 10;

  return User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AuthDataError('Такой пользователь уже существует');
      }

      return bcrypt.hash(password, saltRounds);
    })
    .then((hash) => User.create({
      email, password: hash, name,
    }))
    // вернём записанные в базу данные
    .then((userData) => {
      res.status(201).send({
        email: userData.email,
        name: userData.name,
        _id: userData._id,
      });
    })
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании пользователя'));
      } else {
        next(err);
      }
    });
};

// проверяет переданные в теле почту и пароль
// и возвращает JWT
const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'DIPLOMA_SECRET',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
      })
        .send({ token, _id: user._id });
    })
    .catch(() => {
      next(new AuthError('Укажите верные e-mail и пароль'));
    });
};

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
  const { email, name } = req.body;

  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new AuthDataError('Такой email уже используется, выбирите другой');
      } else {
        User.findByIdAndUpdate(_id, { email, name }, { new: true, runValidators: true })
          .orFail(() => new NotFoundError('Пользователь с указанным _id не найден'))
          .then((user) => {
            return res.send({ data: user });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequestError('Некорректные данные при обновлении информации о пользователе'));
            } else {
              next(err);
            }
          });
      }
    })
    .catch(next);
};

module.exports = {
  getUserInfo,
  updateUserProfile,
  createUser,
  login,
};
