const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const pool = require('../database');
const nodemailer = require("nodemailer");
const { isLoggedIn } = require('../lib/auth');

// Helpers
const { isAuthenticated } = require("../helpers/auth");


router.get('/addManager/:id', async(req, res) => {
    console.log("entras?");
    const { id } = req.params;
    const Managers = await pool.query('SELECT * FROM Manager WHERE id = ?', [id]);
  
    
    const idmanagerworker1 = await pool.query('SELECT * FROM users WHERE idmanagerworker = ?', [id]);

    
    if (idmanagerworker1.length>0) {
            req.flash('message', 'Esta cuenta ya tiene usuario creado');
            res.redirect("/Manager");
          }
    
    else{
       
    res.render('users/addManager',{Manager: Managers[0]});}
    
});

router.post('/addManager/:id', isAuthenticated, async (req, res) => {
  const salt = await bcrypt.genSalt(12);
    
    const { id } = req.params;
    const Managers = await pool.query('SELECT * FROM Manager WHERE id = ?', [id]);
    
    
    const {  username, password, fullname } = req.body;
    const x = username + '@gmail.com';
    
    const newUser = {
        idmanagerworker: id,
        username:x,
        password:await bcrypt.hash(password, salt),
        fullname,
        user_id: req.user.id,
        DTPassword : '0',
        DRAuth:Date.now(),
        isManager:'1',
        isWorker:'0',
        isAdmin:'0',
        Available:'0',
        
    }; 
    const errors = [];
    if (!username) {
        req.flash('success', 'Por favor ingresar un username');
       
        errors.push({ text: "Por favor ingresar un username" });
      }
      if (!password) {
        req.flash('success', 'Por favor ingresar un password');
       
        errors.push({ text: "Por favor ingresar un password" });
      }
      if (!fullname) {
        req.flash('success', 'Por favor ingresar un fullname');
       
        errors.push({ text: "Por favor ingresar un fullname" });
      }
     
      
      if (errors.length > 0) {
        res.render('users/addManager',{Manager: Managers[0]}, {
          errors,username, password, fullname
        });
    } else {
        const username1 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
        const idmanagerworker1 = await pool.query('SELECT * FROM users WHERE idmanagerworker = ?', [id]);
    
        
    if ((username1.length>0) ||(idmanagerworker1.length>0)) {
            req.flash("error_msg", "El Correo o la cuenta ya esta Siendo Utilizado");
            res.redirect("/Manager");
          } else {
    await pool.query('INSERT INTO users set ?', [newUser]);
    await mailler(newUser.username).catch(console.error);
    req.flash('success', 'User Saved Successfully');
    res.redirect('/users');
    }
}
});


router.get('/addWorker/:id', async(req, res) => {

    const { id } = req.params;
    const Workers = await pool.query('SELECT * FROM Worker WHERE id = ?', [id]);
    console.log(Workers);

   const idmanagerworker1 = await pool.query('SELECT * FROM users WHERE idmanagerworker = ?', [id]);

    
if (idmanagerworker1.length>0) {
        req.flash('message', 'Esta cuenta ya tiene usuario creado');
        res.redirect("/Worker");
      }

else{
    res.render('users/addWorker',{Worker: Workers[0]});}
    
});

router.post('/addWorker/:id', isAuthenticated, async (req, res) => {
   
  const salt = await bcrypt.genSalt(12);
  

  const { id } = req.params;
    
    const {  username, password, fullname } = req.body;

    const x = username + '@gmail.com';
    const newUser = {
        idmanagerworker: id,
        username:x,
        password:await bcrypt.hash(password, salt),
        fullname,
        user_id: req.user.id,
        DTPassword : '0',
        DRAuth:Date.now(),
        isManager:'0',
        isWorker:'1',
        isAdmin:'0',
        Available:'0',
        
    };
    const errors = [];
    if (!username) {
        req.flash('success', 'Por favor ingresar un username');
       
        errors.push({ text: "Por favor ingresar un username" });
      }
      if (!password) {
        req.flash('success', 'Por favor ingresar un password');
       
        errors.push({ text: "Por favor ingresar un password" });
      }
      if (!fullname) {
        req.flash('success', 'Por favor ingresar un fullname');
       
        errors.push({ text: "Por favor ingresar un fullname" });
      }
     
      
      if (errors.length > 0) {
        res.render('User/addWorker',{Worker: Workers[0]}, {
          errors,username, password, fullname
        });
    } else {
      const username1 = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
      const idmanagerworker1 = await pool.query('SELECT * FROM users WHERE idmanagerworker = ?', [id]);
  
      
  if ((username1.length>0) ||(idmanagerworker1.length>0)) {
          req.flash('message', 'El Correo o la cuenta ya esta Siendo Utilizado');
          res.redirect("/Worker");
        } else {
    await pool.query('INSERT INTO users set ?', [newUser]);
    await mailler(newUser.username).catch(console.error);
    req.flash('success', 'User Saved Successfully');
    res.redirect('/users');
    }}
});
router.get('/', isLoggedIn, async (req, res) => {
    const users = await pool.query('SELECT * FROM users WHERE user_id = ?', [req.user.id]);
    res.render('users/list', { users });
});




