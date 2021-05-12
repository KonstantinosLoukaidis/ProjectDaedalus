var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Gates = mongoose.model('Gate',
    new Schema({
        Name: String,
        Class: String,
        Gate: Number,
        Shegen: Number,
    }),
    'gates');

module.exports = Gates;