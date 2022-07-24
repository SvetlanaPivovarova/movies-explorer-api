const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const regex = require('../utils/constance');
const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(regex),
    trailerLink: Joi.string().required().pattern(regex),
    thumbnail: Joi.string().required().pattern(regex),
    // id: Joi.string().length(24).hex().required(),
    // owner: Joi.string().length(24).hex().required(),
    movieId: Joi.string().hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
