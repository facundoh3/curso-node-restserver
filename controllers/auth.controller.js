//IMPORTACIONEs DE PAQUETES
const { request, response } = require('express');
const bcryptjs=require('bcryptjs')

//IMPORTACIONES DE CARPETA EN CARPETA
const Usuario=require('../models/usuario');
const{ generarJWT} = require('../helpers/generar-jwt');
const { googleVerify } = require('../helpers/google-verify');



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
            return res.status(400).json({
                msg:'Usuario/Password no son correctos borrado de la DB estado:false'
            })
        }

        //Verificar la contraseña 
        //Desde el password que me mando el usuario y compararlo con el de la base de datos

        const validPassword=bcryptjs.compareSync(password,usuario.password)
        if (!validPassword) {
            return res.status(400).json({
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

const googleSignIn=async(req=request,res=response)=>{
    const {id_token}=req.body
    try { 
        const {correo,nombre,img}=await googleVerify(id_token)
        console.log(correo,nombre,img);

        //Correo ya existe en la base de datos ?
        let usuario = await Usuario.findOne({correo})

        //Si el usuario no existe 
        if(!usuario){
            //Tengo que crearlo 
            const data={
                nombre,
                correo,
                password:':P',//Tengo un procedimiento que evalua que el hash sea igual a la contraseña que mando el usuario entonces da igual lo que ponga pq lo va a validar con el metodo que hice 
                img,
                google:true

            }
            usuario=new Usuario(data)
            await usuario.save() //Guardarlo en la DB 
        }
        //Para las actualizaciones como que el usuario cambie de nombre en google podria hacer un else 
        //Si ya existe el usuario poder cambiarlo por el nombre nuevo 


        //Si el estado del usuario en DB esta en false aunque venga de google le niego la autorizacion
        if (!usuario.estado) {
            return res.status(401).json({
                msg:'Habla con el admin,usuario bloqueado de esta app'
            })
        }
        //Generar JWT
        const token=await generarJWT(usuario.id)


        res.json({ 
            msg:'Todo ok! google sign in',
            usuario,
            token
            // id_token,
        })
        
    } catch (error) {
        res.status(400).json({
            msg:'Token de google no es valido'
        })
    }
}

module.exports = {
	login,
    googleSignIn
};
