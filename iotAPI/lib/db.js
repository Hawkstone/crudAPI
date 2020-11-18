// return a dbConn oject connected to mySQL database
var mysql = require('mysql');

var dbConn = mysql.createPool({
    connectionLimit: 5,
    host: 'localhost',
    user: 'root',
    password: 'redLion45',
    database: 'iot'
});

//var dbConn = mysql.createConnection({
//    host: 'localhost',
//    user: 'root',
//    password: 'redLion45',
//    database: 'iot'
//});
dbConn.getConnection(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log(GetDateTime() + ' Database connected!');
    }
});

module.exports = dbConn; 

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
