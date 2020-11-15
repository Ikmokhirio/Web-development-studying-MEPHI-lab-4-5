const router = require('express').Router();
const passport = require('../pass').passport;
const updateData = require('../database').updateData;

//Additional
findUserById = require('../database').findUserById;
deleteUserById = require('../database').deleteUserById;
findAllUsers = require('../database').findAllUsers;
createNewUser = require('../database').createNewUser;

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

    let message = req.flash();

    res.render("login.hbs", {
        message: message.error
    });

});

router.post('/login', passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.get('/register', function (req, res) {

    let message = req.flash();

    res.render("register.hbs", {
        message: message.error
    });

});

router.post('/register', passport.authenticate('register', {
    successRedirect: '/',
    failureRedirect: '/register',
    failureFlash: true
}));

router.get('/profile', passport.authenticate('cookie', {
    failureRedirect: '/login',
    failureFlash: {message: "You should authorize to access this page"}
}), function (req, res) {
    res.render('profile.hbs', {
        username: req.user.username,
        phone: req.user.phone_number,
        gender: req.user.gender,
        description: req.user.description
    })
});

router.get('/settings', passport.authenticate('cookie', {
    failureRedirect: '/login',
    failureFlash: {message: "You should authorize to access this page"}
}), function (req, res) {
    res.render('settings.hbs');
});

router.post('/settings', passport.authenticate('cookie', {
    failureRedirect: '/login',
    failureFlash: true
}), updateData, function (req, res) {
    res.render('settings.hbs');
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

//==============CRUD===========================

router.get('/users', passport.authenticate('api', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    if (req.query.id) {
        findUserById(req.query.id).then(user => {
            if (user) {
                res.send(user);
            } else {
                throw new HttpError(INTERNAL_SERVER_ERROR, "During this operation an error occurred");
            }
        }).catch(e => {
            console.log(e);
            res.send(e);
        });
    } else {
        findAllUsers().then(users => {
            if (users) {
                res.send(users);
            } else {
                throw new HttpError(INTERNAL_SERVER_ERROR, "During this operation an error occurred");
            }
        }).catch(e => {
            console.log(e);
            res.send(e);
        });
    }
});

router.post('/users', passport.authenticate('api', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    let username = req.body.username;
    let password = req.body.password;
    let phone_number = req.body.phone_number;
    let gender = req.body.gender;
    let description = req.body.description;

    if (!description) description = "";

    if (!username || !password || !phone_number || !gender) throw new HttpError(BAD_REQUEST, "Incorrect parameters");

    createNewUser(username, password, phone_number, gender, description).then(user => {
        if (user) {
            res.send("Success");
        } else {
            throw new HttpError(INTERNAL_SERVER_ERROR, "During user creation an error occurred");
        }
    }).catch(e => {
        console.log(e);
        res.send(e);
    });

});

router.put('/users', passport.authenticate('api', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    if (!req.query.id) throw new HttpError(BAD_REQUEST, "Incorrect parameters");

    findUserById(req.query.id).then(user => {

        const body = req.body;
        if (body) {
            if (body.password) {
                user.password = body.password;
            }
            if (body.phone_number) {
                user.phone_number = body.phone_number;
            }
            if (body.gender) {
                user.gender = body.gender;
            }
            if (body.description) {
                user.description = body.description;
            }

            user.save().then(usr => {
                if (usr) {
                    res.send("Success");
                } else {
                    throw new HttpError(INTERNAL_SERVER_ERROR, "During this operation an error occurred");
                }
            });
        }

    }).catch(e => {
        console.log(e);
        res.send(e);
    });


});

router.delete('/users', passport.authenticate('api', {
    failureRedirect: '/login',
    failureFlash: true
}), function (req, res) {
    if (!req.query.id) throw new HttpError(BAD_REQUEST, "Incorrect parameters");
    deleteUserById(req.query.id).then(result => {
        console.log(result);
        if (result) {
            res.send("Success");
        } else {
            throw new HttpError(INTERNAL_SERVER_ERROR, "During this operation an error occurred");
        }
    }).catch(e => {
        console.log(e);
        res.send(e);
    });
});

//==============CRUD===========================

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