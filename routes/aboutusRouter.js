const express = require('express');
const path = require('path');

const aboutusRouter = express.Router();

aboutusRouter.route('/')
    .get((req, res, next) => {
        res.render('aboutus');
    });

module.exports = aboutusRouter;