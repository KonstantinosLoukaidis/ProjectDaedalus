const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var Network_PlannerSchema = new Schema({
    airline: {
        type: String,
        required: true
    },
    airline_icao: {
        type: String,
        required: true
    },
    airline_iata: {
        type: String,
        required: true
    },
    airport: {
        type: String,
        required: true
    },
    airport_icao: {
        type: String,
        required: true
    },
    airport_iata: {
        type: String,
        required: true
    },
    monday_arr: String,
    tuesday_arr: String,
    wednesday_arr: String,
    thursday_arr: String,
    friday_arr: String,
    saturday_arr: String,
    sunday_arr: String,
    monday_dep: String,
    tuesday_dep: String,
    wednesday_dep: String,
    thursday_dep: String,
    friday_dep: String,
    saturday_dep: String,
    sunday_dep: String
}, {
    timestamps: true
});

var Network_Planner = mongoose.model('Network_plan', Network_PlannerSchema);

module.exports = Network_Planner;