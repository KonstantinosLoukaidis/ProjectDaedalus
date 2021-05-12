var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Airplanes = mongoose.model('Airplane',
    new Schema({
        Manufacturer: String,
        Model: String,
        CLASSI: String
    }),
    'airplanes');

module.exports = Airplanes;