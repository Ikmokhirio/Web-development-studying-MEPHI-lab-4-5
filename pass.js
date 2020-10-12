const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const User = require('./database').User
const cookieName = require('./config/settings').session.cookieName;
const createNewUser = require('./database').createNewUser;
const isUserExist = require('./database').isUserExist;
const getUserPassword = require('./database').getUserPassword;
const findUserById = require('./database').findUserById;
const findUser = require('./database').findUser
const argon = require('argon2');

const loginStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        findUser(username).then(user => {
            if (user !== undefined && user !== null) {

                getUserPassword(username).then(hash => {

                    argon.verify(hash, password).then((result) => {
                        if (result) {
                            return done(null, user);
                        }

                        return done(null, false, {message: 'Incorrect password'});
                    }).catch(e => {
                        return done(null, false, {message: "Error : " + e});
                    });

                }).catch(e => {
                    return done(null, false, {message: "Error : " + e});
                });

            } else {
                return done(null, false, {message: "No such user"});
            }
        }).catch(e => {
            return done(null, false, {message: "Error : " + e});
        });
    }
);

const registerStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        isUserExist(username).then(res => {
            if (res) {
                return done(null, false, {message: "User already exist"});
            } else {
                createNewUser(username, password, req.body.phone_number, req.body.gender, req.body.description).then(newUser => {
                    return done(null, newUser);
                }).catch(e => {
                    return done(null, false, {message: "Error : " + e});
                });
            }
        }).catch(e => {
            return done(null, false, {message: "Error : " + e});
        });
    }
);

const cookieStrategy = new CookieStrategy({
    cookieName: cookieName,
    passReqToCallback: true
}, function (req, session, done) {
    if (!req.user) return done(null, false, {message: "You should authorize to access this page"});

    findUser(req.user.username).then(user => {
        if (user !== undefined && user !== null) {
            return done(null, user);
        } else {
            return done(null, false, {message: "You should authorize to access this page"});
        }
    }).catch(e => {
        console.log("Error : " + e);
        return done(null, false, {message: "You should authorize to access this page"});
    });

});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {

    findUserById(id).then(user => {
        done(null, user);
    });

});

passport.use('login', loginStrategy);
passport.use('register', registerStrategy);
passport.use('cookie', cookieStrategy);


exports.passport = passport;