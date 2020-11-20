const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    res.render('index');
});
router.get('/About', async (req, res) => {
    res.render('About');
});
router.get('/cajas', async (req, res) => {
    res.render('catalog/cajas');
});
router.get('/bandejas', async (req, res) => {
    res.render('catalog/bandejas');
});

router.get('/cubiertos', async (req, res) => {
    res.render('catalog/cubiertos');
});
router.get('/vasostermicos', async (req, res) => {
    res.render('catalog/vasostermicos');
});
router.get('/container', async (req, res) => {
    res.render('catalog/container');
});
router.get('/vasospp', async (req, res) => {
    res.render('catalog/vasospp');
});
router.get('/potes', async (req, res) => {
    res.render('catalog/potes');
});
router.get('/otros', async (req, res) => {
    res.render('catalog/otros');
});
router.get('/termoformados', async (req, res) => {
    res.render('catalog/termoformados');
});

router.get('/Showexcel', async (req, res) => {
    res.render('Excel/Showexcel');
  });

  router.get('/exp', async (req, res) => {
    res.render('catalog/exp');
});
module.exports = router;