const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const Airplanes = require('../models/airplanes');
const GateDispatcher = require('../models/gateDispatcher');
const Gates = require('../models/gates');
const Flight = require('../models/flight');

const flight_tableRouter = express.Router();

flight_tableRouter.use(bodyParser.json());

flight_tableRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('flight_Table.html', { root: path.join(__dirname, '../public') });
    })

flight_tableRouter.route('/getArrivals?')
    .get((req, res, next) => {
        console.log(req.url)
    })

module.exports = flight_tableRouter;