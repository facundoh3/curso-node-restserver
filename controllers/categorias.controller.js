const { request, response } = require('express');
const { Categoria } = require('../models');



const crearCategoria = async (req = request, res = response) => {
	const nombre = req.body.nombre.toUpperCase();

	const categoriaDB = await Categoria.findOne({ nombre });

	if (categoriaDB) {
		return res.status(400).json({
			msg: `La categoria ${categoriaDB.nombre}, ya existe`,
		});
	}

	//Generar la data a guardar

	const data = {
		nombre,
		usuario: req.usuario._id,
	};
	const categoria = new Categoria(data);

	//Guardar en DB
	await categoria.save();

	res.status(201).json(categoria);
};

//
const actualizarCategoria = async(req = request, res = response) => {

	const{id}=req.params

	const {estado,usuario,...data}=req.body

	data.nombre=data.nombre.toUpperCase()

	data.usuario=req.usuario._id

	const categoria=await Categoria.findByIdAndUpdate(id,data,{new:true})

	res.json({
		categoria
	})
};


//obtenerCategorias - paginado - total - populate(mongoose)
const obtenerCategorias = async (req = request, res = response) => {
	//A ver vos le decis por el id cuantos productos vos queres te limita las categorias de los que esten activos
	//estado:true te cuenta y encuentra los documentos que cumplan con el parametro que vos le mandas desde el limite hasta donde quieras vos el populate sirve para mandarle una propiedad en este caso usuario y el valor que es el nombre osea quien creo ese producto
	const { limite = 5, desde = 0 } = req.query;

	const query = { estado: true };

	const [total, categorias] = await Promise.all([
		Categoria.countDocuments(query),
		Categoria.find(query)
		.populate('usuario','nombre')
		.skip(Number(desde))
		.limit(Number(limite)),
	]);
	res.json({
		msg: 'get API-controlador',
		total,
		categorias,
	});
};


//borrarCategoria - estado:false
const borrarCategoria =async (req = request, res = response) => {
	const{id}=req.params
	const categoriaBorrada=await Categoria.findByIdAndUpdate(id,{estado:false},{new:true})
	res.status(200).json({
		categoriaBorrada
	})
};



//obtenerCategoria - populate{}
const obtenerCategoria = async (req = request, res = response) => {
	const {id}=req.params
	const categoria=await Categoria.findById(id).populate('usuario','nombre')
	res.json(categoria)
};




module.exports = {
	crearCategoria,
	actualizarCategoria,
	borrarCategoria,
	obtenerCategorias,
	obtenerCategoria,
};
