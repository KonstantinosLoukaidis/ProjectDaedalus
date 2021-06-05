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
        res.render('flight_table');
    })

const daysParser = Object({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
})

function getWantedDate(wanted_days) { //Gets next closest day
    const wanted_date = new Date(Date.now());
    if ((wanted_days - wanted_date.getDay()) < 0) wanted_days = 7 - Math.abs((wanted_days - wanted_date.getDay()))
    else wanted_days = wanted_days - wanted_date.getDay();
    wanted_date.setDate(wanted_date.getDate() + wanted_days);
    return wanted_date
}

function getrawDate(wanted_days) {
    const wanted_date = new Date(Date.now());
    wanted_date.setDate(wanted_date.getDate() + wanted_days);
    return wanted_date
}

flight_tableRouter.route('/getArrivals')
    .get((req, res, next) => {
        let lowerbound = getrawDate(-1)
        let upperbound = getrawDate(2)
        upperbound.setHours(23, 59, 59, 999)
        lowerbound.setHours(0, 0, 0, 0)
        let tz = (new Date()).getTimezoneOffset() * 60000;
        upperbound = (new Date(upperbound - tz)).toISOString()
        lowerbound = (new Date(lowerbound - tz)).toISOString()
        console.log(lowerbound)
        console.log(upperbound)
        Flight.find({ 'flight_arrival': { "$gte": lowerbound, "$lt": upperbound } })
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
                    path: 'gate'
                }
            })
            .sort('flight_arrival')
            .exec((err, data) => {
                res.send(data)
            })
    })

flight_tableRouter.route('/getDepartures')
    .get((req, res, next) => {
        let lowerbound = getrawDate(-1)
        let upperbound = getrawDate(2)
        upperbound.setHours(23, 59, 59, 999)
        lowerbound.setHours(0, 0, 0, 0)
        let tz = (new Date()).getTimezoneOffset() * 60000;
        upperbound = (new Date(upperbound - tz)).toISOString()
        lowerbound = (new Date(lowerbound - tz)).toISOString()
        Flight.find({ 'flight_departure': { "$gte": lowerbound, "$lt": upperbound } })
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
                    path: 'gate'
                }
            })
            .sort('flight_departure')
            .exec((err, data) => {
                if (!data) res.send(null)
                res.send(data)
            })
    })

module.exports = flight_tableRouter;