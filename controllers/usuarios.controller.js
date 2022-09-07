const { response, request } = require('express');

const usuariosGet = (req = request, res = response) => {
	const {q,nombre = "no name",apikey,page=1,limit=10} = req.query;
	res.json({
		msg: 'get API-controlador',
		limit:limit, 
		page:page,
		q: q,
		nombre:nombre,
		apikey: apikey
	});
};

const usuariosPut = (req = request, res = response) => {
	const { id } = req.params;
	res.json({
		msg: 'put API',
		id,
	});
};

const usuariosPost = (req = request, res = response) => {
	const body = req.body;
	//const {id,username}=req.body
	res.json({
		msg: 'post API',
		body,
	});
};

const usuariosDelete = (req = request, res = response) => {
	res.json({
		msg: 'delete API',
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
