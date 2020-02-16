var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mysql = require('mysql');
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

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




// send an SQL query and return the result
app.get('/query/:query', function (req, res) {
    let sql = req.params.query;
    console.log("query: " + sql);
    dbConn.query(sql, function (error, result) {
        if (error) throw error;
        console.log(GetDateTime() + " result: ", result);
        return res.send({ error: false, data: JSON.stringify(result), message: 'query result' });
    });
});


//-[GET datapoint]---------------------------------------------------------------------------------------------------------------------
// get the password for the given email address
app.get('/getPassword/:email', function (req, res) {
    let email = req.params.email;
    dbConn.query("SELECT password FROM users WHERE email = ?", [email], function (error, result) {
        if (error) throw error;
        console.log(GetDateTime() + " result: ", result);

        var password = "";
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            password = row.password;
        });

        return res.send({ error: false, data: password, message: 'user password' });
    });
});

// get the userID for the given email address
app.get('/getUserID/:email', function (req, res) {
    let email = req.params.email;
    dbConn.query("SELECT id FROM users WHERE email = ?", [email], function (error, result) {
        if (error) throw error;
        console.log(GetDateTime() + " result: ", result);

        var id = -1;
        Object.keys(result).forEach(function (key) {
            var row = result[key];
            id = row.id;
        });

        return res.send({ error: false, data: id, message: 'user record id' });
    });
});


//-[GET dataset]-----------------------------------------------------------------------------------------------------------------------
// Retrieve all users 
app.get('/listUsers', function (req, res) {
    dbConn.query('SELECT * FROM users', function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: JSON.stringify(result), message: 'users list' });
    });
});

// Retrieve user with id 
app.get('/getUserRecordByID/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM users WHERE id = ?', user_id, function (error, result) {
        if (error) throw error;

        console.log(GetDateTime() + " result: ", result);

        return res.send({ error: false, data: JSON.stringify(result[0]), message: 'user record' });
    });
});

// Retrieve user with email 
app.get('/getUserRecordByEmail/:email', function (req, res) {
    let email = req.params.email;
    if (!email) {
        return res.status(400).send({ error: true, message: 'Please provide user email address' });
    }
    dbConn.query('SELECT * FROM users WHERE email = ?', email, function (error, result) {
        if (error) throw error;

        console.log(GetDateTime() + " result: ", result);

        return res.send({ error: false, data: JSON.stringify(result[0]), message: 'user record' });
    });
});

// Retrieve arduino table values for all users
app.get('/listArduinoAll', function (req, res) {
    dbConn.query('SELECT * FROM arduino', function (error, result) {
        if (error) throw error;
        return res.send({ error: false, data: JSON.stringify(result), message: 'arduino all user values list' });
    });
});

// Retrieve arduino table values for user
app.get('/listArduino/:id', function (req, res) {
    let user_id = req.params.id;
    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user id' });
    }
    dbConn.query('SELECT * FROM arduino WHERE userID = ?', user_id, function (error, result) {
        if (error) throw error;

        console.log(GetDateTime() + " result: ", result);

        return res.send({ error: false, data: JSON.stringify(result), message: 'arduino single user values' });
    });
});


//-------------------------------------------------------------------------------------------------------------------------------------
// Add a new user from request BODY 
app.post('/user', function (req, res) {
    let user = req.body;

    console.log(GetDateTime() + " New user: ", user);

    if (!user) {
        return res.status(400).send({ error: true, message: 'Please provide new user data' });
    }
    dbConn.query("INSERT INTO users SET " +
        "email = '" + user.Email + "'," +
        "password = '" + user.Password + "'," +
        "firstName = '" + user.FirstName + "'," +
        "lastName = '" + user.LastName + "'," +
        "permissionLevel = " + user.PermissionLevel 
        , { user }, function (error, result) {
            if (error) throw error;
            console.log("Number of rows affected: " + result.affectedRows);
            console.log("Number of records affected with warning: " + result.warningCount);
            console.log("Message from MySQL Server: " + result.message);
            return res.send({ error: false, data: JSON.stringify(result), message: 'New user has been created.' });
        });
    //console.log("User created: \n", user);
});

//  Update user with id
app.put('/user/:user_id', function (req, res) {
    let user = req.body;
    let user_id = req.params.user_id

    console.log(GetDateTime() + " User ID to update: ", user_id);
    console.log("Updated details: ", user);

    if (!user_id || !user) {
        return res.status(400).send({ error: user, message: 'Please provide user_id and BODY updated fields' });
    }

    dbConn.query("UPDATE users SET " +
        "email = '" + user.Email + "'," +
        "password = '" + user.Password + "'," +
        "firstName = '" + user.FirstName + "'," +
        "lastName = '" + user.LastName + "'," +
        "permissionLevel = " + user.PermissionLevel + " " +
        "WHERE id = ? "
        , [user_id], function (error, result) {
            if (error) throw error;
            console.log("Number of rows affected: " + result.affectedRows);
            console.log("Number of records affected with warning: " + result.warningCount);
            console.log("Message from MySQL Server: " + result.message);
            return res.send({ error: false, data: JSON.stringify(result), message: 'user ' + user_id + ' has been updated.' });
        });
});

//  Delete user
app.delete('/user/:user_id', function (req, res) {
    let user_id = req.params.user_id;

    console.log(GetDateTime() + " User to delete: ", user_id);

    if (!user_id) {
        return res.status(400).send({ error: true, message: 'Please provide user_id for delete' });
    }
    dbConn.query('DELETE FROM users WHERE id = ?', [user_id], function (error, result) {
        if (error) throw error;
        console.log("Number of rows affected: " + result.affectedRows);
        console.log("Number of records affected with warning: " + result.warningCount);
        console.log("Message from MySQL Server: " + result.message);
        return res.send({ error: false, data: JSON.stringify(result), message: 'user ' + user_id + ' has been deleted.' });
    });
}); 

//  Update arduino paramater
app.put('/arduinoParameter/:arduinoRecordID', function (req, res) {
    let record = req.body;
    let recID = req.params.arduinoRecordID;

    console.log("--");
    console.log(GetDateTime() + " Arduino record to update: ", recID);
    console.log("Updated details: ", record);
    
    if (!recID || !record) {
        return res.status(400).send({ error: record, message: 'Please provide arduino.id and BODY updated fields' });
    }

    // CAPITALISATION - pay attention to case of properties (record.ValueInt is NOT the same as record.valueInt)
    dbConn.query("UPDATE arduino SET " +
        "valueInt = " + record.ValueInt + ", " +
        "valueString = '" + record.ValueString + "' " +
        "WHERE id = ? "
        , [recID], function (error, result) {
            if (error) throw error;
            console.log("Number of rows affected: " + result.affectedRows);
            console.log("Number of records affected with warning: " + result.warningCount);
            console.log("Message from MySQL Server: " + result.message);
            return res.send({ error: false, data: JSON.stringify(result), message: 'arduino parameter ID: ' + recID + ' has been updated.' });
        });
});


function GetDateTime() {
    let date_ob = new Date();

    // current date
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    // current year
    let year = date_ob.getFullYear();
    // current hours
    let hours = date_ob.getHours();
    // current minutes
    let minutes = date_ob.getMinutes();
    // current seconds
    let seconds = date_ob.getSeconds();

    return year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
}

