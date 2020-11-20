const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
// Helpers
const { isAuthenticated } = require("../helpers/auth");

router.get('/add', (req, res) => {
    res.render('Worker/add');
});

router.post('/add', isAuthenticated, async (req, res) => {
    const { Nombre, Apellido, Birthday, Descripcion } = req.body;
    const newWorker = {
        Nombre,
        Apellido,
        Birthday,
        Descripcion,
        user_id: req.user.id // quien te creooo
    };
    const errors = [];
    if (!Nombre) {
        req.flash('message', 'Por favor ingresar un Nombre');
       
        res.redirect('/Worker/add');
      }
      if (!Apellido) {
        req.flash('message', 'Por favor ingresar un Apellido');
       
        res.redirect('/Worker/add');
      }
      if (!Birthday) {
        req.flash('message', 'Por favor ingresar una fecha de cumpleaños');
       
        res.redirect('/Worker/add');
      } else  {
        var a = await pool.query(`select datediff(now(), '${Birthday}')/365.25 as EDAD`);
        console.log(" la edad es");
        console.log(a[0].EDAD);
        if (a[0].EDAD < 18 || a[0].EDAD > 85  ){

        req.flash('message', 'La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente');
       
        //errors.push({ text: "La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente " });
        res.redirect('/Worker/add');
        }
      }
      if (!Descripcion) {
        req.flash('success', 'Por favor ingresar una descripcion');
        errors.push({ text: "Por favor ingresar una descripcion" });
      }
      if (errors.length > 0) {
        res.render("Worker/add", {
          errors,Nombre, Apellido, Birthday, Descripcion
        });
    } else {
    await pool.query('INSERT INTO Worker set ?', [newWorker]);
    req.flash('success', 'Worker Saved Successfully');
    res.redirect('/Worker');
    }
});


router.get('/', isLoggedIn, async (req, res) => {
    const Workers = await pool.query('SELECT * FROM Worker WHERE user_id = ?', [req.user.id]);
    res.render('Worker/list', { Workers });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM Worker WHERE ID = ?', [id]);
    req.flash('success', 'Worker Removed Successfully');
    res.redirect('/Worker');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const Workers = await pool.query('SELECT * FROM Worker WHERE id = ?', [id]);
    console.log(Workers);
    res.render('Worker/edit', {Worker: Workers[0]});
});

router.get('/Reporte', async (req, res) => {
  console.log(req.user.idmanagerworker)
  var a = await pool.query(`select Descripcion from Worker where id = ${req.user.idmanagerworker} `);
     if (a[0].Descripcion == "Area comercial"){ 
      res.render('Worker/Comercial');
     }
     else if (a[0].Descripcion == "Area financiero"){ 
      res.render('Worker/Contaduria');
     }
     else
  res.render('Worker/produccion');
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Nombre, Apellido, Birthday, Descripcion } = req.body;
    const newWorkers = {
        Nombre,
        Apellido,
        Birthday,
        Descripcion,
        user_id: req.user.id
    };

    if  (!Birthday){

      req.flash('message', 'Por favor ingresar una fecha de cumpleaños');
       
      res.redirect('/Worker');
    }
    else{
      var a = await pool.query(`select datediff(now(), '${Birthday}')/365.25 as EDAD`);
      console.log(" la edad es");
      console.log(a[0].EDAD);
      if (a[0].EDAD < 18 || a[0].EDAD > 85  ){

      req.flash('message', 'La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente');
     
      //errors.push({ text: "La fecha de cumpleaños no es valida, por favor revisar e intentar nuevamente " });
      res.redirect('/Worker');
      }
    }
    await pool.query('UPDATE Worker set ? WHERE id = ?', [newWorkers, id]);
    req.flash('success', 'Worker Updated Successfully');
    res.redirect('/Worker');
    
});

module.exports = router;