const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const radarRouter = express.Router();

radarRouter.use(bodyParser.json());

radarRouter.route('/')
    .get((req, res, next) => {
        res.render('radar');
    });

module.exports = radarRouter;