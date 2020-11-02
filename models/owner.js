const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ownerSchema = new Schema({
    name: String,
    phone: String,
    age: Number
});

module.exports = mongoose.model('Owner', ownerSchema);
