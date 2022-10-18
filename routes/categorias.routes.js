//Importaciones de librerias

const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de carpetas
const {
	crearCategoria,
	obtenerCategoria,
	obtenerCategorias,
	actualizarCategoria,
	borrarCategoria,
} = require('../controllers/categorias.controller');
const { existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

//Obtener categoria por id - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo Valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	obtenerCategoria,
);

//Crear categoria - Cualquiera con token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		validarCampos,
	],
	crearCategoria,
);

//Actualizar - Privado - Cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	actualizarCategoria,
);

//Borrar categoria - Admin - Cambiar Estado de True a False
router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo Valido').isMongoId(),
		check('id').custom(existeCategoriaPorId),
		validarCampos,
	],
	borrarCategoria,
);

module.exports = router;
