const { response, request } = require('express');
const Usuario = require('../models/usuario');
const bcryptjs = require('bcryptjs');

const usuariosGet = async (req = request, res = response) => {
	//*Recoger Usuarios

	const { limite = 5, desde = 0 } = req.query;

	const query={estado:true}

	const [total,usuarios]=await Promise.all([
		Usuario.countDocuments(query),
		Usuario.find(query)
			.skip(Number(desde))
			.limit(Number(limite))
	])	
	res.json({
		msg: 'get API-controlador',
		total,
		usuarios
	});
};

const usuariosPut = async (req = request, res = response) => {
	//*Actualizacion de usuarios
	//Password google y correo es algo que no quiero que se actualize aun
	//Pero el resto si quiero lo puedo actualizar y solo con verificaciones (IF) Podria actualizar esa info
	const { id } = req.params;
	const { password, google, correo, _id, ...resto } = req.body;

	//VALIDAR CONTRA BASE DE DATOS
	if (password) {
		//Encriptar contraseña
		const salt = bcryptjs.genSaltSync(); 
		resto.password = bcryptjs.hashSync(password, salt);
	}

	const usuario = await Usuario.findByIdAndUpdate(id, resto);

	res.json({
		msg: 'put API',
		usuario,
	});
};

const usuariosPost = async (req = request, res = response) => {
	//* Creacion de usuario
	//Esto sirve para sacar unicamente lo que esta ahi si el usuario
	//envia mas cosas de lo que esta por defecto por ejemplo google
	//no va a poder porque solo le pedi los datos que estan abajo nomas
	// todo esto es para grabarlo como un usuario nuevo

	const { nombre, correo, password, rol } = req.body;
	const usuario = new Usuario({ nombre, correo, password, rol });

	//Encriptar la contraseña

	const salt = bcryptjs.genSaltSync();
	usuario.password = bcryptjs.hashSync(password, salt);

	//Guardar en Base de datos
	//metodo de mongoose

	await usuario.save();

	res.json({
		msg: 'post API',
		usuario,
	});
};

const usuariosDelete = async(req = request, res = response) => {
	const{id}=req.params

	//Fisicamente lo borramos
	// const usuario=await Usuario.findByIdAndDelete(id);
	const usuario = await Usuario.findByIdAndUpdate(id,{estado:false})
	res.json({
		msg: 'delete API',
		usuario
	});
};

const usuariosPatch = (req = request, res = response) => {
	res.json({
		msg: 'patch  API',
	});
};
module.exports = {
	usuariosGet,
	usuariosPut,
	usuariosPost,
	usuariosDelete,
	usuariosPatch,
};
