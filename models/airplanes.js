var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Airplanes = mongoose.model('Airplane',
    new Schema({
        Manufacturer: String,
        Model: String,
        CLASSI: String,
        MTOW: String
    }),
    'airplanes');

module.exports = Airplanes;