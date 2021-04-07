var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Airports = mongoose.model('Airport',
    new Schema({
        latitude: String,
        longtitude: String,
        name: String,
        nickname: String,
        iata: String,
        icao: String,
        dd_latitude: String,
        dd_longitutde: String
    }),
    'airports');

module.exports = Airports;