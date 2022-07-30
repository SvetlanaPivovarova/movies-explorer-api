const {
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
  DB_PATH,
} = process.env;

const dataBaseUrl = 'mongodb://localhost:27017/moviesdb';

module.exports = {
  PORT,
  NODE_ENV,
  JWT_SECRET,
  DB_PATH,
  dataBaseUrl,
};
