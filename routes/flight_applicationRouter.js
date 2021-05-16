const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const Airplanes = require('../models/airplanes');
const GateDispatcher = require('../models/gateDispatcher');
const Gates = require('../models/gates');

const flight_applicationRouter = express.Router();

flight_applicationRouter.use(bodyParser.json());

flight_applicationRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('flight_applications.html', { root: path.join(__dirname, '../public') });
    })
    .put((req, res, next) => {
        if (req.body.action == 1) {
            async function availability() {
                let x = await checkGateAvailability(req.body.plan_id)
                if (x) {
                    Network_Planner.updateOne({ _id: req.body.plan_id }, {
                            $set: {
                                approved: req.body.action
                            }
                        })
                        .then((data, err) => {
                            if (err) throw err;
                            else if (!data) res.send(null);
                            else res.send(data);
                        });
                } else {
                    res.send({ data: 'error', msg: 'No available gates' });
                }
            }
            availability();
        } else {
            if (req.body.action == 0 && req.body.prev_status == 1) {
                removeGate(req.body.plan_id)
            }
            Network_Planner.updateOne({ _id: req.body.plan_id }, {
                    $set: {
                        approved: req.body.action
                    }
                })
                .then((data, err) => {
                    if (err) throw err;
                    else if (!data) res.send(null);
                    else res.send(data);
                });
        }
    })

flight_applicationRouter.route('/getPendingData')
    .get((req, res, next) => {
        Network_Planner.find({ approved: 0 })
            .populate('airline')
            .populate('airport')
            .populate('aircraft')
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

flight_applicationRouter.route('/getAcceptedData')
    .get((req, res, next) => {
        Network_Planner.find({ approved: 1 })
            .populate('airline')
            .populate('airport')
            .populate('aircraft')
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

flight_applicationRouter.route('/getRejectedData')
    .get((req, res, next) => {
        Network_Planner.find({ approved: -1 })
            .populate('airline')
            .populate('airport')
            .populate('aircraft')
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

flight_applicationRouter.route('/:id')
    .get((req, res, next) => {
        res.sendFile('flight_profile.html', { root: path.join(__dirname, '../public') });
    })

flight_applicationRouter.route('/:id/getAllPlans')
    .get((req, res, next) => {
        Network_Planner.find({ _id: req.params.id })
            .populate('airline')
            .populate('airport')
            .populate('aircraft')
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });


function checkGateAvailability(plan_id) {
    return new Promise((res, rej) => {
        Network_Planner.find({ _id: plan_id })
            .populate('aircraft')
            .exec((err, data) => {
                if (err) throw err;
                else {
                    var plan_class = data[0].aircraft.CLASSI;
                    GateDispatcher.aggregate([{
                                $lookup: {
                                    from: 'gates',
                                    localField: 'gate',
                                    foreignField: '_id',
                                    as: 'gate'
                                }
                            },
                            { $match: { "gate.Class": plan_class } }
                        ])
                        .then((data, err) => {
                            if (err) throw err
                            else if (data.length === 0) {
                                Gates.findOne({ Class: plan_class }, { _id: 1 })
                                    .then((gate_id, err) => {
                                        if (gate_id) {
                                            dispatchGate(gate_id, plan_id);
                                            res(true)
                                        } else throw err;
                                    })
                            } else {
                                var gates_used = new Array();
                                for (gate of data) gates_used.push(gate.gate[0].Name)
                                Gates.find({ $and: [{ 'Class': plan_class }, { $expr: { $not: { $in: ['$Name', gates_used] } } }] })
                                    .then((gates, err) => {
                                        if (err) throw err;
                                        else if (gates.length > 0) {
                                            dispatchGate(gates[0]._id, plan_id);
                                            res(true)
                                        } else {
                                            res(false)
                                        }
                                    });
                            }
                        });
                }
            })
    })
}

function dispatchGate(gate_id, plan_id) {
    let dataToSend = {
        network_plan: plan_id,
        gate: gate_id,
        arr_runway: "EAST1",
        dep_runway: "EAST2"
    };
    let newGateDispatched = new GateDispatcher(dataToSend)
    newGateDispatched.save((err) => {
        if (err) throw err;
    })
}

function removeGate(plan_id) {
    console.log(plan_id)
    GateDispatcher.deleteOne({ 'network_plan': plan_id })
        .then((data, err) => {
            if (err) throw err
            else {
                console.log(data)
            }
        })
}

module.exports = flight_applicationRouter;