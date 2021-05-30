var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/user');
var passport = require('passport');
var authenticate = require('../authenticate');

var router = express.Router();
router.use(bodyParser.json());

router.post('/signup', (req, res, next) => {
    User.register(new User({ username: req.body.username }),
        req.body.password, (err, user) => {
            if (err) {
                res.statusCode = 500;
                res.setHeader('Content-Type', 'application/json');
                res.json({ err: err });
            } else {
                passport.authenticate('local')(req, res, () => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json({ success: true, status: 'Registration Successful!' });
                });
            }
        });
});


router.get('/login', (req, res) => {
    res.redirect('/')
})

router.get('/loginSuccessful', (req, res) => {
    res.redirect('/')
})

router.get('/loginFailed', (req, res) => {
    res.redirect('/')
})

router.post('/login',
    passport.authenticate('local', {
        failureRedirect: '/users/loginFailed',
        failureFlash: true
    }), (req, res) => {
        res.redirect('/users/loginSuccessful')
    }
);

router.get('/logout', (req, res) => {
    if (req.session) {
        req.logout()
        req.session.destroy(function(err) {
            res.clearCookie('session-id')
            res.redirect('/');
        });
    } else {
        var err = new Error('You are not logged in!');
        err.status = 403;
        next(err);
    }
});


module.exports = router;