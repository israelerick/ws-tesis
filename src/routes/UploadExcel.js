const express = require('express');
const router = express.Router();
var Excel = require('exceljs')
const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');

  var multer  = require('multer')
//var upload = multer({ dest: 'uploads/' })
var app = express()
 
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const{tipotabla}=req.query;
    cb(null, tipotabla + '.xlsx' )
  }
})

var upload = multer({ storage: storage })

/*
router.post('/add',upload.single('avatar'), async (req, res) => {
  console.log("entra!!"); 
  const{tipotabla, nrotabla}=req.body;

  let workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(`./uploads/${tipotabla}.xlsx`)
  let worksheet = workbook.getWorksheet(nrotabla)
  console.log(worksheet.rowCount);
  for (let i = 4; i< worksheet.rowCount; i++) {
    const row = worksheet.getRow(i);
    console.log(row.getCell('A').value);
    console.log(row.getCell('B').value);
  }
  res.redirect('/UploadExcel');
  
});
  */

router.post('/photos/upload', upload.array('files', 12), async function (req, res, next) {
  // req.files is array of `photos` files
  // req.body will contain the text fields, if there were any
  const{tipotabla, nrotabla, nrofila}=req.query;
  let arr = JSON.parse(req.query.orden_columnas);
	console.log('8888888',arr);
	let workbook = new Excel.Workbook()
	await workbook.xlsx.readFile(`./uploads/${tipotabla}.xlsx`)
	let worksheet = workbook.getWorksheet(parseInt(nrotabla));
	console.log('----****----',worksheet.actualRowCount);
	const tabla = await pool.query('SELECT TABLA FROM tablas where id =?', [tipotabla]);
	let insert = []
	for (let i = nrofila; i< worksheet.actualRowCount; i++) {
		const row = worksheet.getRow(i);
		let aux = [], aux2 = [];
		for (let j=0; j < arr.length; j++) {
			const columna = await pool.query('SELECT nombre FROM columnas where id =?', [arr[j].id]);
			aux.push(`${columna[0].nombre}`);
			aux2.push(`'${row.getCell(arr[j].campo).value}'`);
		}
		insert.push(`insert into ${tabla[0].TABLA} (${aux.join(',')}) VALUES (${aux2.join(',')})`);
		//console.log(row.getCell('A').value);
		//console.log(row.getCell('B').value);

	}

  res.status(200).send(insert);
})
 /*
var cpUpload = upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'gallery', maxCount: 8 }])
router.post('/cool-profile', cpUpload, function (req, res, next) {
	res.status(200).send({ok:req.files})
  // req.files is an object (String -> Array) where fieldname is the key, and the value is array of files
  //
  // e.g.
  //  req.files['avatar'][0] -> File
  //  req.files['gallery'] -> Array
  //
  // req.body will contain the text fields, if there were any
});
*/
router.get('/', async (req, res) => {
    res.render('Excel/UploadExcel');
});
router.get('/tablas', async (req, res) => {

  const tabla = await pool.query('SELECT * FROM tablas');
  res.status(200).send(tabla);
});

router.get('/columnas/:tipo', async (req, res) => {
  
  const columna = await pool.query('SELECT * FROM columnas where tipotabla =?', [req.params.tipo]);
        
  res.status(200).send(columna);
});

module.exports = router;