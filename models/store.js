const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const storeSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: false
  },
  address: {
    type: String,
    required: false
  },
});

module.exports = mongoose.model('Store', storeSchema);