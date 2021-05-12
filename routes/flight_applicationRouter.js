const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const Airplanes = require('../models/airplanes');

const flight_applicationRouter = express.Router();

flight_applicationRouter.use(bodyParser.json());

flight_applicationRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('flight_applications.html', { root: path.join(__dirname, '../public') });
    });


flight_applicationRouter.route('/getPendingData')
    .get((req, res, next) => {
        console.log('Fetch');
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
        console.log('Fetch');
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
        console.log('Fetch');
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




module.exports = flight_applicationRouter;