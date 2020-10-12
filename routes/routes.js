const router = require('express').Router();
const passport = require('../pass').passport;

const logger = require('../logger');
const {
    HttpError,
    FORBIDDEN,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR
} = require("../httpError");


router.use(logger.logRequestToConsole);

router.get('/', function (req, res) {
    res.render("index.hbs");
});

router.get('/login', function (req, res) {
    console.log(req.flash());
    res.render("login.hbs");
});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', function (req, res) {
    console.log(req.flash());
    res.render("register.hbs");
});

router.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/profile', function (req, res) {
    res.render("profile.hbs");
});

//==============Error handle and logging===========================

router.use(function (req, res, next) {
    throw new HttpError(NOT_FOUND, 'Not Found');
});

router.use(function (err, req, res, next) {

    if (!err.statusCode) {
        err.statusCode = INTERNAL_SERVER_ERROR;
        err.name = INTERNAL_SERVER_ERROR + " ERROR";
    }


    res.status(err.statusCode).render("error.hbs", {
        message: err.message,
        error_name: err.name
    });
    next(err);
});

router.use(logger.logErrorsToFile);

module.exports = router;