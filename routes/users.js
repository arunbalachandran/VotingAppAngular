const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const configuration = require('../configuration/database');
const User = require('../models/userModel');
// each of these routes are /users/xxxxx where xxxxxx is a placeholder for the route defined below
// Registration route for user
router.post('/registration', (request, response, next) => {
    // response.send("Registration page");
    let newUser = new User({
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password
    });

    User.addUser(newUser, (errorCode, user) => {
        if (errorCode) {
            response.json({success: false, msg: 'Failed to register user. Please try again.'});
        }
        else {
            response.json({success: true, msg: 'User registered successfully!'});
        }
    });
});

// Authentication route for user
router.post('/authentication', (request, response, next) => {
    // fetch the data sent in here
    const username = request.body.username;
    const password = request.body.password;

    // the tuple notation act as the callback function
    User.getUserByUsername(username, (errorCode, user) => {
        console.log('Username being queried is ' + username);
        if (errorCode) {
            throw errorCode;
        }

        if (!user) {
            console.log('Query is ' + user);
            return response.json({success: false, msg: 'User not found'});
        }

        User.comparePassword(password, user.password, (errorCode, passwordMatch) => {
            if (errorCode) {
                throw errorCode;
            }
            console.log("No error code thrown on password match - " + passwordMatch);
            if (passwordMatch) {
                // token expires in a day
                console.log("User value is " + user);
                console.log("The secret being " + configuration.secret);
                const jwtToken = jwt.sign(JSON.parse(JSON.stringify(user)), configuration.secret, {
                    expiresIn: "5h"
                });
                console.log("The password matches successfully!");
                response.json({
                    success: true,
                    token: 'JWT ' + jwtToken,
                    user: {
                        id: user._id,
                        name: user.name,
                        username: user.username,
                        email: user.email
                    }
                });
            }

            else {
                return response.json({success: false, msg: 'Wrong password'});
            }
        });
    });


    // response.send("Authentication page");
});

// Voting home route for user
// we can guard this page by adding the passport authenticate module as a parameter
router.get('/votehome', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    // response.send("Voting page");
    response.json({user: request.user});
});

module.exports = router;