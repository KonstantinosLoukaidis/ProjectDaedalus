const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Gates = require('./gates.js');
const Network_PlannerSchema = require('./network_planner.js');

var GateDispatcherSchema = new Schema({
    network_plan: {
        type: Schema.Types.ObjectId,
        ref: Network_PlannerSchema
    },
    gate: {
        type: Schema.Types.ObjectId,
        ref: Gates
    },
    arr_runway: String,
    dep_runway: String,
}, {
    timestamps: true
});

var GateDispatcher = mongoose.model('GateDispatcher', GateDispatcherSchema);

module.exports = GateDispatcher;