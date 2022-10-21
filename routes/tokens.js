const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getTokens,
  createToken,
  deleteToken
} = require('../controllers/tokens');
const regex = require("../utils/regex");

router.get('/', getTokens);

router.post('/', celebrate({
  body: Joi.object().keys({
    url: Joi.string().required().pattern(regex),
  }),
}), createToken);

router.delete('/:_id/delete', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex().required(),
  }),
}), deleteToken);

module.exports = router;
