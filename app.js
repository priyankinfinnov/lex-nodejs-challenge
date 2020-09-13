const express = require('express');
const app = express();

const UserRoutes = require('./routes/user.js');
const ModeratorRoutes = require('./routes/moderator.js');

let bodyParser = require('body-parser');
app.use(bodyParser.json())

error = function error(status, msg) {   //global error function
    var err = new Error(msg);
    err.status = status;
    return err;
}

app.use('/user', UserRoutes);

app.use('/moderator', ModeratorRoutes);

app.use(function(err, req, res, next){  //global error handler to return response
    res.status(err.status || 500);
    res.send({ error: err.message });
});

app.use(function(req, res){ 
    res.status(404).send({ error: "Not Found" });
});

module.exports = app;