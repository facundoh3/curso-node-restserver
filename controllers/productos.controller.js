const {request,response}=require('express')
const {Producto}=require('../models')


const crearProducto=async(req=request,res=response)=>{
    const {estado,usuario,...body}=req.body
    const productoDB= await Producto.findOne({nombre:body.nombre})

    if (productoDB) {
        return res.status(400).json({
            msg:`El producto ${productoDB.nombre} ya existe en la DB ` 
        })
    }
    //Generar la data a guardar 
    const data={
        ...body,
        nombre:body.nombre.toUpperCase(),
        usuario:req.usuario._id
    }
    const producto = new Producto(data);

	//Guardar en DB
	await producto.save();

	res.status(201).json(producto);
}



//
const actualizarProducto = async(req = request, res = response) => {

	const{id}=req.params

	const {estado,usuario,...data}=req.body

    if (data.nombre) {
        data.nombre=data.nombre.toUpperCase()
    }

    //El usuario que esta siendo actualizado
	data.usuario=req.usuario._id

	const producto=await Producto.findByIdAndUpdate(id,data,{new:true})

	res.json({
		producto
	})
};


//obtenerCategorias - paginado - total - populate(mongoose)
const obtenerProductos = async (req = request, res = response) => {
	//A ver vos le decis por el id cuantos productos vos queres te limita las categorias de los que esten activos
	//estado:true te cuenta y encuentra los documentos que cumplan con el parametro que vos le mandas desde el limite hasta donde quieras vos el populate sirve para mandarle una propiedad en este caso usuario y el valor que es el nombre osea quien creo ese producto
	const { limite = 5, desde = 0 } = req.query;

	const query = { estado: true };

	const [total, productos ] = await Promise.all([
		Producto.countDocuments(query),
		Producto.find(query)
		.populate('usuario','nombre')
		.populate('categoria','nombre')
		.skip(Number(desde))
		.limit(Number(limite)),
	]);
	res.json({
		msg: 'get API-controlador',
		total,
		productos,
	});
};

//obtenerCategoria - populate{}
const obtenerProducto = async (req = request, res = response) => {
    const {id}=req.params
    const producto=await Producto.findById(id).populate('usuario','nombre').populate('categoria','nombre')
    res.json(producto)
};

//borrarCategoria - estado:false
const borrarProducto =async (req = request, res = response) => {
	const{id}=req.params
	const productoBorrado=await Producto.findByIdAndUpdate(id,{estado:false},{new:true})
	res.status(200).json({
		productoBorrado
	})
};




module.exports={
    crearProducto,
	actualizarProducto,
	borrarProducto,
	obtenerProductos,
	obtenerProducto,
}