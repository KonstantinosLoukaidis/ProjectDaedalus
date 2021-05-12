const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Airlines = require('./airlines');
const Airports = require('./airports');
const Airplanes = require('./airplanes');

var ArDepSchema = new Schema({
    arrival_time: String,
    arrival_day: String,
    departure_time: String,
    departure_day: String
})

var Network_PlannerSchema = new Schema({
    airline: {
        type: Schema.Types.ObjectId,
        ref: Airlines
    },
    airport: {
        type: Schema.Types.ObjectId,
        ref: Airports
    },
    ar_dep: [ArDepSchema],
    aircraft: {
        type: Schema.Types.ObjectId,
        ref: Airplanes
    },
    approved: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

var Network_Planner = mongoose.model('Network_plan', Network_PlannerSchema);

module.exports = Network_Planner;