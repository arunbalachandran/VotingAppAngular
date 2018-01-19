const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');
const mongoose = require('mongoose');  // for communicating with mongoDB

// app specific configuration
const app = express();
const port = 3000;
const users = require('./routes/users');
const configuration = require('./configuration/database');

mongoose.connect(configuration.database);

mongoose.connection.on('connected', () => {
    console.log('Established connection to database' + configuration.database);
});

mongoose.connection.on('error', (errorCode) => {
    console.log('Database experienced error : ' + errorCode);
});

// to allow CORS
app.use(cors());

// body parser middleware allows us to access form body data
app.use(bodyParser.json());

// use Passport
app.use(passport.initialize());
app.use(passport.session());
require('./configuration/passport')(passport);

// allow the app to use a static folder
app.use(express.static(path.join(__dirname, 'staticFiles')));

// use the /users route from the routes folder
app.use('/users', users);

// add a demo route
app.get('/', (request, response) => {
    response.send("Flesh out the demo app");
});

app.listen(port, () => {
    console.log("Hello world! The application has started on port " + port + "\n");
});
