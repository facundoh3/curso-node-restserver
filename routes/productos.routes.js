//Importaciones de librerias

const { Router } = require('express');
const { check } = require('express-validator');

//Importaciones de carpetas
const {
	crearProducto,
	obtenerProducto,
	obtenerProductos,
	actualizarProducto,
	borrarProducto,
} = require('../controllers/productos.controller');
const { existeProductoPorId, existeCategoriaPorId } = require('../helpers/db-validators');
const { validarJWT, validarCampos, esAdminRole } = require('../middlewares');

const router = Router();

//Obtener todas las categorias - publico
router.get('/', obtenerProductos);

//Obtener categoria por id - publico
router.get(
	'/:id',
	[
		check('id', 'No es un id de Mongo Valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	obtenerProducto,
);

//Crear categoria - Cualquiera con token valido
router.post(
	'/',
	[
		validarJWT,
		check('nombre', 'El nombre es obligatorio').not().isEmpty(),
		check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('categoria').custom(existeCategoriaPorId),
		validarCampos,
	],
	crearProducto,
);

//Actualizar - Privado - Cualquiera con token valido
router.put(
	'/:id',
	[
		validarJWT,
		// check('categoria', 'No es un id de Mongo valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	actualizarProducto,
);

//Borrar categoria - Admin - Cambiar Estado de True a False
router.delete(
	'/:id',
	[
		validarJWT,
		esAdminRole,
		check('id', 'No es un id de Mongo Valido').isMongoId(),
		check('id').custom(existeProductoPorId),
		validarCampos,
	],
	borrarProducto,
);

module.exports = router;
