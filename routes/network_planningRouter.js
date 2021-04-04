const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
//const authenticate = require('../authenticate');

const Network_Planner = require('../models/network_planner');

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
                res.json(plan)
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


module.exports = network_planningRouter;