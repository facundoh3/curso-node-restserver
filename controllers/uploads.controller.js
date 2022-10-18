const { response, request } = require('express');
const path=require('path')
const fs=require('fs')
const cloudinary=require('cloudinary').v2
cloudinary.config(process.env.CLOUDINARY_URL);

const { subirArchivo } = require('../helpers');
const { Usuario, Producto } = require('../models');

const cargarArchivo = async (req = request, res = response) => {
	try {
		//subir txt,md en la carpeta textos
		// const pathArchivo = await subirArchivo(req.files, ['txt', 'md'],'textos');
		//subir imgs en la carpeta imgs undefined quiere decir que enviamos el archivo a la fuerza osea el argumento por defecto que esta en subir-archivo.js
		const pathArchivo = await subirArchivo(req.files, undefined, 'imgs');
		res.json({
			nombre: pathArchivo,
		});
	} catch (msg) {
		res.status(400).json({
			msg: msg,
		});
	}
};

const actualizarImagen = async (req = request, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case 'productos':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: 'Se me colgo validar esto',
			});
			break;
	}
    

    //Limpiar las imagenes previas
    if (modelo.img) {
        //Hay que borrar la imagen del servidor el dirname es la carpeta en la que estoy ahora me tengo q ir a uploads que haga la carperta usuario o producto(coleccion) y el path del modelo
        const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.img)
        //Si existe ese path lo va a borrar porque seria toda la mierda de fotos anteriores 
        if (fs.existsSync(pathImagen)) {
            fs.unlinkSync(pathImagen)
        }
    }
	//El modelo como que fue variando poque es un let al fin y al cabo aca ya tiene todas las propiedades del modelo tanto de usuarios como el de productos (depende de que le hayas enviado) por lo tanto tiene las propiedades de la base de datos 

	const nombre = await subirArchivo(req.files, undefined, coleccion);
    modelo.img=nombre
    await modelo.save();
    res.json(modelo)
};

const mostrarImagen=async (req=request,res=response)=>{
    const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case 'productos':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: 'Se me colgo validar esto',
			});
			break;
	}
    
    //Limpiar las imagenes previas
    if (modelo.img) {
        //Hay que actualizar la imagen del servidor el dirname es la carpeta en la que estoy ahora me tengo q ir a uploads que haga la carperta usuario o producto(coleccion) y el path del modelo
        const pathImagen=path.join(__dirname,'../uploads',coleccion,modelo.img)
        //Si existe ese path lo va a mostrar con el sendFIle
        if (fs.existsSync(pathImagen)) {
            res.sendFile(pathImagen)
        }
    }

	//Mandar una imagen en caso que no exista una 
	const pathImagen=path.join(__dirname,'../assets/no-image.jpg')
	res.sendFile(pathImagen)
}

//Cloudinary servicio para subir imagenes recortarlas etc etc

const actualizarImagenCloudinary = async (req = request, res = response) => {
	const { id, coleccion } = req.params;

	let modelo;

	switch (coleccion) {
		case 'usuarios':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Usuario.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un usuario con el id ${id}`,
				});
			}
			break;
		case 'productos':
			//Estoy validando que si hay un id en esa coleccion de 'usuarios'
			modelo = await Producto.findById(id);
			if (!modelo) {
				return res.status(400).json({
					msg: `No existe un producto con el id ${id}`,
				});
			}
			break;
		default:
			return res.status(500).json({
				msg: 'Se me colgo validar esto',
			});
			break;
	}
   


    //Limpiar las imagenes previas de cloudinary(limpieza)
    if (modelo.img) {
        const nombreArr=modelo.img.split('/')
		const nombre = nombreArr[nombreArr.length-1]
		const [public_id]=nombre.split('.')
		cloudinary.uploader.destroy(public_id)
    }
	//Saca la url temporal que enviamos para cargar el archivo y eso lo subimos sacamos la url segura de clodinary y eso lo metemos a nuestro modelo y lo guardamos 

	console.log(req.files.archivo);

	const{tempFilePath}=req.files.archivo

	const {secure_url}= await cloudinary.uploader.upload(tempFilePath)
	
	modelo.img=secure_url

	await modelo.save();

    res.json(modelo)
};

module.exports = {
	cargarArchivo,
	actualizarImagen,
    mostrarImagen,
	actualizarImagenCloudinary
};
