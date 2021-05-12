const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');

const gate_managementRouter = express.Router();

gate_managementRouter.use(bodyParser.json());

module.exports = gate_managementRouter;

gate_managementRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('gate_management.html', { root: path.join(__dirname, '../public') });
    });

gate_managementRouter.route('/pending_plans')
    .get((req, res, next) => {
        var info = req.query.key;
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