const { validationResult } = require('express-validator');

//Iria aca primero cuando quieran hacer una peticion de cualquier tipo lo valida
//y si sale bien iria a las rutas con los checks que son middlewares tambien
//cuando no haya mas middlewares para validar ahi recien iria a los usuarios.controller

const validarCampos = (req, res, next) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json(errors);
	}
	next();
};

module.exports = {
	validarCampos,
};
