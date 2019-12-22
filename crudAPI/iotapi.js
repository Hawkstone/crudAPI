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
    console.log('Node iotapi is running on port ' + port);
});
module.exports = app;


var dbConn = require('./lib/db');


// Retrieve all users 
app.get('/listUsers', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'users list' });
    });
});

// Retrieve user with id 
app.get('/listUser/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM users WHERE id=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'user record' });
    });
});


// Retrieve arduino table values for all users
app.get('/listArduino', function (req, res) {
    dbConn.query('SELECT * FROM arduino', function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'arduino table list' });
    });
});

// Retrieve arduino table values for user
app.get('/listArduino/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM arduino WHERE userID=?', user_id, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results[0], message: 'arduino user values' });
    });
});



// Add a new user  
app.post('/user', function (req, res) {
    let user = req.body;
    //console.log("req.body: " + req.body);
    //console.log("req.body.body: " + req.body.body);
    //console.log("req.body.bodyParser: " + req.body.bodyParser);
    //console.log("req.param: " + req.param);
    //console.log("req.param.email: " + req.param.email);
    //console.log("req.rawTrailers: " + req.rawTrailers);
    //console.log("req.bodyParser.body: " + req.bodyParser.body);
    //console.log("req.bodyParser.json: " + req.bodyParser.json);
    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide new user data' });
    }
    dbConn.query("INSERT INTO users SET ?", { user: user }, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New user has been created.' });
    });
});

// Add Arduino setting
app.post('/userNew', function (req, res) {
    dbConn.query("INSERT INTO arduino SET userID = 1, valueName = 'heat', valueString = 'on'", {}, function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'New Arduino setting has been created.' });
    });
});


//  Update user with id
app.put('/user', function (req, res) {
    let user_id = req.body.user_id;
    let user = req.body.user;
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE users SET user = ? WHERE id = ?", [user, user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'user has been updated.' });
    });
});

//  Delete user
app.delete('/user', function (req, res) {
    let user_id = req.body.user_id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id for delete' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, results, fields) {
        if (error) throw error;
        return res.send({ error: false, data: results, message: 'User has been deleted.' });
    });
}); 