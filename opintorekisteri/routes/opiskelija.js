var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 

router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM opiskelija ORDER BY id desc',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            
            res.render('opiskelija',{data:''});   
        } else {
            
            res.render('opiskelija',{data:rows});
        }
    });
});


router.get('/add', function(req, res, next) {    
   
    res.render('opiskelija/add', {
        etunimi: '',
        sukunimi: ''        
    })
})


router.post('/add', function(req, res, next) {    

    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter etunimi and sukunimi");
        // render to add.ejs with flash message
        res.render('opiskelija/add', {
            etunimi: etunimi,
            sukunimi: sukunimi
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi
        }
        
        // insert query
        dbConn.query('INSERT INTO opiskelija SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('opiskelija/add', {
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi                   
                })
            } else {                
                req.flash('success', 'opiskelija successfully added');
                res.redirect('/opiskelija');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM opiskelija WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            req.flash('error', 'opiskelija not found with id = ' + id)
            res.redirect('/opiskelija')
        }
        // if book found
        else {
            // render to edit.ejs
            res.render('opiskelija/edit', {
                title: 'Edit opiskelija', 
                id: rows[0].id,
                etunimi: rows[0].etunimi,
                sukunimi: rows[0].sukunimi
            })
        }
    })
})

// update book data
router.post('/update/:id', function(req, res, next) {

    let id = req.params.id;
    let etunimi = req.body.etunimi;
    let sukunimi = req.body.sukunimi;
    let errors = false;

    if(etunimi.length === 0 || sukunimi.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter etunimi and sukunimi");
        // render to add.ejs with flash message
        res.render('opiskelija/edit', {
            id: req.params.id,
            etunimi: etunimi,
            sukunimi: sukunimi
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            etunimi: etunimi,
            sukunimi: sukunimi
        }
        // update query
        dbConn.query('UPDATE opiskelija SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('opiskelija/edit', {
                    id: req.params.id,
                    etunimi: form_data.etunimi,
                    sukunimi: form_data.sukunimi
                })
            } else {
                req.flash('success', 'opiskelija successfully updated');
                res.redirect('/opiskelija');
            }
        })
    }
})
   
// delete book
router.get('/delete/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM opiskelija WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to books page
            res.redirect('/opiskelija')
        } else {
            // set flash message
            req.flash('success', 'opiskelija successfully deleted! ID = ' + id)
            // redirect to books page
            res.redirect('/opiskelija')
        }
    })
})

module.exports = router;