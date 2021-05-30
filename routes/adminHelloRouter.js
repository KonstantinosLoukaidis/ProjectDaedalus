const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const adminHelloRouter = express.Router();

adminHelloRouter.use(bodyParser.json());

adminHelloRouter.route('/')
    .get((req, res, next) => {
        res.render('hello_admin');
    });

module.exports = adminHelloRouter;