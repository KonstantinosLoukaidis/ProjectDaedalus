const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const GateDispatcher = require('../models/gateDispatcher');
const Gates = require('../models/gates');

const gate_managementRouter = express.Router();

gate_managementRouter.use(bodyParser.json());

module.exports = gate_managementRouter;

gate_managementRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('gate_management.html', { root: path.join(__dirname, '../public') });
    });

gate_managementRouter.route('/used_gates')
    .get((req, res, next) => {
        var info = req.query.key;
        GateDispatcher.find({})
            .populate({
                path: 'network_plan',
                populate: {
                    path: 'airline',
                }
            })
            .populate({
                path: 'network_plan',
                populate: {
                    path: 'airport'
                }
            })
            .populate({
                path: 'network_plan',
                populate: {
                    path: 'aircraft'
                }
            })
            .populate('gate')
            .exec((err, data) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });