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


//-------------------------------------------------------------------------------------------------------------------------------------
// send an SQL query and return the result
app.get('/query/:query', function (req, res) {
    let sql = req.params.query;
    console.log("query: " + sql);
    dbConn.query(sql, function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: result, message: 'query result' });
    });
});


//-------------------------------------------------------------------------------------------------------------------------------------
// get the password for the given email address
app.get('/getPassword/:email', function (req, res) {
    let email = req.params.email;
    dbConn.query("SELECT password FROM users WHERE email = '" + email + "'", function (error, result) {
        if (error) throw error;
        console.log("result: ", result);
        return res.send({ error: false, data: result, message: 'users list' });
    });
});


//-------------------------------------------------------------------------------------------------------------------------------------
// Retrieve all users 
app.get('/listUsers', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: result, message: 'users list' });
    });
});

// Retrieve user with id 
app.get('/listUser/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM users WHERE id=?', user_id, function (error, result, fields) {
        if (error) throw error;
        return res.send({ error: false, data: result[0], message: 'user record' });
    });
});

// Retrieve arduino table values for all users
app.get('/listArduino', function (req, res) {
    dbConn.query('SELECT * FROM arduino', function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: result, message: 'arduino table list' });
    });
});

// Retrieve arduino table values for user
app.get('/listArduino/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM arduino WHERE userID=?', user_id, function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: result[0], message: 'arduino user values' });
    });
});


//-------------------------------------------------------------------------------------------------------------------------------------
// Add a new user from request BODY 
app.post('/user', function (req, res) {
    let user = req.body;
    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide new user data' });
    }
    dbConn.query("INSERT INTO users SET " +
        "email = '" + user.email + "'," +
        "password = '" + user.password + "'," +
        "firstName = '" + user.firstName + "'," +
        "lastName = '" + user.lastName + "'," +
        "permissionLevel = '" + user.permissionLevel + "'"
        , { user }, function (error, result) {
            if (error) throw error;
            console.log("Number of rows affected: " + result.affectedRows);
            console.log("Number of records affected with warning: " + result.warningCount);
            console.log("Message from MySQL Server: " + result.message);
            return res.send({ error: false, data: result, message: 'New user has been created.' });
        });
    //console.log("User created: \n", user);
});

//  Update user with id
app.put('/user/:user_id', function (req, res) {
    let user = req.body;
    let user_id = req.params.user_id
    console.log("User to update: ", user_id);
    console.log("User: ", user);
    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user and user_id' });
    }
    dbConn.query("UPDATE users SET " +
        "email = '" + user.email + "'," +
        "password = '" + user.password + "'," +
        "firstName = '" + user.firstName + "'," +
        "lastName = '" + user.lastName + "'," +
        "permissionLevel = '" + user.permissionLevel + "' " +
        "WHERE id = ? "
        , [user_id], function (error, result, fields) {
            if (error) throw error;
            console.log("Number of rows affected: " + result.affectedRows);
            console.log("Number of records affected with warning: " + result.warningCount);
            console.log("Message from MySQL Server: " + result.message);
            return res.send({ error: false, data: result, message: 'user ' + user_id + ' has been updated.' });
        });
    //console.log("User updated: \n", user);
});

//  Delete user
app.delete('/user/:user_id', function (req, res) {
    let user_id = req.params.user_id;
    console.log("User to delete: ", user_id);
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id for delete' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, result) {
        if (error) throw error;
        console.log("Number of rows affected: " + result.affectedRows);
        console.log("Number of records affected with warning: " + result.warningCount);
        console.log("Message from MySQL Server: " + result.message);
        return res.send({ error: false, data: result, message: 'user ' + user_id + ' has been deleted.' });
    });
}); 