const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const configuration = require('../configuration/database');
// this is the mongoose enforced model made out of the UserSchema which was exposed using module.exports = mongoose.model(....)
const userModel = require('../models/userModel');
const fruitModel = require('../models/fruitModel');
// each of these routes are /api/xxxxx where xxxxxx is a placeholder for the route defined below
// Registration route for user
router.post('/registration', (request, response, next) => {
    // response.send("Registration page");
    // an implementation class for the schema enforcement (handwavy)
    // let allows me to reassign values to variables unlike const
    let newUser = new userModel({
        name: request.body.name,
        email: request.body.email,
        username: request.body.username,
        password: request.body.password,
        fruit: ''
    })

    // probably is the callback executed in the newUser.save method
    userModel.addUser(newUser, (errorCode, user) => {
        if (errorCode) {
            // failed to update password with hash
            response.json({success: false, msg: 'Failed to register user. Please try again.'});
        }
        else {
            response.json({success: true, msg: 'User registered successfully!'});
        }
    });
});

// Authentication route for user
// something inside authentication, runs your callback
router.post('/authentication', (request, response, next) => {
    // fetch the data sent in here
    const username = request.body.username;
    const password = request.body.password;

    // the tuple notation below acts as the callback function
    userModel.getUserByUsername(username, (errorCode, user) => {
        console.log('Username being queried is ' + username);
        if (errorCode) {
            throw errorCode;
        }

        if (!user) {
            console.log('Query is ' + user);
            return response.json({success: false, msg: 'User not found'});
        }

        userModel.comparePassword(password, user.password, (errorCode, passwordMatch) => {
            if (errorCode) {
                throw errorCode;
            }
            console.log("Null (no) error code thrown on password match - " + passwordMatch);
            if (passwordMatch) {
                // token expires in a day
                console.log("User value is " + user);
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
                        email: user.email,
                        fruit: user.fruit
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

router.get('/profile', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    response.json({user: request.user});
})

router.get('/fruits', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    // response.send("Voting page");
    fruitModel.getFruits({}, (errorCode, fruitsList) => {
        if (errorCode) {
            // failed to update password with hash
            console.log('Failed to find fruits list');
            response.json({success: false, msg: 'Failed to find fruits list. Please try again.'});
        }
        else {
            console.log('Fetched fruits list from model ...' + fruitsList);
            response.json(fruitsList);
        }
    });
});

// TODO: add validations to both the functions below
// Count the number of votes for each fruit
// we can guard this page by adding the passport authenticate module as a parameter
router.get('/votes', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    // response.send("Voting page");
    userModel.aggregate([{"$group" : {_id: "$fruit", cnt: {$sum: 1}}}], (errorCode, result) => {
        if (errorCode) {
            throw errorCode;
        }

        console.log("Aggregated count is " + result);
        response.json(result);
    });
});

// fruit has to be one of apple, orange, banana, pineapple
router.put('/votes', passport.authenticate('jwt', {session: false}), (request, response, next) => {
    const userName = request.body.username;
    console.log("The user " + userName + " is changing vote");
    const userFruit = request.body.fruit;
    console.log("The fruit being sent in for updation is " + userFruit);
    // using Mongoose syntax
    const userQuery = {username: userName};
    const updateQuery = {fruit: userFruit};
    // should define a callback
    userModel.update(userQuery, updateQuery, (errorCode, numUpdated) => {
        console.log('Update query fired');
        if (errorCode) {
            throw errorCode;
        }

        userModel.getUserByUsername(userName, (errorCode, user) => {
            console.log('Username being queried is ' + userName);
            if (errorCode) {
                throw errorCode;
            }

            if (!user) {
                console.log('Query is ' + user);
                return response.json({success: false, msg: 'User not found'});
            }

            // return the user and his details after updation
            response.json({
                success: true,
                user: {
                    id: user._id,
                    name: user.name,
                    username: user.username,
                    email: user.email,
                    fruit: user.fruit
                }
            });
        });
    });
});

module.exports = router;