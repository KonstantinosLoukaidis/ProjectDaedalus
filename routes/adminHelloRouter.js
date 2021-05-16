const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const adminHelloRouter = express.Router();

adminHelloRouter.use(bodyParser.json());

adminHelloRouter.route('/')
    .get((req, res, next) => {
        res.sendFile('hello_admin.html', { root: path.join(__dirname, '../public') });
    });

module.exports = adminHelloRouter;