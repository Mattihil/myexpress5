var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display books page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opintojakso ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/books/index.ejs
            res.render('opintojakso',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('opintojakso',{data:rows});
        }
    });
});

// display add book page
router.get('/add', function(req, res, next) {    
    // render to add.ejs
    res.render('opintojakso/add', {
        nimi: '',
        laajuus: '',
        koodi: ''        
    })
})

// add a new book
router.post('/add', function(req, res, next) {    

    let nimi = req.body.nimi;
    let laajuus = req.body.laajuus;
    let koodi = req.body.koodi;
    let errors = false;

    if(nimi.length === 0 || laajuus.length === 0 || koodi.length === 0 ) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter nimi, laajuus and koodi");
        // render to add.ejs with flash message
        res.render('opintojakso/add', {
            nimi: nimi,
            laajuus: laajuus,
            koodi: koodi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            nimi: nimi,
            laajuus: laajuus,
            koodi: koodi
        }
        
        // insert query
        dbConn.query('INSERT INTO opintojakso SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opintojakso/add', {
                   nimi: form_data.nimi,
                   laajuus: form_data.laajuus,
                   koodi: form_data.koodi                   
                })
            } else {                
                req.flash('success', 'opintojakso successfully added');
                res.redirect('/opintojakso');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM opintojakso WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'opintojakso not found with id = ' + id)
            res.redirect('/opintojakso')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opintojakso/edit', {
                title: 'Edit opintojakso', 
                id: rows[0].id,
                nimi: rows[0].nimi,
                laajuus: rows[0].laajuus,
                koodi: rows[0].koodi
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let nimi = req.body.nimi;
    let laajuus = req.body.laajuus;
    let koodi = req.body.koodi;
    let errors = false;

    if(nimi.length === 0 || laajuus.length === 0 || koodi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter nimi,laajuus and koodi");
        // render to add.ejs with flash message
        res.render('opintojakso/edit', {
            id: req.params.id,
            nimi: nimi,
            laajuus: laajuus,
            koodi: koodi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            nimi: nimi,
            laajuus: laajuus,
            koodi: koodi
        }
        // update query
        dbConn.query('UPDATE opintojakso SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('books/edit', {
                    id: req.params.id,
                    nimi: form_data.nimi,
                    laajuus: form_data.laajuus,
                    koodi: form_data.koodi
                })
            } else {
                req.flash('success', 'opintojakso successfully updated');
                res.redirect('/opintojakso');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM opintojakso WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/opintojakso')
        } else {
            // set flash message
            req.flash('success', 'opintojakso successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/opintojakso')
        }
    })
})

module.exports = router;