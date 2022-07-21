const mongoose = require('mongoose');
const validator = require('validator');
// const bcrypt = require('bcryptjs');

// модель сущности пользователь user
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Укажите e-mail',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
  },
});

// создаём модель и экспортируем её
module.exports = mongoose.model('user', userSchema);
