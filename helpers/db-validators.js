
const Role = require('../models/role');
const {Usuario,Categoria,Producto} = require('../models');

const esRoleValido = async (rol = '') => {
	const existeRol = await Role.findOne({ rol });
	if (!existeRol) {
		throw new Error(
			`El rol ${rol} no esta registrado en la DB o hay otro error por aca`,
		);
	}
};

//Verificar si el correo existe
//Lo de correo='' es por si quiero un valor por defecto
const emailExiste = async (correo = '') => {
	const existeEmail = await Usuario.findOne({ correo });
	if (existeEmail) {
		throw new Error(`El email ${correo} ya existe o hay otro error por aca`);
	}
};


//Verificar si el usuario existe por ID

const existeUsuarioPorId = async (id = '') => {
	const existeUsuario = await Usuario.findById(id);
	if (!existeUsuario) {
		throw new Error(`El id ${id} no existe `);
	}
};

//Verificar si existe categoria por id 

const existeCategoriaPorId=async(id='')=>{
	const existeCategoria=await Categoria.findById(id)
	if (!existeCategoria) {
		throw new Error(`El id: ${id} de la categoria no existe`)
	}
}

//Verificar si existe producto por id 
const existeProductoPorId=async(id='')=>{
	const existeProducto=await Producto.findById(id)
	if (!existeProducto) {
		throw new Error(`El id: ${id} de el producto no existe`)
	}
}
//Validar colecciones Permitidas
const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
	const incluida=colecciones.includes(coleccion)
	if(!incluida){
		throw new Error(`La coleccion: ${coleccion} no es permitida, las permitidas son ${colecciones}`)
	}

	return true
}

module.exports = {
	esRoleValido,
	emailExiste,
	existeUsuarioPorId,
	existeCategoriaPorId,
	existeProductoPorId,
	coleccionesPermitidas,
};
