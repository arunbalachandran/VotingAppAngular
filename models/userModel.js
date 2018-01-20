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
    },
    fruit: {
        type: String,
        required: false
    }
});

// an implementation (hand wavy) of the schema enforcement like a class
// the below line tells us that use the mongoose model function as the constructor if userModel is used in another file (exposes)
// giving a name User, will generate a users (plural) collection in the database
const UserModel = module.exports = mongoose.model('User', UserSchema);
// allow us to use this function in an import of userModule
module.exports.addUser = function(newUser, callback) {
    bcrypt.genSalt(10, (errorCode, salt) => {
        // after bcrypt.hash runs, an error code and a hash will be generated which are passed onto a callback -> (errorCode, hash)
        // the callback saves this hash value in the newUser.password field
        bcrypt.hash(newUser.password, salt, (errorCode, hash) => {
            if (errorCode) {
                throw errorCode;
            }
            // the let keyword in api.js allows us to modify this password field
            // we overwrite the original password with a hash value
            newUser.password = hash;
            // the save method probably internally runs the callback
            newUser.save(callback);
        });
    });
};

// a function that allows us to retrieve a user by id
module.exports.getUserById = function(id, callback) {
    UserModel.findById(id, callback);
};

// a function that allow us to retrieve a user by username 
module.exports.getUserByUsername = function(username, callback) {
    const getQuery = {username: username};
    // equivalent to flask db.users.find_one
    UserModel.findOne(getQuery, callback);
};

module.exports.comparePassword = function(givenPassword, hash, callback) {
    bcrypt.compare(givenPassword, hash, (errorCode, passwordMatch) => {
        if (errorCode) {
            throw errorCode;
        }
        callback(null, passwordMatch);
    });
}