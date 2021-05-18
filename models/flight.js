const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GatesDispatcher = require('./gateDispatcher.js');

var FlightSchema = new Schema({
    gate_dispatcher: {
        type: Schema.Types.ObjectId,
        ref: GatesDispatcher
    },
    passengers: Number,
    passengers_charges: Number,
    paid: Boolean,
    landing_charge: Number,
    parking_charge: Number,
    total_ammount: Number,
    parking_surcharges: Number,
    landing_surcharges: Number,
    flight_arrival: String,
    flight_departure: String,
    passed: false
}, {
    timestamps: true
});

var Flight = mongoose.model('Flight', FlightSchema);

module.exports = Flight;