const artigoController = require('../controllers/artigoController');
const express = require('express');
const router = express.Router();

router.post('/create', artigoController.create);


module.exports = app => app.use('/artigo', router);