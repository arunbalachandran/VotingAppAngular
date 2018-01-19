const jwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const userMod = require('../models/userModel');
const configuration = require('../configuration/database');

// used for route authorization
module.exports = function(passport) {
    let options = {};
    // key value syntax?
    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = configuration.secret;
    passport.use(new jwtStrategy(options, (jwtPayload, doneCallback) => {
        console.log("Jwt payload is " + jwtPayload);
        userMod.getUserById(jwtPayload._id, (errorCode, user) => {
            if (errorCode) {
                return doneCallback(errorCode, false);
            }
            // if user exists
            if (user) {
                // no error
                return doneCallback(null, user);
            }
            else {
                // no error but no user either -> user not found?
                return doneCallback(null, false);
            }
        });
    }));
};