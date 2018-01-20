const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const configuration = require('../configuration/database');

// Vote user schema
const FruitSchema = mongoose.Schema({
    fruits: {
        type: [String],
        required: true
    }
});

// an implementation (hand wavy) of the schema enforcement like a class
// the below line tells us that use the mongoose model function as the constructor if userModel is used in another file (exposes)
// giving a name User, will generate a users (plural) collection in the database
const FruitModel = module.exports = mongoose.model('Allfruit', FruitSchema);
// allow us to use this function in an import of userModule

module.exports.getFruits = function(query, callback) {
    console.log('Inside get fruits method ...');
    FruitModel.findOne(query, (errorCode, fruitResult) => {
        var result = fruitResult;
        console.log("The result is " + result);
        callback(errorCode, result);
    });
};