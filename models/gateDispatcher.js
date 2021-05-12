const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var GateDispatcherSchema = new Schema({
    network_plan: {
        type: Schema.Types.ObjectId,
        ref: 'Network_PlannerSchema'
    },
    gate_terminal: {
        type: String,
        required: true
    },
    gate_class: {
        type: String,
        required: true
    },
    arr_runway: String,
    dep_runway: String,
}, {
    timestamps: true
});

var GateDispatcher = mongoose.model('GateDispatcher', GateDispatcherSchema);

module.exports = GateDispatcher;