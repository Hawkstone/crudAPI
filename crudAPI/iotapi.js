var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// default route
app.get('/', function (req, res) {
    return res.send({ error: true, message: 'hello' })
});
// set port
app.listen(port, function () {
    console.log('Node iotapi is running on port ${port}');
});
module.exports = app;


var dbConn = require('./lib/db');


// Retrieve all users 
app.get('/listUsers', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list.' });
    });
});
