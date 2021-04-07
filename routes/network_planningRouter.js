const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');
const Airlines = require('../models/airlines');
const Airports = require('../models/airports');

const network_planningRouter = express.Router();

network_planningRouter.use(bodyParser.json());

network_planningRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('network_planning.html', { root: path.join(__dirname, '../public') });
    })
    .post((req, res, next) => {
        Network_Planner.create(req.body)
            .then((plan) => {
                console.log('Plan created ', plan);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.redirect('/network_planning');
            }, (err) => next(err))
            .catch((err) => next(err));
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

module.exports = network_planningRouter;