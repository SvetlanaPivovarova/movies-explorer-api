const mongoose = require('mongoose');

// модель сущности token
const tokenSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
  }
});

// создаём модель и экспортируем её
module.exports = mongoose.model('token', tokenSchema);
