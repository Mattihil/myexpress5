var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM arviointi ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('arviointi',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('arviointi',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('arviointi/add', {
        päivämäärä: '',
        arvosana: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let päivämäärä = req.body.päivämäärä;
    let arvosana = req.body.arvosana;
    let errors = false;

    if(päivämäärä.length === 0 || arvosana.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter päivämäärä and arvosana");
        // render to add.ejs with flash message
        res.render('arviointi/add', {
            päivämäärä: päivämäärä,
            arvosana: arvosana
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            päivämäärä: päivämäärä,
            arvosana: arvosana
        }
        
        // insert query
        dbConn.query('INSERT INTO arviointi SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('arviointi/add', {
                    päivämäärä: form_data.päivämäärä,
                    arvosana: form_data.arvosana                    
                })
            } else {                
                req.flash('success', 'arviointi successfully added');
                res.redirect('/arviointi');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM arviointi WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'arviointi not found with id = ' + id)
            res.redirect('/arviointi')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('arviointi/edit', {
                title: 'Edit arviointi', 
                id: rows[0].id,
                päivämäärä: rows[0].päivämäärä,
                arvosana: rows[0].arvosana
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let päivämäärä = req.body.päivämäärä;
    let arvosana = req.body.arvosana;
    let errors = false;

    if(päivämäärä.length === 0 || arvosana.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter päivämäärä and arvosana");
        // render to add.ejs with flash message
        res.render('arviointi/edit', {
            id: req.params.id,
            päivämäärä: päivämäärä,
            arvosana: arvosana
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            päivämäärä: päivämäärä,
            arvosana: arvosana
        }
        // update query
        dbConn.query('UPDATE arviointi SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('arviointi/edit', {
                    id: req.params.id,
                    päivämäärä: form_data.päivämäärä,
                    arvosana: form_data.arvosana
                })
            } else {
                req.flash('success', 'arviointi successfully updated');
                res.redirect('/arviointi');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM arviointi WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/arviointi')
        } else {
            // set flash message
            req.flash('success', 'arviointi successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/arviointi')
        }
    })
})

module.exports = router;