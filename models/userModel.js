const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configuration = require('../configuration/database');

// Vote user schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

const User = module.exports = mongoose.model('User', UserSchema);

// a function that allows us to retrieve a user by id
module.exports.getUserById = function(id, callback) {
    User.findById(id, callback);
};

// a function that allow us to retrieve a user by username
module.exports.getUserByUsername = function(username, callback) {
    const getQuery = {username: username};
    User.findOne(getQuery, callback);
};

module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (errorCode, salt) => {
        bcrypt.hash(newUser.password, salt, (errorCode, hash) => {
            if (errorCode) {
                throw errorCode;
            }
            newUser.password = hash;
            newUser.save(callback);
        });
    });
};

module.exports.comparePassword = function(givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, (errorCode, passwordMatch) => {
        if (errorCode) {
            throw errorCode;
        }
        callback(null, passwordMatch);
    });
}