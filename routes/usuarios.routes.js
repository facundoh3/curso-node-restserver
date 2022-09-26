const { Router } = require('express');
const { check } = require('express-validator');

const { esRoleValido, emailExiste,existeUsuarioPorId} = require('../helpers/db-validators');
const{validarCampos,validarJWT,esAdminRole,tieneRole}=require('../middlewares')
//Lo que hice aca arriba fue en la carpeta middlewares sacar las funciones de las constantes que estan en index
// que a mi me parecian lo de abajo es el antes lo de arriba es el despues 

// const { validarCampos } = require('../middlewares/validar-campos');
// const {validarJWT} = require('../middlewares/validar-jwt');
// const { esAdminRole,tieneRole } = require('../middlewares/validar-roles');


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
	validarJWT,
	tieneRole('ADMIN_ROLE','USER_ROLE'),
	// esAdminRole, fuerza que tenga que ser admin si o si 
	check('id','No es un ID valido').isMongoId(),
	check('id').custom(existeUsuarioPorId),
	validarCampos
],usuariosDelete);

router.patch('/', usuariosPatch);

module.exports = router;
