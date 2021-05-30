var express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { authenticate } = require('passport');

router.get('/', function(req, res, next) {
    if (req.session.passport) {
        var username = req.session.passport.user;
        var logged = true;
    } else {
        var username = null;
        var logged = false;
    }
    console.log(req.session)
    res.render('index', { username: username, logged: logged, expressFlash: req.session.flash })
});

module.exports = router;