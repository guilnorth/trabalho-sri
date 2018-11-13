const artigoController = require('../controllers/artigoController');
const express = require('express');
const router = express.Router();

router.post('/create', artigoController.create);
router.post('/search', artigoController.search);
router.get('/suggest', artigoController.suggestSearch);


module.exports = app => app.use('/artigo', router);