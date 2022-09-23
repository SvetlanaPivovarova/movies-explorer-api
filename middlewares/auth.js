const jwt = require('jsonwebtoken');
const AuthError = require('../errors/auth-error');

const { NODE_ENV, JWT_SECRET } = require('../utils/constants');

const auth = (req, res, next) => {
  // const { cookies } = req;
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw (new AuthError('Необходима авторизация'));
  } else {
    const token = authorization.replace('Bearer ', '');
    let payload;

  // if (!cookies) {
  //  throw new AuthError('Авторизация не успешна');
    // next(res.status(ERROR_AUTH).send({ error: 'Авторизация не успешна' }));
  // } else {
  //  const token = cookies.jwt;
  //  let payload;

    // попытаемся верифицировать токен
    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'DIPLOMA_SECRET');
    } catch (err) {
      // next(res.status(ERROR_AUTH).send({ error: 'jwt token is not valid' }));
      return next(new AuthError('jwt token is not valid'));
    }
    req.user = payload;
    return next();
  }
};

module.exports = auth;
