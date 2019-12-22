// return a dbConn oject connected to mySQL iot database
var mysql = require('mysql');
var dbConn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'redLion45',
    database: 'iot'
});
dbConn.connect(function (error) {
    if (!!error) {
        console.log(error);
    } else {
        console.log('Connected!');
    }
});
module.exports = dbConn; 