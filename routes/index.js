var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;