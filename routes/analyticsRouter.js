const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const ReadWriteLock = require('rwlock');

const analyticsRouter = express.Router();

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const Airplanes = require('../models/airplanes');
const GateDispatcher = require('../models/gateDispatcher');
const Gates = require('../models/gates');
const Flight = require('../models/flight');
const { data } = require('jquery');

analyticsRouter.use(bodyParser.json());

const analyticsJSON = './models/analytics.json';
var lock = new ReadWriteLock();

analyticsRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('analytics.html', { root: path.join(__dirname, '../public') });
    });

analyticsRouter.route('/getAnalyticsData')
    .get((req, res, next) => {
        new Promise((resolve, rej) => {
                fs.readFile(analyticsJSON, function(err, data) {
                    if (err) {
                        console.log(err);
                    } else {
                        checkUpPassedFlights(JSON.parse(data))
                    }
                    resolve()
                })
            })
            .then(() => {
                console.log("Sending data")
                fs.readFile(analyticsJSON, (err, data) => {
                    if (err) {
                        res.send(err)
                    }
                    let dataJSON = JSON.parse(data);
                    res.send(dataJSON)
                })
            })
    })

analyticsRouter.route('/getConnectedAirports')
    .get((req, res, next) => {
        Flight.find({})
            .populate("gate_dispatcher")
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
                        path: 'airline'
                    }
                }
            })
            .exec((err, data) => {
                if (err) throw err;
                res.send(data)
            })
    })

analyticsRouter.route('/:id')
    .get((req, res, next) => {
        res.sendFile('flight_invoice.html', { root: path.join(__dirname, '../public') });
    })

analyticsRouter.route('/:id/getInvoiceData')
    .get((req, res, next) => {
        Flight.find({ _id: req.params.id })
            .populate("gate_dispatcher")
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
                        path: 'airline'
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
            .exec((err, data) => {
                if (err) throw err;
                res.send(data)
            })
    });


const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getrawDate(wanted_days) {
    const wanted_date = new Date(Date.now());
    wanted_date.setDate(wanted_date.getDate() + wanted_days);
    return wanted_date
}

function checkUpPassedFlights(dataJSON) {
    new Promise((res, rej) => {
            let upperbound = getrawDate(1)
            upperbound.setHours(23, 59, 59, 999)
            let tz = (new Date()).getTimezoneOffset() * 60000;
            upperbound = (new Date(upperbound - tz)).toISOString()
            Flight.find({ 'flight_arrival': { "$lt": upperbound }, 'passed': false })
                .then((results) => {
                    for (let data of results) {
                        dataJSON["totals"].earnings += data.total_ammount;
                        dataJSON["totals"].parking_fees += data.parking_charge;
                        dataJSON["totals"].landing_charges += data.landing_charge;
                        dataJSON["totals"].prm_charges += data.passengers_charges;
                        dataJSON["totals"].passengers += data.passengers;
                        dataJSON["totals"].flights += 1;


                        let flightDate = new Date(data.flight_arrival)
                        console.log(months[flightDate.getMonth()])

                        dataJSON[months[flightDate.getMonth()]].earnings += data.total_ammount;
                        dataJSON[months[flightDate.getMonth()]].parking_fees += data.parking_charge;
                        dataJSON[months[flightDate.getMonth()]].landing_charges += data.landing_charge;
                        dataJSON[months[flightDate.getMonth()]].prm_charges += data.passengers_charges;
                        dataJSON[months[flightDate.getMonth()]].passengers += data.passengers;
                        dataJSON[months[flightDate.getMonth()]].flights += 1;

                        //if (Date(data.flight_arrival) < Date()) {
                        Flight.findByIdAndUpdate(String(data._id), { passed: true }, (err, docs) => {
                                if (err) console.log(err)
                            })
                            //}
                    }
                    res(dataJSON)
                })
                .catch((err) => { throw err })

        })
        .then((dataJSON) => updateJSON(dataJSON))
}

function updateJSON(dataJSON) {
    fs.writeFile(analyticsJSON, JSON.stringify(dataJSON, null, 2), err => {
        if (err) throw err;
        console.log('File has been saved!')
    });
}

module.exports = analyticsRouter;