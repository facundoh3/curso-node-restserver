const jwt = require('jsonwebtoken');
const { request, response } = require('express');
const Usuario=require('../models/usuario');
const { findById } = require('../models/usuario');

//Los middlewares no son mas que funciones que cumplen cierta funcion para validar cosas 
//tienen un parametro de mas que se llama next que significa que puedan pasar a la siguiente validacion 
//Porque en las rutas las validaciones van de forma ASINCRONA 


const validarJWT =async (req = request, res = response, next) => {
	//ESTO SERIA EN LOS HEADERS DE /API/AUTH/LOGIN QUE SERIA JWT ESTO SIRVE PARA
	//VALIDAR LAS RUTAS A LAS CUALES EL QUE ESTE CONSUMIENDO MI API QUIERA ENTRAR
	const token = req.header('x-token');
	console.log(`Este es el token ${token}`);

	if (!token) {
		return res.status(401).json({
			msg: 'No hay token en la peticion',
		});
	}

	try {
        //El verify verifica con la clave "madre" el token que sacamos del header
        //En el json web token grabamos el uid del usuario eso lo sacamos y lo metemos en una nueva prop 
        //Que ahora va a tener esa funcion 
		const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

		//Leer al usuario que corresponde al uid 

		const usuario=await Usuario.findById(uid)

		if (!usuario) {
			return res.status(401).json({
				msg:'Token no valido - usuario no existe en DB'
			})
		}
		//Verificar si el usuario tiene el estado en true 

		if (!usuario.estado) {
			return res.status(401).json({
				msg:'Token no valido - usuario con estado:false'
			})
		}
		req.usuario = usuario;
		next();
	} catch (error) {
		console.log(error);
		res.status(401).json({
			msg: 'Token no valido mamahuvo',
		});
	}
};

module.exports = validarJWT;
