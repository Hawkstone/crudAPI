var express = require('express');
var router = express.Router();
var connection = require('../lib/db');


/* GET home page. */
router.get('/', function (req, res, next) {

    connection.query('SELECT * FROM Users ORDER BY ID DESC', function (err, rows) {

        if (err) {
            req.flash('error', err);
            res.render('customers', { page_title: "Users - Node.js", data: '' });
        } else {

            res.render('customers', { page_title: "Users - Node.js", data: rows });
        }

    });

});


// SHOW ADD USER FORM
router.get('/add', function (req, res, next) {
    // render to views/user/add.ejs
    res.render('customers/add', {
        title: 'Add New Users',
        Firstname: '',
        Surname: '',
        Email: '',
        Password: ''
    })
})

// ADD NEW USER POST ACTION
router.post('/add', function (req, res, next) {
    //Validate data
    req.assert('Firstname', 'First Name is required').notEmpty()
    req.assert('Surname', 'Surname is required').notEmpty()
    req.assert('Email', 'A valid email address is required').isEmail()
    req.assert('Password', 'Password is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {   //No errors were found.  Passed Validation!


        var user = {
            firstname: req.sanitize('Firstname').escape().trim(),
            surname: req.sanitize('Surname').escape().trim(),
            email: req.sanitize('Email').escape().trim(),
            password: req.sanitize('Password').escape().trim()
        }

        connection.query('INSERT INTO Users SET ?', user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('customers/add', {
                    title: 'Add New Customer',
                    firstname: user.firstname,
                    firstname: user.surname,
                    email: user.email,
                    firstname: user.password
                })
            } else {
                req.flash('success', 'Data added successfully!');
                res.redirect('/customers');
            }
        })
    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
        res.render('customers/add', {
            title: 'Add New Customer',
            firstname: req.body.firstname,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        })
    }
})

// SHOW EDIT USER FORM
router.get('/edit/(:id)', function (req, res, next) {

    connection.query('SELECT * FROM Users WHERE ID = ' + req.params.id, function (err, rows, fields) {
        if (err) throw err

        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'User not found with id = ' + req.params.id)
            res.redirect('/customers')
        }
        else { // if user found
            // render to views/user/edit.ejs template file
            res.render('customers/edit', {
                title: 'Edit User',
                //data: rows[0],
                id: rows[0].ID,
                firstname: rows[0].Firstname,
                surname: rows[0].Surname,
                email: rows[0].email,
                password: rows[0].Password
            })
        }
    })

})

// EDIT USER POST ACTION
router.post('/update/:id', function (req, res, next) {
    req.assert('Firstname', 'First Name is required').notEmpty()
    req.assert('Surname', 'Surname is required').notEmpty()
    req.assert('Email', 'A valid email address is required').isEmail()
    req.assert('Password', 'Password is required').notEmpty()

    var errors = req.validationErrors()

    if (!errors) {

        var user = {
            firstname: req.sanitize('Firstname').escape().trim(),
            surname: req.sanitize('Surname').escape().trim(),
            email: req.sanitize('Email').escape().trim(),
            password: req.sanitize('Password').escape().trim()
        }

        connection.query('UPDATE Users SET ? WHERE ID = ' + req.params.id, user, function (err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)

                // render to views/user/add.ejs
                res.render('customers/edit', {
                    title: 'Edit Customer',
                    id: req.params.ID,
                    firstname: req.body.firstname,
                    surname: req.body.surname,
                    email: req.body.email,
                    password: req.body.password
                })
            } else {
                req.flash('success', 'Data updated successfully!');
                res.redirect('/customers');
            }
        })

    }
    else {   //Display errors to user
        var error_msg = ''
        errors.forEach(function (error) {
            error_msg += error.msg + '<br>'
        })
        req.flash('error', error_msg)

        /**
         * Using req.body.name 
         * because req.param('name') is deprecated
         */
        res.render('customers/edit', {
            title: 'Edit Customer',
            id: req.params.id,
            firstname: req.body.firstname,
            surname: req.body.surname,
            email: req.body.email,
            password: req.body.password
        })
    }
})

// DELETE USER
router.get('/delete/(:id)', function (req, res, next) {
    var user = { id: req.params.id }

    connection.query('DELETE FROM Users WHERE id = ' + req.params.id, user, function (err, result) {
        //if(err) throw err
        if (err) {
            req.flash('error', err)
            // redirect to users list page
            res.redirect('/customers')
        } else {
            req.flash('success', 'Customer deleted successfully! id = ' + req.params.id)
            // redirect to users list page
            res.redirect('/customers')
        }
    })
})
module.exports = router;