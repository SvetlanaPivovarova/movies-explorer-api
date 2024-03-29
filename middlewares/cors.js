// Массив доменов, с которых разрешены кросс-доменные запросы
const allowedCors = [
  'https://pivovarova.diploma.nomoredomains.xyz',
  'http://pivovarova.diploma.nomoredomains.xyz',
  'localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:5173',
  'https://pivovarova.pro.nomoredomains.xyz',
  'http://pivovarova.pro.nomoredomains.xyz'

];
// Значение для заголовка Access-Control-Allow-Methods по умолчанию (разрешены все типы запросов)
const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { origin } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  res.header('Access-Control-Allow-Credentials', 'true');

  if (allowedCors.includes(origin)) {
    // устанавливаем заголовок, который разрешает браузеру запросы с этого источника
    res.header('Access-Control-Allow-Origin', origin);
  }

  // Если это предварительный запрос, добавляем нужные заголовки
  if (method === 'OPTIONS') {
    // разрешаем кросс-доменные запросы любых типов (по умолчанию)
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
  }

  next();
};

module.exports = cors;
