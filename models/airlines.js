var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Airlines = mongoose.model('Airline',
    new Schema({
        name: String,
        logolink: String,
        IATA: String,
        ICAO: String,
        CallsignL: String,
        hubs: Array,
        website: String
    }),
    'airlines');

module.exports = Airlines;