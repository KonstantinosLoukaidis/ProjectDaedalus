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
const Flight = require('../models/flight')

const flight_applicationRouter = express.Router();

flight_applicationRouter.use(bodyParser.json());

flight_applicationRouter.route('/')
    .get((req, res, next) => {
        res.render('flight_applications')
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
                GateDispatcher.find({ 'network_plan': req.body.plan_id })
                    .then((data, err) => {
                        console.log(data)
                        removeFlight(data[0]._id);
                        removeGate(req.body.plan_id);
                    })
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
        res.render('flight_profile');
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
            .populate('airline')
            .exec((err, data) => {
                if (err) throw err;
                else {
                    var plan_class = data[0].aircraft.CLASSI;
                    var airline_iata = data[0].airline.IATA;
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
                                            dispatchGate(gate_id, plan_id, airline_iata);
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
                                            dispatchGate(gates[0]._id, plan_id, airline_iata);
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

function dispatchGate(gate_id, plan_id, airline_iata) {
    let dataToSend = {
        network_plan: plan_id,
        gate: gate_id,
        arr_runway: "EAST1",
        dep_runway: "EAST2",
        flight_number: generateFlightNumber(airline_iata, gate_id)
    };
    let newGateDispatched = new GateDispatcher(dataToSend)
    newGateDispatched.save((err) => {
        if (err) throw err;
        else(allocateFlight(newGateDispatched, plan_id))
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

const daysParser = Object({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 0
})

function getWantedDate(wanted_days) { //Gets next closest day
    const wanted_date = new Date(Date.now());
    if ((wanted_days - wanted_date.getDay()) < 0) wanted_days = 7 - Math.abs((wanted_days - wanted_date.getDay()))
    else wanted_days = wanted_days - wanted_date.getDay();
    wanted_date.setDate(wanted_date.getDate() + wanted_days);
    return wanted_date
}


function getNextDate(previousDate, wanted_days) {
    const nextdate = new Date(previousDate);
    if ((wanted_days - nextdate.getDay()) < 0) wanted_days = 7 + (wanted_days - nextdate.getDay())
    else wanted_days = wanted_days - previousDate.getDay();
    nextdate.setDate(previousDate.getDate() + wanted_days);
    return nextdate
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

function delay_generator(use) {

    //possibilities of delay 10%
    let p = getRandomInt(0, 9);
    let delay;

    //if p = 0 => we have delay
    if (p === 0) {

        //delay in minutes
        delay = getRandomInt(15, 180);

    } else if (use == 1) {
        //non significant delay
        delay = getRandomInt(-15, 14);
    } else if (use == 2) {
        delay = getRandomInt(0, 14);
    }

    //return expected time difference in minutes
    //console.log(delay)
    return delay
}


function allocateFlight(gatedispatchedId, planId) {
    Network_Planner.findOne({ '_id': planId })
        .populate('aircraft')
        .populate('airline')
        .exec((err, data) => {
            if (err) throw err
            let dates = WeeksInDueDate(data.plan_expire, daysParser[String(data.ar_dep.arrival_day)])
            console.log(dates)
            for (date of dates) {
                let dataToSend = {
                    flight_number: null,
                    gate_dispatcher: gatedispatchedId,
                    passengers: Math.floor(Math.random() * 180),
                    passengers_charges: 0,
                    paid: false,
                    landing_charge: 0,
                    parking_charge: 0,
                    total_ammount: 0,
                    parking_surcharges: 0,
                    landing_surcharges: 0,
                    flight_arrival: null,
                    expected_arrival: null,
                    flight_departure: null,
                    expected_departure: null,
                    passed: false
                }
                new Promise((res, rej) => {
                    let tempObj1 = calculateLandingCharges(data.aircraft.MTOW, data.ar_dep)
                    dataToSend.landing_charge = (tempObj1.landingCharges).toFixed(2);
                    dataToSend.landing_surcharges = tempObj1.surcharges;
                    let tempObj2 = calculateParkingCharges(data.aircraft.MTOW, data.ar_dep)
                    dataToSend.parking_charge = (tempObj2.parkingCharges).toFixed(2);
                    dataToSend.parking_surcharges = tempObj2.surcharges;
                    let passengers_charges = 9.72 * dataToSend.passengers;
                    dataToSend.passengers_charges = (passengers_charges).toFixed(2);
                    dataToSend.total_ammount = (passengers_charges + tempObj2.parkingCharges + tempObj1.landingCharges).toFixed(2);
                    dataToSend.flight_number = generateFlightNumber(data.airline.IATA, gatedispatchedId._id);
                    let artimes = data.ar_dep.arrival_time.split(':');
                    let deptimes = data.ar_dep.departure_time.split(':')
                    let ardate = new Date(date)
                    ardate.setHours(artimes[0], artimes[1], 0) //for flight to be unique
                    let expdate = new Date(ardate.getTime() + delay_generator(1) * 60000);
                    let atz = ardate.getTimezoneOffset() * 60000;
                    let etz = expdate.getTimezoneOffset() * 60000;
                    dataToSend.flight_arrival = (new Date(ardate - atz)).toISOString()
                    let depdate = getNextDate(ardate, daysParser[String(data.ar_dep.departure_day)]);
                    let expddate = new Date(depdate.getTime() + delay_generator(2) * 60000);
                    let edtz = expddate.getTimezoneOffset() * 60000;
                    depdate.setHours(deptimes[0], deptimes[1], 0)
                    let dtz = depdate.getTimezoneOffset() * 60000;
                    dataToSend.flight_departure = (new Date(depdate - dtz)).toISOString();
                    dataToSend.expected_departure = (new Date(expddate - edtz)).toISOString();
                    dataToSend.expected_arrival = (new Date(expdate - etz)).toISOString();
                    let newFlight = new Flight(dataToSend)
                    newFlight.save((err) => {
                        if (err) throw err;
                        else(console.log(dataToSend))
                    })
                    res()
                })
            }
        })
}

function removeFlight(gateDispatcherId) {
    console.log(gateDispatcherId)
    Flight.deleteMany({ 'gate_dispatcher': gateDispatcherId })
        .then((data, err) => {
            if (err) throw err
            else {
                console.log(data)
            }
        })
}

function calculateLandingCharges(MTOW, ar_dep) {
    let wanted_date = getWantedDate(daysParser[String(ar_dep.arrival_day)]);
    let ar_time = ar_dep.arrival_time
    let landingChargeBeforeSurcharges = 0;
    MTOW = Number(MTOW.split(',').slice(0, 2).join('.'));
    let surcharges = 1;
    let upperDate = new Date().setHours(21, 0, 0);
    let lowerDate = new Date().setHours(6, 0, 0);
    if (MTOW <= 10) landingChargeBeforeSurcharges = MTOW * 11.5
    else if (MTOW > 25 && MTOW <= 50) landingChargeBeforeSurcharges = (25 * 28.67) + ((MTOW - 25) * 1.438)
    else if (MTOW > 50 && MTOW <= 65) landingChargeBeforeSurcharges = (50 * 64.62) + ((MTOW - 50) * 1.6141)
    else if (MTOW > 65 && MTOW <= 80) landingChargeBeforeSurcharges = (65 * 88.83) + ((MTOW - 65) * 1.6434)
    else if (MTOW > 80 && MTOW <= 150) landingChargeBeforeSurcharges = (80 * 113.48) + ((MTOW - 80) * 1.6141)
    else if (MTOW > 150 && MTOW <= 300) landingChargeBeforeSurcharges = (150 * 226.47) + ((MTOW - 150) * 1.6434)
    else if (MTOW > 10 && MTOW <= 25) landingChargeBeforeSurcharges = (10 * 11.5) + ((MTOW - 10) * 1.455)
    else landingChargeBeforeSurcharges = (300 * 472.99) + ((MTOW - 300) * 1.2913)

    ar_time = ar_time.split(':');
    ar_time = new Date().setHours(Number(ar_time[0]), Number(ar_time[1]), 0);
    if (ar_time > upperDate || ar_time < lowerDate) surcharges = 1.4
    if (wanted_date.getMonth() >= 5 && wanted_date.getMonth() <= 8) surcharges += 0.25
    else if ((wanted_date.getMonth() >= 9 || wanted_date.getMonth() <= 2)) surcharges -= 0.4
    surcharges = Math.round(surcharges * 100) / 100
    let toReturn = {
        landingCharges: landingChargeBeforeSurcharges * surcharges,
        surcharges: Math.round((surcharges - 1) * 100) / 100
    }
    return toReturn
}

function calculateParkingCharges(MTOW, ar_dep) {
    let surcharges = 1;

    let ar_time = ar_dep.arrival_time.split(':');
    let ar_date = getWantedDate(daysParser[String(ar_dep.arrival_day)]);
    ar_date.setHours(Number(ar_time[0]), Number(ar_time[1]), 0);

    let dep_time = ar_dep.departure_time.split(':');
    let dep_date = getWantedDate(daysParser[String(ar_dep.departure_day)]);
    ar_date.setHours(Number(dep_time[0]), Number(dep_time[1]), 0);

    let timeDif = (ar_date.getTime() - dep_date.getTime()) / (1000 * 3600);
    timeDif = Math.abs(Math.round(timeDif)) - 2;
    MTOW = Number(MTOW.split(',').slice(0, 2).join('.'));
    let parkingChargeBeforeSurcharges = 0;
    if (MTOW <= 10) parkingChargeBeforeSurcharges = timeDif * 0.2759
    else if (MTOW > 10 && MTOW <= 50) parkingChargeBeforeSurcharges = timeDif * 0.0275 * MTOW
    else if (MTOW > 50 && MTOW <= 100) parkingChargeBeforeSurcharges = timeDif * 0.0344 * MTOW
    else if (MTOW > 100 && MTOW <= 200) parkingChargeBeforeSurcharges = timeDif * 0.0412 * MTOW
    else parkingChargeBeforeSurcharges = timeDif * 0.0481 * MTOW
    if ((ar_date.getMonth() >= 9 || ar_date.getMonth() <= 2)) surcharges = 0.5
    surcharges = Math.round(surcharges * 100) / 100
    let toReturn = {
        parkingCharges: parkingChargeBeforeSurcharges * surcharges,
        surcharges: Math.round((surcharges - 1) * 100) / 100
    }
    return toReturn
}

function generateFlightNumber(IATA, id) {
    id = String(id)
    flight_number = IATA + " ";
    for (let i = 1, counter = 0; i < id.length; i++) {
        if (id.slice(-(i + 1), -i).match(/[0-9]/i) != null) {
            flight_number += id.slice(-(i + 1), -i)
            counter++
        }
        if (counter == 3) break
    }
    return flight_number
}

function WeeksInDueDate(duedate, days) {
    duedate = new Date(duedate)
    let wantedDates = []
    let b = new Date()
    if (getWantedDate(days).getDate() == b.getDate()) days += 7
    while (getWantedDate(days) < duedate) {
        b = getWantedDate(days)
        wantedDates.push(b)
        days += 7
    }
    if (wantedDates[0] == wantedDates[1]) wantedDates.shift()
    return wantedDates
}



module.exports = flight_applicationRouter;