router.get('/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const xusers = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    console.log("entroooo al editar de users");
    res.render('users/edit', {users: xusers[0]});
});

router.post('/edit/:id', isAuthenticated, async (req, res) => {
    const { id } = req.params;
    const { username, password, fullname } = req.body;
    const newuser = {
        username,
        password,
        fullname,
      
    };
    
    const errors = [];
    if (!username) {
        req.flash('success', 'Por favor ingresar un username');
       
        errors.push({ text: "Por favor ingresar un username" });
      }
      if (!password) {
        req.flash('success', 'Por favor ingresar un password');
       
        errors.push({ text: "Por favor ingresar un password" });
      }
      if (!fullname) {
        req.flash('success', 'Por favor ingresar un fullname');
       
        errors.push({ text: "Por favor ingresar un fullname" });
      }
     
      if (errors.length > 0) {
        res.render("/users", {
          errors,username,password,fullname
        });
    } else {
    await pool.query('UPDATE users set ? WHERE id = ?', [newuser, id]);
    req.flash('success', 'USER Updated Successfully');
    res.redirect('/');}
});



// async..await is not allowed in global scope, must use a wrapper
async function mailler(username) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'diazstephany98@gmail.com', // generated ethereal user
      pass: 'Passw0rd2016110015', // generated ethereal password
    },
  });

  // send mail with defined transport object
  await pool.query(`update users set DRAuth = date_add(now(), interval 1 hour)
          WHERE username='${username}'`);
   
  let info = await transporter.sendMail({
    from: '"Stephany Diaz" <diazstephany98@gmail.com>', // sender address
    to: username, // list of receivers
    subject: "Verificacion de cuenta / ENVAPORT", // Subject line
    text: "haga clic aqui", // plain text body
    html: `'http://localhost:4000/users/auth/${username}'`, // html body

  }, function (error,data){
    if (error)
    {
      console.log(error);
    }
    else
    {
      console.log("succesfull");
    }
  }
  );

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}


router.get('/auth/:correo', async (req, res) => {
  
  const date = await pool.query(' select if (DRAuth< now(),0,1 ) as permitido from users WHERE username = ? ', [req.params.correo]);
  if(date[0].permitido == 1){
  const users = await pool.query('UPDATE  users set available = 1 WHERE username = ?', [req.params.correo]);
  req.flash('success', 'Usuario activado, por favor ingrese su usuario y contraceña');

  res.redirect('/signin');}
  else  {
    req.flash('message', 'Link expirado');
  
  res.redirect('/');
  }

});
router.get('/users/auth/:username', async (req, res) => {
 await mailler(req.params.username).catch(console.error);
req.flash('succesfull', 'Link enviado');
  
  res.redirect('/users');
});

router.get('/users/reset/:username', async (req, res) => {
  
  await changepassword(req.params.username).catch(console.error);
req.flash('succesfull', 'Link de cambio de contraceña enviado');
  
  res.redirect('/users');
});


router.get('/forgot', async (req, res) => {
  
  res.render('users/forgot');
});

router.post('/forgot', async (req, res) => { 
  console.log("entra a forgot");
  const { username } = req.body;
  console.log (username);
  let respuesta = await pool.query('select *from users WHERE username = ?', [username]);
  console.log(respuesta);
  if(respuesta.length == 0)
  {
    req.flash('message', 'USER NOT found!');
    res.redirect('/users/forgot');
   //poner redireccion
  }
  else{
  await changepassword(username);
  req.flash('success', 'email sent succesfully');
  res.redirect('/');
}

 
});

async function changepassword(username) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'diazstephany98@gmail.com', // generated ethereal user
      pass: 'Passw0rd2016110015', // generated ethereal password
    },
  });
  await pool.query(`update users set DTPassword = date_add(now(), interval 1 hour)
  WHERE username='${username}'`);
let info = await transporter.sendMail({
  from: '"Stephany Diaz" <diazstephany98@gmail.com>', // sender address
  to: username, // list of receivers
  subject: "Cambio de contraceña de cuenta / ENVAPORT", // Subject line
  text: "haga clic aqui", // plain text body
  html: `'http://localhost:4000/users/reset/${username}'`, // html body

}, function (error,data){
  if (error)
  {
    console.log(error);
  }
  else
  {
    console.log("succesfull");
  }
}
);


console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
// Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

router.get('/reset/:username', async (req, res) => {
  console.log("entra a reset");
  console.log(req.params);
  let x = req.params.username;
    console.log(req.body);
  
  res.render('users/reset', {x});
});

router.post('/reset', async (req, res) => {
  console.log("entra") ;
  const salt = await bcrypt.genSalt(12);
  console.log(req.body) ;
 
  const newuser = {
    password:await bcrypt.hash(req.body.NewPassword, salt),
      
  };
  
 
  
  console.log(newuser.password);
  await pool.query(`UPDATE users set password = '${newuser.password}' WHERE username = ?`, [req.body.username]);
  req.flash('success', 'USER Updated Successfully');
  res.redirect('/');}
);

module.exports = router;