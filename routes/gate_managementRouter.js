const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const GateDispatcher = require('../models/gateDispatcher');
const Gates = require('../models/gates');
const Flight = require('../models/flight');

const gate_managementRouter = express.Router();

gate_managementRouter.use(bodyParser.json());

module.exports = gate_managementRouter;

gate_managementRouter.route('/')
    .get((req, res, next) => {
        res.render('gate_management');
    });

gate_managementRouter.route('/used_gates')
    .get((req, res, next) => {
        var info = req.query.key;
        Flight.find({})
            .populate('gate_dispatcher')
            .populate({
                path: 'gate_dispatcher',
                populate: {
                    path: 'network_plan',
                    populate: {
                        path: 'airline'
                    }
                }
            })
            .populate({
                path: 'gate_dispatcher',
                populate: {
                    path: 'network_plan',
                    populate: {
                        path: 'airport'
                    }
                }
            })
            .populate({
                path: 'gate_dispatcher',
                populate: {
                    path: 'network_plan',
                    populate: {
                        path: 'aircraft'
                    }
                }
            })
            .populate({
                path: 'gate_dispatcher',
                populate: {
                    path: 'gate'
                }
            })
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });