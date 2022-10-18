//Importaciones de librerias 

const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de archivos
const { validarCampos,validarArchivoSubir} = require('../middlewares');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads.controller');
const { coleccionesPermitidas } = require('../helpers');



const router = Router();


router.post('/',[
    validarArchivoSubir
],cargarArchivo)


router.put('/:coleccion/:id',[
    validarArchivoSubir,
    check('id','El id debe ser de mongo').isMongoId(),
    //Aca revisa la coleccion que esta viniendo en el put (C) y despues las opciones que voy a permitir como usuarios etc //Aca mandamos a ocupar una funcion porque ocupamos argumentos 
    check('coleccion').custom(c =>coleccionesPermitidas(c,['usuarios','productos'])),

    validarCampos
],actualizarImagenCloudinary)
//actualizarImagen
router.get('/:coleccion/:id',[
    check('id','El id debe ser de mongo').isMongoId(),
    //Aca revisa la coleccion que esta viniendo en el put (C) y despues las opciones que voy a permitir como usuarios etc //Aca mandamos a ocupar una funcion porque ocupamos argumentos 
    check('coleccion').custom(c =>coleccionesPermitidas(c,['usuarios','productos'])),
    validarCampos
],mostrarImagen)

module.exports=router