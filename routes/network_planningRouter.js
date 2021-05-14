const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');
const Airplanes = require('../models/airplanes');

const network_planningRouter = express.Router();

network_planningRouter.use(bodyParser.json());

const daysParser = Object({
    "Monday": 1,
    "Tuesday": 2,
    "Wednesday": 3,
    "Thursday": 4,
    "Friday": 5,
    "Saturday": 6,
    "Sunday": 7
})

network_planningRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('network_planning.html', { root: path.join(__dirname, '../public') });
    })
    .post((req, res, next) => {
        console.log(req.body);
        if (Array.isArray(req.body.arrival_time)) {
            for (i in req.body.arrival_time) {
                if (req.body.arrival_time[i] != "") {
                    if (daysParser[req.body.arr_day[i]] - daysParser[req.body.arr_day[i]] == 0) {
                        console.log("Can't have arrival and departure on the same day")
                    } else {
                        Network_Planner.create(req.body)
                            .then((plan) => {
                                const tempPromise = new Promise((res, rej) => {
                                    let temp_ar_dep = {
                                        arrival_day: req.body.arr_day[i],
                                        arrival_time: req.body.arrival_time[i],
                                        departure_time: req.body.dep_time[i],
                                        departure_day: req.body.dep_day[i]
                                    }
                                    plan.ar_dep = temp_ar_dep
                                    Airplanes.find({ $and: [{ Manufacturer: req.body.ac_man }, { Model: req.body.ac_model }] })
                                        .then((x) => {
                                            plan.aircraft = x[0]._id;
                                        })
                                        .catch((err) => next(err));
                                    Airlines.find({ $or: [{ IATA: req.body.airline_iata }, { ICAO: req.body.airline_icao }, { name: req.body.airline_name }] })
                                        .then((x) => {
                                            plan.airline = x[0]._id;
                                        })
                                        .catch((err) => next(err));
                                    Airports.find({ $or: [{ iata: req.body.airport_iata }, { icao: req.body.airport_icao }, { name: req.body.airport_name }] })
                                        .then((x) => {
                                            plan.airport = x[0]._id;
                                            res(plan);
                                        })
                                        .catch((err) => next(err));
                                }).then((plan) => {
                                    console.log("promise fullfilled");
                                    plan.save();
                                });
                            }, (err) => {
                                next(err);
                            })
                            .catch((err) => next(err));
                    }
                }
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.redirect('/network_planning');
        } else {
            if (req.body.arrival_time != "") {
                Network_Planner.create(req.body)
                    .then((plan) => {
                        const tempPromise = new Promise((res, rej) => {
                            let temp_ar_dep = {
                                arrival_day: req.body.arr_day,
                                arrival_time: req.body.arrival_time,
                                departure_time: req.body.dep_time,
                                departure_day: req.body.dep_day
                            }
                            plan.ar_dep = temp_ar_dep
                            Airplanes.find({ $and: [{ Manufacturer: req.body.ac_man }, { Model: req.body.ac_model }] })
                                .then((x) => {
                                    plan.aircraft = x[0]._id;
                                })
                                .catch((err) => next(err));
                            Airlines.find({ $or: [{ IATA: req.body.airline_iata }, { ICAO: req.body.airline_icao }, { name: req.body.airline_name }] })
                                .then((x) => {
                                    plan.airline = x[0]._id;
                                })
                                .catch((err) => next(err));
                            Airports.find({ $or: [{ iata: req.body.airport_iata }, { icao: req.body.airport_icao }, { name: req.body.airport_name }] })
                                .then((x) => {
                                    plan.airport = x[0]._id;
                                    res(plan);
                                })
                                .catch((err) => next(err));
                        }).then((plan) => {
                            console.log("promise fullfilled");
                            plan.save();
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.redirect('/network_planning');
                        });
                    }, (err) => {
                        next(err);
                    })
                    .catch((err) => next(err));
            }
        }

    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /network_planning');
    })
    .delete((req, res, next) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /network_planning');
    });

network_planningRouter.route('/retrieve_airlines')
    .get((req, res, next) => {
        var info = req.query.key;
        Airlines.find({
                $or: [{ IATA: info }, { ICAO: info }, { name: info }]
            })
            .then((data, err) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

network_planningRouter.route('/retrieve_airports')
    .get((req, res, next) => {
        var info = req.query.key;
        Airports.find({
                $or: [{ iata: info }, { icao: info }, { name: info }]
            })
            .then((data, err) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

network_planningRouter.route('/ac_man_find')
    .get((req, res, next) => {
        Airplanes.aggregate([{
                $group: {
                    _id: "$Manufacturer"
                }
            }, {
                $sort: {
                    _id: 1
                }
            }])
            .then((data, err) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });

network_planningRouter.route('/ac_model_find')
    .get((req, res, next) => {
        var manufacturer = req.query.key;
        Airplanes.find({ Manufacturer: manufacturer }, { Model: 1, _id: 0 }).sort({ Model: 1 })
            .then((data, err) => {
                if (err) throw err;
                else if (!data) res.send(null);
                else res.send(data);
            });
    });



module.exports = network_planningRouter;