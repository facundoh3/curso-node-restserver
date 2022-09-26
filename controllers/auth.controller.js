//IMPORTACIONEs DE PAQUETES
const { request, response } = require('express');
const bcryptjs=require('bcryptjs')

//IMPORTACIONES DE CARPETA EN CARPETA
const Usuario=require('../models/usuario');
const generarJWT = require('../helpers/generar-jwt');


const login = async (req = request, res = response) => {
	const { correo, password } = req.body;

	try {
        //Verificar si el email existe

        const usuario=await Usuario.findOne({correo});
        if(!usuario){
            return res.status(400).json({
                msg:'El usuario / password no son correctos'
            })
        }
        //Si el usuario todavia esta activo en DB

        if(!usuario.estado){
            res.status(400).json({
                msg:'La cuenta se elimino porque no esta en DB'
            })
        }

        //Verificar la contraseña 
        //Desde el password que me mando el usuario y compararlo con el de la base de datos

        const validPassword=bcryptjs.compareSync(password,usuario.password)
        if (!validPassword) {
            res.status(400).json({
                msg:'El password es invalido'
            })
        }

        //Generar el JWT (Json web token)
        const token=await generarJWT(usuario.id)


		res.json({
			msg: 'todo ok',
            usuario,
            token,

		});
	} catch (error) {
		console.log(error);
		res.status(500).json({
			msg: 'Algo fallo por aca',
		});
	}
};

module.exports = {
	login,
};
