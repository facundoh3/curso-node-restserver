const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { esRoleValido, emailExiste,existeUsuarioPorId} = require('../helpers/db-validators');

const router = Router();
const {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
} = require('../controllers/usuarios.controller');

router.get('/', usuariosGet);

router.put('/:id',[
	check('id','No es un ID valido').isMongoId(),
	check('id').custom(existeUsuarioPorId),
	check('rol').custom(esRoleValido),
	validarCampos
],usuariosPut);

router.post(
	'/',
	[
		check('nombre', 'Nombre requerido').not().isEmpty(),
		check('password', 'El password debe ser mas de 6 letras').isLength({
			min: 6,
		}),
		check('correo', 'El correo ingresado no es valido ').isEmail(),
		check('correo').custom(emailExiste),
		check('rol').custom(esRoleValido),
		//check('rol','No es un rol permitido').isIn(['ADMIN_ROLE','USER_ROLE']),
		validarCampos,
	],
	usuariosPost,
);

router.delete('/:id',[
	check('id','No es un ID valido').isMongoId(),
	check('id').custom(existeUsuarioPorId),
	validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
