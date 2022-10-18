const { Router } = require('express');
const { buscar } = require('../controllers/buscar.controller');
const router = Router();


//Termino seria lo especificio que vos quieras buscar ya sea un id una galleta etc 

router.get('/:coleccion/:termino', [], buscar);

module.exports = router;
