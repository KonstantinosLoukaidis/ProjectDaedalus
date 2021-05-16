const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const GatesDispatcher = require('./gateDispatcher.js');

var FlightSchema = new Schema({
    flight_number: String,
    gate_dispatcher: {
        type: Schema.Types.ObjectId,
        ref: GatesDispatcher
    },
    passengers: Number,
    paid: Boolean,
    landing_charge: Number,
    parking_charge: Number,
    total_ammount: Number,
    parking_surcharges: Number,
    landing_surcharges: Number
}, {
    timestamps: true
});

var Flight = mongoose.model('Flight', FlightSchema);

module.exports = Flight;