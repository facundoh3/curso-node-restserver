const { request, response } = require('express');
// Este middleware fuerza al usuario que si o si tenga que ser admin

const esAdminRole = (req = request, res = response, next) => {
	if (!req.usuario) {
		res.status(500).json({
			msg: 'Se quiere verificar el rol sin validar el token primero',
		});
	}
	const { rol, nombre } = req.usuario;

	if (rol !== 'ADMIN_ROLE') {
		return res.status(401).json({
			msg: `${nombre} no es un administrador - No puede hacer esto`,
		});
	}

	next();
};

//COMO RECIBIR ARGUMENTOS EN MIS MIDDLEWARE:
//Tiene role es un middleware que esta en routes que tiene como parametros 2 roles entonces los recibimos en ...roles y le retornamos la funcion con req res y next que es la que se va a ejecutar en routes
const tieneRole = (...roles) => {
	return (req = request, res = response, next) => {
		console.log(roles, req.usuario.rol); // esto lo hago para ver si me llegan los roles y que rol ocupa el usuario

		if (!req.usuario) {
			res.status(500).json({
				msg: 'Se quiere verificar el rol sin validar el token primero',
			});
		}
        
		if (!roles.includes(req.usuario.rol)) {
			return res.status(401).json({
				msg: `El servicio requiere uno de estos roles ${roles}`,
			});
		}
		next();
	};
};
//Lo que hacemos aca es varificar si es un admin o no el req.usuario es el uid que sacamos del validar-jwt
// Que seria una nueva propiedad del request este req.usuario es un objeto que tiene todas las propiedades de ese
//Usuario y podriamos hacer lo que queramos con el
module.exports = {
	esAdminRole,
	tieneRole,
};
