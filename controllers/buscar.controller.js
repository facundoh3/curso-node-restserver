const { request, response } = require('express');
const { isValidObjectId } = require('mongoose');

const { Usuario, Categoria, Producto } = require('../models/index');

const coleccionesPermitidas = ['usuarios', 'categorias', 'productos', 'roles'];

const buscarUsuarios = async (termino = '', res = response) => {
	//Por ejemplo el usuario busca usuarios y le pasa el id el id estaria en termino
	//mongoose evalua si es valido si es valido busca en el modelo de usuarios el id
	//y se lo muestra
    //Si es mongoID pasa adentro del if y listo pero si no (seria como un else) hace la busqueda

	const esMongoID = isValidObjectId(termino);

	if (esMongoID) {
		const usuario = await Usuario.findById(termino);

		return res.json({
			results: usuario ? [usuario] : [], //si el usuario existe devuelve el array con los datos del usuario si no devuelve un array vacio
		});
	}


    //Expresion regular??
    const regex=new RegExp(termino,'i')

    //Son condiciones de mongo que lo que puso el usuario en el url se fije en el nombre o ($OR) en el correo en caso de no haber ninguno y $(AND) que el estado de la cuenta sea si o si en true

    const usuarios=await Usuario.find({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    })

    const cuentaDeUsuarios=await Usuario.count({
        $or:[{nombre:regex},{correo:regex}],
        $and:[{estado:true}]
    })

    res.json({
        total:cuentaDeUsuarios,
        results:usuarios
    });

};

const buscarCategorias=async(termino='',res=response)=>{
    const esMongoID = isValidObjectId(termino);

	if (esMongoID) {
		const categoria = await Categoria.findById(termino);

		return res.json({
			results: categoria ? [categoria] : [], //si el usuario existe devuelve el array con los datos del usuario si no devuelve un array vacio
		});
	}


    //Expresion regular?? corte que envio el termino y le dijo que ignorara las minsuculas 
    const regex=new RegExp(termino,'i')

    //Busca que el nombre sea igual al termino que esta en regex sea minuscula o no 

    const categorias=await Categoria.find({nombre:regex,estado:true})

    const cuentaDeCategorias=await Categoria.count({
        $or:[{nombre:regex},{estado:true}],
    })

    res.json({
        total:cuentaDeCategorias,
        results:categorias
    });


}



const buscarProductos=async(termino='',res=response)=>{
    const esMongoID = isValidObjectId(termino);

	if (esMongoID) {
		const producto = await Producto.findById(termino).populate('categoria','nombre');

		return res.json({
			results: producto ? [producto] : [], //si el usuario existe devuelve el array con los datos del usuario si no devuelve un array vacio
		});
	}


    //Expresion regular?? corte que envio el termino y le dijo que ignorara las minsuculas 
    const regex=new RegExp(termino,'i')

    //Busca que el nombre sea igual al termino que esta en regex sea minuscula o no 

    const productos=await Producto.find({nombre:regex,estado:true}).populate('categoria','nombre')

    const cuentadeProductos=await Categoria.count({
        $or:[{nombre:regex},{estado:true}],
    })

    res.json({
        total:cuentadeProductos,
        results:productos
    });


}






const buscar = (req = request, res = response) => {
	const { coleccion, termino } = req.params;

	if (!coleccionesPermitidas.includes(coleccion)) {
		return res.status(400).json({
			msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`,
		});
	}

	switch (coleccion) {
		case 'usuarios':
			buscarUsuarios(termino, res);

			break;

		case 'categorias':
        buscarCategorias(termino,res)
			break;

		case 'productos':
            buscarProductos(termino,res)
			break;

		case 'roles':

			break;

		default:
			res.status(500).json({
				msg: 'Se me olvido hacer esta busqueda(Lo estoy implementando en colecciones permitidas pero no lo estoy aplicando)',
			});
			break;
	}
};

module.exports = {
	buscar,
};
