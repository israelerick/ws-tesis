const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

// Helpers
const { isAuthenticated } = require("../helpers/auth");

router.get('/add', (req, res) => {
    res.render('Manager/add');
});

router.post('/add', isAuthenticated, async (req, res) => {
    const { Nombre, Apellido, Birthday, Descripcion } = req.body;
    const newManager = {
        Nombre,
        Apellido,
        Birthday,
        Descripcion,
        user_id: req.user.id
    };

 
    const errors = [];
    if (!Nombre) {
      req.flash('message', 'Por favor ingresar un Nombre');
       
      res.redirect('/Manager/add');
      }
      if (!Apellido) {
        req.flash('message', 'Por favor ingresar un Apellido');
       
        //errors.push({ text: "Por favor ingresar un Apellido" });
        res.redirect('/Manager/add');
      }
      if (!Birthday ) {
        req.flash('message', 'Por favor ingresar una fecha de cumpleaños');
       
        //errors.push({ text: "Por favor ingresar una fecha de cumpleaños" });
        res.redirect('/Manager/add');
      }
      else  {
        var a = await pool.query(`select datediff(now(), '${Birthday}')/365.25 as EDAD`);
        console.log(" la edad es");
        console.log(a[0].EDAD);
        if (a[0].EDAD < 18 || a[0].EDAD > 85  ){

        req.flash('message', 'La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente');
       
        //errors.push({ text: "La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente " });
        res.redirect('/Manager/add');
        }
      }
      if (!Descripcion) {
        req.flash('success', 'Por favor ingresar una descripcion');
        errors.push({ text: "Por favor ingresar una descripcion" });
        
      }
      if (errors.length > 0) {
        res.render("Manager/add", {
          errors,Nombre, Apellido, Birthday, Descripcion
        });
    } else {
    await pool.query('INSERT INTO Manager set ?', [newManager]);
    req.flash('success', 'Manager Saved Successfully');
   

    res.redirect('/Manager');
    }
});

router.get('/', isLoggedIn, async (req, res) => {
    const Managers = await pool.query('SELECT * FROM Manager WHERE user_id = ?', [req.user.id]);
    res.render('Manager/list', { Managers });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM Manager WHERE ID = ?', [id]);
    req.flash('success', 'Manager Removed Successfully');
    res.redirect('/Manager');
});

router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const Managers = await pool.query('SELECT * FROM Manager WHERE id = ?', [id]);
    console.log(Managers);
    res.render('Manager/edit', {Manager: Managers[0]});
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Birthday, Descripcion, Available } = req.body;
    const newManagers = {
        Nombre,
        Apellido,
        Birthday,
        Descripcion,
        user_id: req.user.id,
        Available
    };
    if  (!Birthday){

      req.flash('message', 'Por favor ingresar una fecha de cumpleaños');
       
      res.redirect('/Manager');
    }
    else{
      var a = await pool.query(`select datediff(now(), '${Birthday}')/365.25 as EDAD`);
      console.log(" la edad es");
      console.log(a[0].EDAD);
      if (a[0].EDAD < 18 || a[0].EDAD > 85  ){

      req.flash('message', 'La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente');
     
      //errors.push({ text: "La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente " });
      res.redirect('/Manager');
      }
    }
    await pool.query('UPDATE Manager set ? WHERE id = ?', [newManagers, id]);
    req.flash('success', 'Manager Updated Successfully');
    res.redirect('/Manager');
});

router.get('/Comercial', async (req, res) => {
      res.render('Manager/Comercial');
    });

    router.get('/Contaduria', async (req, res) => {
      res.render('Manager/Contaduria');
    });
    router.get('/Produccion', async (req, res) => {
      res.render('Manager/Produccion');
    });
module.exports = router;