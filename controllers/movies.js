const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
// const ForbiddenError = require('../errors/forbidden-error');

// возвращает все сохранённые текущим пользователем фильмы
const getMovies = (req, res, next) => {
  Movie.find()
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        return next(new NotFoundError('Нет сохраненных фильмов'));
      }

      return movie;
    })
    .catch(next);
};

// создаёт фильм с переданными в теле
// country, director, duration, year, description,
// image, trailer, nameRU, nameEN и thumbnail, movieId
const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: req.user._id,
  })
    .then((movie) => res.status(201).send({ data: movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные при создании фильма'));
      } else {
        next(err);
      }
    });
};

// удаляет сохранённый фильм по id
const deleteMovie = (req, res, next) => {
  const id = req.params._id;
  Movie.findById(id)
    .orFail(() => new NotFoundError('Нет фильма по заданному id'))
    .then((movie) => movie.remove()
      .then(() => res.send({ message: 'Фильм удален из "Сохраненные"' })))
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
